'use client'

import React from 'react'

interface AssistantsProps {
  className?: string
}

// Positions des assistants (cercles représentant des personnes)
const ASSISTANTS = [
  { id: 'rh', x: 150, y: 200, label: 'RH', delay: 0 },
  { id: 'support', x: 300, y: 120, label: 'Support', delay: 0.3 },
  { id: 'commercial', x: 450, y: 200, label: 'Commercial', delay: 0.6 },
  { id: 'qualite', x: 220, y: 320, label: 'Qualité', delay: 0.9 },
  { id: 'formation', x: 380, y: 320, label: 'Formation', delay: 1.2 },
]

// Hub central (IA)
const CENTER = { x: 300, y: 220 }

// Connexions entre le centre et les assistants
const CONNECTIONS = ASSISTANTS.map((a) => ({
  from: CENTER,
  to: { x: a.x, y: a.y },
  delay: a.delay,
}))

// Connexions entre assistants adjacents
const INTER_CONNECTIONS = [
  { from: 'rh', to: 'support', delay: 1.5 },
  { from: 'support', to: 'commercial', delay: 1.8 },
  { from: 'commercial', to: 'formation', delay: 2.1 },
  { from: 'formation', to: 'qualite', delay: 2.4 },
  { from: 'qualite', to: 'rh', delay: 2.7 },
]

export const Assistants: React.FC<AssistantsProps> = ({ className = '' }) => {
  const getAssistant = (id: string) => ASSISTANTS.find((a) => a.id === id)

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 600 400"
        fill="none"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Visualisation d'assistants métier connectés à une IA centrale"
      >
        <defs>
          {/* Gradient principal */}
          <linearGradient id="assistants-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
          </linearGradient>

          {/* Gradient pour le hub central */}
          <radialGradient id="hub-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#34d399" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.2" />
          </radialGradient>

          {/* Gradient pour les connexions */}
          <linearGradient id="conn-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>

          {/* Gradient pour les avatars */}
          <linearGradient id="avatar-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
          </linearGradient>

          {/* Filtre de lueur */}
          <filter id="assistants-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Filtre de lueur intense pour le hub */}
          <filter id="hub-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Filtre pour les signaux */}
          <filter id="signal-glow-assistants" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Cercle orbital autour du hub central */}
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r="140"
          fill="none"
          stroke="url(#conn-gradient)"
          strokeWidth="1"
          strokeDasharray="8 4"
          opacity="0.3"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${CENTER.x} ${CENTER.y}`}
            to={`360 ${CENTER.x} ${CENTER.y}`}
            dur="60s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Connexions du centre vers les assistants */}
        <g className="center-connections">
          {CONNECTIONS.map((conn, i) => (
            <g key={`center-conn-${i}`}>
              <line
                x1={conn.from.x}
                y1={conn.from.y}
                x2={conn.to.x}
                y2={conn.to.y}
                stroke="url(#conn-gradient)"
                strokeWidth="2"
                opacity="0.4"
              >
                <animate
                  attributeName="opacity"
                  values="0.2;0.6;0.2"
                  dur="3s"
                  begin={`${conn.delay}s`}
                  repeatCount="indefinite"
                />
              </line>
            </g>
          ))}
        </g>

        {/* Connexions entre assistants adjacents */}
        <g className="inter-connections">
          {INTER_CONNECTIONS.map((conn, i) => {
            const from = getAssistant(conn.from)
            const to = getAssistant(conn.to)
            if (!from || !to) return null

            return (
              <line
                key={`inter-${i}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="url(#conn-gradient)"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.2"
              >
                <animate
                  attributeName="opacity"
                  values="0.1;0.4;0.1"
                  dur="4s"
                  begin={`${conn.delay}s`}
                  repeatCount="indefinite"
                />
              </line>
            )
          })}
        </g>

        {/* Flux de données du centre vers les assistants */}
        <g className="data-flows" filter="url(#signal-glow-assistants)">
          {ASSISTANTS.map((assistant, i) => (
            <circle key={`flow-${i}`} r="4" fill="#22d3ee" opacity="0">
              <animate
                attributeName="cx"
                values={`${CENTER.x};${assistant.x}`}
                dur="2s"
                begin={`${assistant.delay + 1}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values={`${CENTER.y};${assistant.y}`}
                dur="2s"
                begin={`${assistant.delay + 1}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.8;0.8;0"
                keyTimes="0;0.1;0.9;1"
                dur="2s"
                begin={`${assistant.delay + 1}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* Flux de retour des assistants vers le centre */}
        <g className="return-flows" filter="url(#signal-glow-assistants)">
          {ASSISTANTS.map((assistant, i) => (
            <circle key={`return-${i}`} r="3" fill="#34d399" opacity="0">
              <animate
                attributeName="cx"
                values={`${assistant.x};${CENTER.x}`}
                dur="2.5s"
                begin={`${assistant.delay + 2.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values={`${assistant.y};${CENTER.y}`}
                dur="2.5s"
                begin={`${assistant.delay + 2.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.6;0.6;0"
                keyTimes="0;0.1;0.9;1"
                dur="2.5s"
                begin={`${assistant.delay + 2.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* Hub central (IA) */}
        <g className="hub" filter="url(#hub-glow)">
          {/* Cercle externe pulsant */}
          <circle
            cx={CENTER.x}
            cy={CENTER.y}
            r="35"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            opacity="0.3"
          >
            <animate attributeName="r" values="35;45;35" dur="3s" repeatCount="indefinite" />
            <animate
              attributeName="opacity"
              values="0.3;0.1;0.3"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Cercle principal */}
          <circle cx={CENTER.x} cy={CENTER.y} r="30" fill="url(#hub-gradient)">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Icône IA au centre (étoile/spark) */}
          <g transform={`translate(${CENTER.x - 12}, ${CENTER.y - 12})`}>
            <path
              d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
              fill="#ffffff"
              opacity="0.9"
            >
              <animate
                attributeName="opacity"
                values="0.7;1;0.7"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>

        {/* Assistants (avatars) */}
        <g className="assistants" filter="url(#assistants-glow)">
          {ASSISTANTS.map((assistant) => (
            <g key={assistant.id}>
              {/* Cercle externe pulsant */}
              <circle
                cx={assistant.x}
                cy={assistant.y}
                r="28"
                fill="none"
                stroke="#34d399"
                strokeWidth="1"
                opacity="0"
              >
                <animate
                  attributeName="r"
                  values="24;32;24"
                  dur="3s"
                  begin={`${assistant.delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0;0.4"
                  dur="3s"
                  begin={`${assistant.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Cercle de fond */}
              <circle cx={assistant.x} cy={assistant.y} r="24" fill="url(#avatar-gradient)">
                <animate
                  attributeName="opacity"
                  values="0.5;0.8;0.5"
                  dur="2.5s"
                  begin={`${assistant.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Icône utilisateur */}
              <g transform={`translate(${assistant.x - 10}, ${assistant.y - 12})`}>
                {/* Tête */}
                <circle cx="10" cy="6" r="5" fill="#ffffff" opacity="0.8" />
                {/* Corps */}
                <path
                  d="M10 12C6 12 2 14 2 18V20H18V18C18 14 14 12 10 12Z"
                  fill="#ffffff"
                  opacity="0.8"
                />
              </g>

              {/* Label */}
              <text
                x={assistant.x}
                y={assistant.y + 42}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="11"
                fontWeight="500"
              >
                {assistant.label}
              </text>
            </g>
          ))}
        </g>

        {/* Particules ambiantes */}
        <g className="particles">
          {[
            { x: 100, y: 150, delay: 0 },
            { x: 500, y: 150, delay: 1 },
            { x: 150, y: 350, delay: 2 },
            { x: 450, y: 350, delay: 3 },
            { x: 300, y: 80, delay: 0.5 },
          ].map((p, i) => (
            <circle key={`particle-${i}`} cx={p.x} cy={p.y} r="2" fill="#22d3ee" opacity="0">
              <animate
                attributeName="cy"
                values={`${p.y};${p.y - 20};${p.y}`}
                dur="4s"
                begin={`${p.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.5;0"
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

export default Assistants
