'use client'

import React from 'react'

interface AnimatedRnDProps {
  className?: string
}

// Documents R&D confidentiels
const DOCUMENTS = [
  { id: 'brevet', x: 100, y: 90, color: '#3b82f6', delay: 0, type: 'brevet' }, // Brevet - Bleu
  { id: 'formule', x: 220, y: 90, color: '#22c55e', delay: 0.4, type: 'formule' }, // Formule - Vert
  { id: 'plan', x: 340, y: 90, color: '#f59e0b', delay: 0.8, type: 'plan' }, // Plan technique - Orange
  { id: 'data', x: 460, y: 90, color: '#8b5cf6', delay: 1.2, type: 'data' }, // Données - Violet
]

// Hub sécurisé central (modèle souverain)
const HUB = { x: 280, y: 250 }

// Courbes de connexion sécurisées
const getCurvePath = (doc: (typeof DOCUMENTS)[0]) => {
  const startX = doc.x
  const startY = doc.y + 35
  const endX = HUB.x
  const endY = HUB.y - 50

  const ctrlX1 = startX
  const ctrlY1 = startY + 50
  const ctrlX2 = endX + (startX < HUB.x ? -30 : 30)
  const ctrlY2 = endY - 20

  return `M ${startX} ${startY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${endX} ${endY}`
}

export const AnimatedRnD: React.FC<AnimatedRnDProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 560 380"
        fill="none"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="R&D sécurisée avec modèle souverain"
      >
        <defs>
          <filter id="rnd-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="rnd-signal" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Paths pour animations */}
          {DOCUMENTS.map((doc) => (
            <path key={`path-${doc.id}`} id={`rnd-path-${doc.id}`} d={getCurvePath(doc)} />
          ))}
        </defs>

        {/* Connexions sécurisées (lignes pointillées = cryptées) */}
        <g className="connections">
          {DOCUMENTS.map((doc) => (
            <path
              key={`conn-${doc.id}`}
              d={getCurvePath(doc)}
              fill="none"
              stroke={doc.color}
              strokeWidth="2"
              strokeDasharray="8 4"
              opacity="0.5"
              strokeLinecap="round"
            >
              <animate
                attributeName="opacity"
                values="0.3;0.7;0.3"
                dur="3s"
                begin={`${doc.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                values="0;24"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
          ))}
        </g>

        {/* Flux de données cryptées */}
        <g className="data-flows" filter="url(#rnd-signal)">
          {DOCUMENTS.map((doc) => (
            <g key={`flow-${doc.id}`}>
              <circle r="4" fill={doc.color}>
                <animateMotion dur="2.5s" begin={`${doc.delay}s`} repeatCount="indefinite">
                  <mpath href={`#rnd-path-${doc.id}`} />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.9;1"
                  dur="2.5s"
                  begin={`${doc.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
              {/* Petit cadenas sur le flux */}
              <g opacity="0">
                <animateMotion dur="2.5s" begin={`${doc.delay}s`} repeatCount="indefinite">
                  <mpath href={`#rnd-path-${doc.id}`} />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values="0;0.8;0.8;0"
                  keyTimes="0;0.1;0.9;1"
                  dur="2.5s"
                  begin={`${doc.delay}s`}
                  repeatCount="indefinite"
                />
                <rect x="-3" y="-2" width="6" height="5" rx="1" fill="white" />
                <path
                  d="M-1.5 -2V-4C-1.5 -5.5 1.5 -5.5 1.5 -4V-2"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </g>
            </g>
          ))}
        </g>

        {/* Cartes des documents R&D */}
        <g className="doc-cards" filter="url(#rnd-glow)">
          {DOCUMENTS.map((doc) => (
            <g key={doc.id}>
              <rect
                x={doc.x - 32}
                y={doc.y - 32}
                width="64"
                height="64"
                rx="12"
                fill="#1e293b"
                stroke={doc.color}
                strokeWidth="1.5"
                opacity="0.95"
              />

              {/* Icône Brevet */}
              {doc.type === 'brevet' && (
                <g transform={`translate(${doc.x}, ${doc.y})`}>
                  {/* Document avec sceau */}
                  <rect
                    x="-14"
                    y="-18"
                    width="28"
                    height="36"
                    rx="2"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  {/* Lignes de texte */}
                  <line
                    x1="-8"
                    y1="-10"
                    x2="8"
                    y2="-10"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  <line
                    x1="-8"
                    y1="-4"
                    x2="8"
                    y2="-4"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  <line
                    x1="-8"
                    y1="2"
                    x2="4"
                    y2="2"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  {/* Sceau/tampon */}
                  <circle
                    cx="4"
                    cy="12"
                    r="6"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                  <path d="M4 9L5.5 11L4 13L2.5 11Z" fill="white" opacity="0.8" />
                </g>
              )}

              {/* Icône Formule */}
              {doc.type === 'formule' && (
                <g transform={`translate(${doc.x}, ${doc.y})`}>
                  {/* Fiole/bécher */}
                  <path
                    d="M-6 -16V-6L-14 14C-14 16 -12 18 -10 18H10C12 18 14 16 14 14L6 -6V-16"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                  {/* Liquide */}
                  <path d="M-10 8L10 8L6 -2H-6L-10 8Z" fill="white" opacity="0.3" />
                  {/* Bouchon */}
                  <rect
                    x="-8"
                    y="-18"
                    width="16"
                    height="4"
                    rx="1"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  {/* Bulles */}
                  <circle cx="-4" cy="4" r="2" fill="white" opacity="0.6">
                    <animate attributeName="cy" values="4;0;4" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="2" cy="8" r="1.5" fill="white" opacity="0.5">
                    <animate
                      attributeName="cy"
                      values="8;4;8"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              )}

              {/* Icône Plan technique */}
              {doc.type === 'plan' && (
                <g transform={`translate(${doc.x}, ${doc.y})`}>
                  {/* Feuille de plan */}
                  <rect
                    x="-16"
                    y="-14"
                    width="32"
                    height="28"
                    rx="2"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  {/* Grille technique */}
                  <line
                    x1="-16"
                    y1="0"
                    x2="16"
                    y2="0"
                    stroke="white"
                    strokeWidth="0.5"
                    opacity="0.4"
                  />
                  <line
                    x1="0"
                    y1="-14"
                    x2="0"
                    y2="14"
                    stroke="white"
                    strokeWidth="0.5"
                    opacity="0.4"
                  />
                  {/* Forme technique (engrenage simplifié) */}
                  <circle
                    cx="0"
                    cy="0"
                    r="8"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                  <circle cx="0" cy="0" r="3" fill="white" opacity="0.7" />
                  {/* Dents */}
                  <line
                    x1="0"
                    y1="-8"
                    x2="0"
                    y2="-11"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.7"
                  />
                  <line x1="8" y1="0" x2="11" y2="0" stroke="white" strokeWidth="2" opacity="0.7" />
                  <line x1="0" y1="8" x2="0" y2="11" stroke="white" strokeWidth="2" opacity="0.7" />
                  <line
                    x1="-8"
                    y1="0"
                    x2="-11"
                    y2="0"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.7"
                  />
                </g>
              )}

              {/* Icône Données */}
              {doc.type === 'data' && (
                <g transform={`translate(${doc.x}, ${doc.y})`}>
                  {/* Base de données (cylindre) */}
                  <ellipse
                    cx="0"
                    cy="-12"
                    rx="14"
                    ry="6"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  <path d="M-14 -12V12" stroke="white" strokeWidth="1.5" opacity="0.9" />
                  <path d="M14 -12V12" stroke="white" strokeWidth="1.5" opacity="0.9" />
                  <ellipse
                    cx="0"
                    cy="12"
                    rx="14"
                    ry="6"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  {/* Lignes de données */}
                  <ellipse
                    cx="0"
                    cy="-2"
                    rx="14"
                    ry="5"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                    opacity="0.4"
                  />
                  <ellipse
                    cx="0"
                    cy="6"
                    rx="14"
                    ry="5"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                    opacity="0.4"
                  />
                </g>
              )}

              {/* Badge CONFIDENTIEL */}
              <g transform={`translate(${doc.x + 20}, ${doc.y - 20})`}>
                <circle r="8" fill="#ef4444" opacity="0.9">
                  <animate
                    attributeName="opacity"
                    values="0.7;1;0.7"
                    dur="2s"
                    begin={`${doc.delay}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                <path
                  d="M-3 -1V-3.5C-3 -5 3 -5 3 -3.5V-1M-4 -1H4V3C4 4 3 5 0 5C-3 5 -4 4 -4 3V-1Z"
                  fill="white"
                  opacity="0.9"
                />
              </g>
            </g>
          ))}
        </g>

        {/* Hub sécurisé central (modèle souverain) */}
        <g className="hub" filter="url(#rnd-glow)">
          {/* Cercle de protection externe */}
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r="65"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.3"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${HUB.x} ${HUB.y}`}
              to={`360 ${HUB.x} ${HUB.y}`}
              dur="30s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Cercle pulsant */}
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r="55"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1"
            opacity="0"
          >
            <animate attributeName="r" values="50;65;50" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Fond du hub */}
          <circle cx={HUB.x} cy={HUB.y} r="50" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />

          {/* Bouclier de sécurité */}
          <g transform={`translate(${HUB.x}, ${HUB.y})`}>
            {/* Forme du bouclier */}
            <path
              d="M0 -28C-18 -28 -24 -20 -24 -12C-24 8 0 28 0 28C0 28 24 8 24 -12C24 -20 18 -28 0 -28Z"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.9"
            />
            {/* Cadenas au centre du bouclier */}
            <rect
              x="-8"
              y="-4"
              width="16"
              height="14"
              rx="2"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.9"
            />
            <path
              d="M-4 -4V-10C-4 -14 4 -14 4 -10V-4"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.9"
            />
            {/* Trou de serrure */}
            <circle cx="0" cy="2" r="2" fill="white" opacity="0.8" />
            <rect x="-1" y="2" width="2" height="5" fill="white" opacity="0.8" />
          </g>
        </g>
      </svg>
    </div>
  )
}
