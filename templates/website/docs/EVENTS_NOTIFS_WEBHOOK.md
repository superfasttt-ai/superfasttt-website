notifications et webhooks

documentation de référence pour l’architecture, l’implémentation et l’usage du système d’événements, de notifications et de webhooks dans superfasttt.

objectifs

Le système de notifications et webhooks de superfasttt permet :
• de connecter toutes les briques du core et des extensions via un bus d’événements interne
• d’exposer ces événements aux agents, au sdk et aux outils externes
• de déclencher des actions asynchrones (traitements, alertes, automatisations)
• d’alimenter l’interface admin en temps réel
• de permettre aux développeurs de créer et d’utiliser leurs propres événements dans leurs agents

Le système est entièrement souverain, modulaire et pensée pour les milliers d’instances clientes superfasttt.

⸻

architecture globale

Le système repose sur quatre couches distinctes et coopérantes :

[core business logic et extensions]
↓ émet
[event bus interne]
↓ dispatch
[notification engine]
↓ diffuse
[channels: websocket, http webhook, email, sdk]

Chaque couche est autonome et peut évoluer sans casser les autres.

⸻

event bus

rôle

Le bus d’événements est le cœur du système. Il assure :
• la publication des événements par le core, les extensions et les agents via le sdk
• la propagation aux composants internes (notification engine, hooks extensions)
• la garantie d’une architecture découplée et réactive
• la possibilité de gérer le retry, le replay et le dead letter

caractéristiques
• publisher subscriber
• typage strict via schemas pydantic
• persistence optionnelle pour audit et replay
• ordre garanti par type d’événement
• gestion automatique des erreurs
• intégration native avec redis streams ou postgresql listen notify

proposition initiale

redis streams pour la performance, la stabilité et la simplicité.

postgresql sert d’audit trail mais pas de file active.

⸻

events et schemas

format standard d’un événement

{
"id": "evt_abc123",
"type": "document.indexed",
"version": "1.0",
"timestamp": "2025-11-17T10:30:00Z",
"source": "rag-engine",
"tenant_id": "tenant_x",
"user_id": "user_123",
"data": {},
"metadata": {
"correlation_id": "req_456",
"causation_id": "evt_789"
}
}

catégories d’événements

documents
• document.uploaded
• document.indexed
• document.indexed.failed
• document.updated
• document.deleted

conversations
• conversation.started
• conversation.message.received
• conversation.message.sent
• conversation.completed
• conversation.archived

rag et intelligence
• rag.query.started
• rag.query.completed
• rag.index.updated
• agent.invoked
• agent.response.generated

intégrations
• integration.connected
• integration.disconnected
• integration.sync.started
• integration.sync.completed
• integration.error

administration et sécurité
• user.invited
• user.activated
• user.deactivated
• role.assigned
• api_key.created

événements des agents (via sdk)

Les développeurs peuvent créer leurs propres événements :
• agent.crm.contact_created
• agent.crm.contact_updated
• agent.support.ticket_closed
• agent.finance.payment_failed

Ces événements deviennent visibles dans l’admin et utilisables comme n’importe quel événement du core.

⸻

registry des webhooks

Le registre des webhooks permet aux tenants de s’abonner à des événements internes.

structure en base

CREATE TABLE webhooks (
id UUID PRIMARY KEY,
tenant_id UUID NOT NULL,
name VARCHAR(255),
url TEXT NOT NULL,
secret TEXT NOT NULL,
events TEXT[] NOT NULL,
is_active BOOLEAN DEFAULT true,
retry_config JSONB,
headers JSONB,
created_at TIMESTAMPTZ,
created_by UUID,
last_triggered_at TIMESTAMPTZ,
failure_count INTEGER DEFAULT 0
);

caractéristiques
• gestion des wildcards (ex: document.\*)
• ciblage par tenant
• secrets hmac pour signature
• désactivation automatique après trop d’échecs
• configuration personnalisée par webhook

⸻

notification engine

rôle

Le notification engine reçoit les événements via le bus et détermine :
• quels webhooks doivent être appelés
• quels agents doivent réagir
• quelles sessions websocket doivent être notifiées
• quelles actions internes doivent être déclenchées

responsabilités 1. écouter en continu le bus d’événements 2. filtrer et matcher les abonnements 3. préparer les payloads 4. router vers les canaux de livraison 5. gérer les retries 6. envoyer dans la dead letter si nécessaire

workers asynchrones
• traitement via arq ou celery
• files séparées par type d’événement
• isolation par tenant

⸻

channels de livraison

websocket sse

Permet :
• les notifications temps réel dans l’admin
• le streaming d’état
• les updates instantanées pour les apps

Endpoint :

GET /api/v1/events/stream

webhooks http

Payload envoyé via POST signé.

headers standard

X-Webhook-ID
X-Webhook-Signature
X-Webhook-Timestamp
X-Webhook-Event
Content-Type: application/json

stratégie de retry
• immédiat
• 1 min
• 5 min
• 15 min
• 1 h
• abandon et désactivation si persistant

notifications email

Réservé aux alertes :
• quotas dépassés
• erreurs critiques
• statut d’intégration

Disponible en phase avancée du projet.

⸻

intake par les extensions

via manifest

Une extension peut écouter un événement :

{
"subscriptions": [
{
"event": "document.indexed",
"handler": "on_document_indexed"
}
]
}

via code python

@hook("document.indexed")
async def on_document_indexed(event):
...

⸻

sdk : création et usage des événements

Le sdk donne aux développeurs la possibilité de créer et utiliser des événements dans leurs agents.

déclarer un événement

await client.events.define({
event: 'agent.crm.contact_created',
description: 'contact créé par un agent crm'
})

émettre un événement

await client.events.emit('agent.crm.contact_created', {
id: 'c_123',
email: 'john@doe.com'
})

écouter un événement en temps réel

client.events.on('document.indexed', (payload) => {
console.log(payload)
})

abonnement webhook via sdk

await client.events.subscribe({
events: ['agent.crm.contact_created'],
url: 'https://myapp.com/webhooks',
secret: 'xxx'
})

⸻

observabilité et monitoring

métriques
• nombre d’événements émis
• latence de livraison
• taux d’échec par webhook
• taille des files
• nombre de retries
• dead letter count

logs structurés

Chaque événement est journalisé :
• id
• type
• payload
• tenant
• statut
• timestamp
• retries
• destination

alertes
• taux d’échec trop élevé
• file en saturation
• dead letter non vide

⸻

api admin

endpoints webhooks

POST /api/v1/webhooks
GET /api/v1/webhooks
GET /api/v1/webhooks/{id}
PUT /api/v1/webhooks/{id}
DELETE /api/v1/webhooks/{id}
POST /api/v1/webhooks/{id}/test
GET /api/v1/webhooks/{id}/logs
POST /api/v1/webhooks/{id}/replay

endpoints events

GET /api/v1/events
GET /api/v1/events/{id}
GET /api/v1/events/stream
POST /api/v1/events/define
POST /api/v1/events/emit

⸻

souveraineté et conformité
• données stockées dans la région du tenant
• audit complet disponible
• possibilité d’export en jsonl ou parquet
• hmac pour signature
• tls obligatoire pour webhooks
• secrets chiffrés via fernet

⸻

phasage d’implémentation

phase 1
• event bus interne (redis streams ou postgresql)
• événements core principaux
• webhooks http simples
• retries basiques

phase 2
• websocket temps réel
• catalogue complet d’événements
• admin ui pour webhooks
• monitoring prometheus
• création d’événements via sdk

phase 3
• replay complet
• circuit breaker avancé
• analytics événementiels
• email notifications
• transformations custom de payload

⸻

conclusion

Ce système fournit :
• un bus souverain et robuste
• un moteur de notification puissant
• une exposition contrôlée pour les extensions et agents
• un sdk qui permet de créer de vrais workflows event driven
• une intégration naturelle et cohérente dans superfasttt
