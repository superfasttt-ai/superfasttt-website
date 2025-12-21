'use client'

import React from 'react'

interface ModelsProps {
  className?: string
}

// Modèles d'IA alignés horizontalement - couleurs comme le visuel de référence
const MODELS = [
  { id: 'openai', x: 100, y: 90, color: '#4ade80', delay: 0 }, // Vert clair
  { id: 'anthropic', x: 200, y: 90, color: '#f59e0b', delay: 0.3 }, // Orange/jaune
  { id: 'mistral', x: 300, y: 90, color: '#22d3ee', delay: 0.6 }, // Cyan
  { id: 'more', x: 400, y: 90, color: '#6b7280', delay: 0.9 }, // Gris
]

// Point de convergence (plateforme) en bas à droite
const PLATFORM = { x: 480, y: 260 }

// Points de contrôle pour les courbes de Bézier - style comme le visuel
const getCurvePath = (model: (typeof MODELS)[0]) => {
  const startX = model.x
  const startY = model.y + 35
  const endX = PLATFORM.x
  const endY = PLATFORM.y - 40

  // Courbe qui descend verticalement puis courbe vers la droite
  const ctrlX1 = startX
  const ctrlY1 = startY + 80
  const ctrlX2 = endX - 40
  const ctrlY2 = endY

  return `M ${startX} ${startY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${endX} ${endY}`
}

export const Models: React.FC<ModelsProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 600 380"
        fill="none"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Visualisation de modèles d'IA interchangeables connectés à votre plateforme"
      >
        <defs>
          {/* Filtre de lueur */}
          <filter id="models-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Filtre de lueur pour les signaux */}
          <filter id="signal-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient pour la plateforme */}
          <linearGradient id="platform-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>

          {/* Paths pour l'animation de mouvement */}
          {MODELS.map((model) => (
            <path key={`path-${model.id}`} id={`path-${model.id}`} d={getCurvePath(model)} />
          ))}
        </defs>

        {/* Connexions courbes colorées */}
        <g className="connections">
          {MODELS.map((model) => (
            <path
              key={`conn-${model.id}`}
              d={getCurvePath(model)}
              fill="none"
              stroke={model.color}
              strokeWidth="2.5"
              opacity="0.7"
              strokeLinecap="round"
            >
              <animate
                attributeName="opacity"
                values="0.5;0.85;0.5"
                dur="3s"
                begin={`${model.delay}s`}
                repeatCount="indefinite"
              />
            </path>
          ))}
        </g>

        {/* Flux de données animés sur les courbes */}
        <g className="data-flows" filter="url(#signal-glow)">
          {MODELS.map((model) => (
            <circle key={`flow-${model.id}`} r="6" fill={model.color}>
              <animateMotion dur="2.5s" begin={`${model.delay}s`} repeatCount="indefinite">
                <mpath href={`#path-${model.id}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.9;1"
                dur="2.5s"
                begin={`${model.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* Cartes des modèles d'IA */}
        <g className="model-cards" filter="url(#models-glow)">
          {MODELS.map((model) => (
            <g key={model.id}>
              {/* Carte avec coins arrondis */}
              <rect
                x={model.x - 35}
                y={model.y - 35}
                width="70"
                height="70"
                rx="14"
                fill="#1e293b"
                stroke={model.color}
                strokeWidth="1.5"
                opacity="0.95"
              />

              {/* Icône selon le modèle */}
              {model.id === 'openai' && (
                <g transform={`translate(${model.x}, ${model.y})`}>
                  {/* Logo OpenAI simplifié (hexagone avec cercle) */}
                  <path
                    d="M0 -14L12 -7V7L0 14L-12 7V-7L0 -14Z"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="5"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                </g>
              )}

              {model.id === 'anthropic' && (
                <text
                  x={model.x}
                  y={model.y + 6}
                  textAnchor="middle"
                  fill="white"
                  fontSize="20"
                  fontWeight="bold"
                  opacity="0.9"
                >
                  AI
                </text>
              )}

              {model.id === 'mistral' && (
                <g transform={`translate(${model.x}, ${model.y})`}>
                  {/* Symbole Mistral - cercle orange avec centre */}
                  <circle cx="0" cy="0" r="12" fill={model.color} opacity="0.9" />
                  <circle cx="0" cy="0" r="5" fill="#1e293b" />
                </g>
              )}

              {model.id === 'more' && (
                <g transform={`translate(${model.x}, ${model.y})`}>
                  {/* Points de suspension centrés */}
                  <circle cx="-12" cy="0" r="4" fill="white" opacity="0.7" />
                  <circle cx="0" cy="0" r="4" fill="white" opacity="0.7" />
                  <circle cx="12" cy="0" r="4" fill="white" opacity="0.7" />
                </g>
              )}
            </g>
          ))}
        </g>

        {/* Plateforme centrale (votre application) */}
        <g className="platform" filter="url(#models-glow)">
          {/* Cercle externe pulsant */}
          <rect
            x={PLATFORM.x - 45}
            y={PLATFORM.y - 45}
            width="90"
            height="90"
            rx="18"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1"
            opacity="0"
          >
            <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
            <animate attributeName="width" values="90;100;90" dur="3s" repeatCount="indefinite" />
            <animate attributeName="height" values="90;100;90" dur="3s" repeatCount="indefinite" />
            <animate
              attributeName="x"
              values={`${PLATFORM.x - 45};${PLATFORM.x - 50};${PLATFORM.x - 45}`}
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              values={`${PLATFORM.y - 45};${PLATFORM.y - 50};${PLATFORM.y - 45}`}
              dur="3s"
              repeatCount="indefinite"
            />
          </rect>

          {/* Carte principale */}
          <rect
            x={PLATFORM.x - 40}
            y={PLATFORM.y - 40}
            width="80"
            height="80"
            rx="16"
            fill="#1e293b"
            stroke="#374151"
            strokeWidth="1"
          />

          {/* Logo SUPERFASTTT (triangle/flèche vers le haut dans un cercle) */}
          <circle cx={PLATFORM.x} cy={PLATFORM.y} r="22" fill="white" opacity="0.95" />
          <path
            d={`M${PLATFORM.x} ${PLATFORM.y - 12} L${PLATFORM.x + 12} ${PLATFORM.y + 8} L${PLATFORM.x - 12} ${PLATFORM.y + 8} Z`}
            fill="#1e293b"
            opacity="0.9"
          />
        </g>

        {/* Particules ambiantes subtiles */}
        <g className="particles">
          {[
            { x: 150, y: 180, delay: 0 },
            { x: 350, y: 200, delay: 1.2 },
            { x: 420, y: 150, delay: 2.4 },
          ].map((p, i) => (
            <circle key={`particle-${i}`} cx={p.x} cy={p.y} r="2" fill="#22d3ee" opacity="0">
              <animate
                attributeName="cy"
                values={`${p.y};${p.y - 15};${p.y}`}
                dur="4s"
                begin={`${p.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.3;0"
                dur="4s"
                begin={`${p.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      </svg>
    </div>
  )
}

export default Models
