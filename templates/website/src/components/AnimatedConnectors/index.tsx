'use client'

import React from 'react'

interface AnimatedConnectorsProps {
  className?: string
}

// Outils/services connectés - alignés horizontalement
const CONNECTORS = [
  { id: 'drive', x: 80, y: 90, color: '#4ade80', delay: 0 }, // Google Drive - vert
  { id: 'sharepoint', x: 180, y: 90, color: '#38bdf8', delay: 0.3 }, // SharePoint - bleu clair
  { id: 'slack', x: 280, y: 90, color: '#e879f9', delay: 0.6 }, // Slack - violet/rose
  { id: 'notion', x: 380, y: 90, color: '#f8fafc', delay: 0.9 }, // Notion - blanc
  { id: 'more', x: 480, y: 90, color: '#6b7280', delay: 1.2 }, // Plus - gris
]

// Point de convergence (plateforme) en bas au centre
const PLATFORM = { x: 280, y: 280 }

// Courbes de Bézier pour les connexions
const getCurvePath = (connector: (typeof CONNECTORS)[0]) => {
  const startX = connector.x
  const startY = connector.y + 35
  const endX = PLATFORM.x
  const endY = PLATFORM.y - 40

  // Courbe qui descend puis converge vers le centre
  const midY = startY + 60
  const ctrlX1 = startX
  const ctrlY1 = midY
  const ctrlX2 = endX + (startX - endX) * 0.3
  const ctrlY2 = endY - 30

  return `M ${startX} ${startY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${endX} ${endY}`
}

export const AnimatedConnectors: React.FC<AnimatedConnectorsProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 560 400"
        fill="none"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Visualisation des outils connectés à votre plateforme"
      >
        <defs>
          {/* Filtre de lueur */}
          <filter id="connectors-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Filtre de lueur pour les signaux */}
          <filter id="connectors-signal-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Paths pour l'animation de mouvement */}
          {CONNECTORS.map((connector) => (
            <path
              key={`path-${connector.id}`}
              id={`conn-path-${connector.id}`}
              d={getCurvePath(connector)}
            />
          ))}
        </defs>

        {/* Connexions courbes colorées */}
        <g className="connections">
          {CONNECTORS.map((connector) => (
            <path
              key={`line-${connector.id}`}
              d={getCurvePath(connector)}
              fill="none"
              stroke={connector.color}
              strokeWidth="2.5"
              opacity="0.6"
              strokeLinecap="round"
            >
              <animate
                attributeName="opacity"
                values="0.4;0.8;0.4"
                dur="3s"
                begin={`${connector.delay}s`}
                repeatCount="indefinite"
              />
            </path>
          ))}
        </g>

        {/* Flux de données animés sur les courbes */}
        <g className="data-flows" filter="url(#connectors-signal-glow)">
          {CONNECTORS.map((connector) => (
            <circle key={`flow-${connector.id}`} r="5" fill={connector.color}>
              <animateMotion dur="2.5s" begin={`${connector.delay}s`} repeatCount="indefinite">
                <mpath href={`#conn-path-${connector.id}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.9;1"
                dur="2.5s"
                begin={`${connector.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* Cartes des connecteurs */}
        <g className="connector-cards" filter="url(#connectors-glow)">
          {CONNECTORS.map((connector) => (
            <g key={connector.id}>
              {/* Carte avec coins arrondis */}
              <rect
                x={connector.x - 32}
                y={connector.y - 32}
                width="64"
                height="64"
                rx="12"
                fill="#1e293b"
                stroke={connector.color}
                strokeWidth="1.5"
                opacity="0.95"
              />

              {/* Icônes selon le service */}
              {connector.id === 'drive' && (
                <g transform={`translate(${connector.x}, ${connector.y})`}>
                  {/* Google Drive - triangle stylisé */}
                  <path
                    d="M-10 8L0 -10L10 8L0 4L-10 8Z"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  <path d="M-6 2L6 2" stroke="white" strokeWidth="1.5" opacity="0.7" />
                </g>
              )}

              {connector.id === 'sharepoint' && (
                <g transform={`translate(${connector.x}, ${connector.y})`}>
                  {/* SharePoint - S stylisé */}
                  <circle
                    cx="-4"
                    cy="-6"
                    r="6"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  <circle
                    cx="4"
                    cy="6"
                    r="6"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                </g>
              )}

              {connector.id === 'slack' && (
                <g transform={`translate(${connector.x}, ${connector.y})`}>
                  {/* Slack - hashtag simplifié */}
                  <path
                    d="M-8 -4H8M-8 4H8M-4 -8V8M4 -8V8"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                </g>
              )}

              {connector.id === 'notion' && (
                <g transform={`translate(${connector.x}, ${connector.y})`}>
                  {/* Notion - N stylisé */}
                  <path
                    d="M-8 10V-10L8 10V-10"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                </g>
              )}

              {connector.id === 'more' && (
                <g transform={`translate(${connector.x}, ${connector.y})`}>
                  {/* Points de suspension */}
                  <circle cx="-10" cy="0" r="3" fill="white" opacity="0.7" />
                  <circle cx="0" cy="0" r="3" fill="white" opacity="0.7" />
                  <circle cx="10" cy="0" r="3" fill="white" opacity="0.7" />
                </g>
              )}
            </g>
          ))}
        </g>

        {/* Plateforme centrale */}
        <g className="platform" filter="url(#connectors-glow)">
          {/* Cercle externe pulsant */}
          <rect
            x={PLATFORM.x - 50}
            y={PLATFORM.y - 50}
            width="100"
            height="100"
            rx="20"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1"
            opacity="0"
          >
            <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
            <animate attributeName="width" values="100;115;100" dur="3s" repeatCount="indefinite" />
            <animate
              attributeName="height"
              values="100;115;100"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x"
              values={`${PLATFORM.x - 50};${PLATFORM.x - 57.5};${PLATFORM.x - 50}`}
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              values={`${PLATFORM.y - 50};${PLATFORM.y - 57.5};${PLATFORM.y - 50}`}
              dur="3s"
              repeatCount="indefinite"
            />
          </rect>

          {/* Carte principale */}
          <rect
            x={PLATFORM.x - 45}
            y={PLATFORM.y - 45}
            width="90"
            height="90"
            rx="18"
            fill="#1e293b"
            stroke="#374151"
            strokeWidth="1"
          />

          {/* Icône cloud/connexion au centre */}
          <g transform={`translate(${PLATFORM.x}, ${PLATFORM.y})`}>
            {/* Cloud stylisé */}
            <path
              d="M-20 8C-26 8 -30 4 -30 -2C-30 -8 -26 -12 -20 -12C-18 -18 -12 -22 -4 -22C6 -22 14 -14 14 -4C20 -4 24 0 24 6C24 12 20 16 14 16H-20C-26 16 -30 12 -30 8"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.9"
            />
            {/* Flèches de connexion */}
            <path
              d="M-8 4V-4M-8 -4L-12 0M-8 -4L-4 0"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M8 -4V4M8 4L4 0M8 4L12 0"
              fill="none"
              stroke="#4ade80"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>
        </g>

        {/* Particules ambiantes */}
        <g className="particles">
          {[
            { x: 130, y: 180, delay: 0 },
            { x: 280, y: 160, delay: 0.8 },
            { x: 430, y: 180, delay: 1.6 },
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
