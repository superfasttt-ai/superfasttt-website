'use client'

import React from 'react'

interface FoundationVisualProps {
  className?: string
}

// Lignes verticales du socle (colonnes de données/connexions)
const VERTICAL_LINES = Array.from({ length: 24 }, (_, i) => ({
  x: 50 + i * 37.5,
  height: 20 + Math.sin(i * 0.5) * 10,
  delay: i * 0.08,
  opacity: 0.3 + Math.sin(i * 0.3) * 0.2,
}))

// Points de connexion sur le socle
const CONNECTION_POINTS = [
  { x: 150, delay: 0 },
  { x: 300, delay: 0.3 },
  { x: 450, delay: 0.6 },
  { x: 600, delay: 0.9 },
  { x: 750, delay: 1.2 },
]

// Flux de données horizontaux
const DATA_FLOWS = [
  { y: 35, width: 800, delay: 0, speed: 4 },
  { y: 50, width: 600, delay: 1.5, speed: 5 },
  { y: 65, width: 700, delay: 0.8, speed: 4.5 },
]

export const FoundationVisual: React.FC<FoundationVisualProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 900 120"
        fill="none"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMax meet"
        aria-label="Visual représentant le socle SUPERFASTTT - une fondation solide pour l'IA souveraine"
      >
        <defs>
          {/* Gradient principal du socle - emerald to blue */}
          <linearGradient id="foundation-base-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#34d399" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>

          {/* Gradient pour les lignes verticales */}
          <linearGradient id="vertical-line-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>

          {/* Gradient pour la surface du socle */}
          <linearGradient id="surface-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.02" />
          </linearGradient>

          {/* Gradient pour le bord lumineux */}
          <linearGradient id="edge-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0" />
            <stop offset="20%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="80%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>

          {/* Gradient pour les flux de données */}
          <linearGradient id="data-flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>

          {/* Filtre de lueur */}
          <filter id="foundation-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Filtre de lueur intense pour le bord */}
          <filter id="edge-glow-filter" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Pattern de grille pour la surface */}
          <pattern
            id="grid-pattern"
            x="0"
            y="0"
            width="30"
            height="15"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 30 0 L 0 0 0 15"
              fill="none"
              stroke="#34d399"
              strokeWidth="0.5"
              strokeOpacity="0.15"
            />
          </pattern>
        </defs>

        {/* Surface du socle avec grille */}
        <g className="foundation-surface">
          {/* Rectangle de base avec perspective */}
          <path
            d="M 50 30 L 850 30 L 870 80 L 30 80 Z"
            fill="url(#surface-gradient)"
            className="foundation-base"
          />

          {/* Grille sur la surface */}
          <path d="M 50 30 L 850 30 L 870 80 L 30 80 Z" fill="url(#grid-pattern)" opacity="0.5" />
        </g>

        {/* Lignes verticales (colonnes de données) */}
        <g className="vertical-lines">
          {VERTICAL_LINES.map((line, i) => (
            <g key={`vline-${i}`}>
              <line
                x1={line.x}
                y1={30}
                x2={line.x}
                y2={30 - line.height}
                stroke="url(#vertical-line-gradient)"
                strokeWidth="1.5"
                opacity={line.opacity}
                className="vertical-line"
              >
                <animate
                  attributeName="y2"
                  values={`${30 - line.height};${30 - line.height - 8};${30 - line.height}`}
                  dur="2.5s"
                  begin={`${line.delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values={`${line.opacity};${line.opacity + 0.2};${line.opacity}`}
                  dur="2.5s"
                  begin={`${line.delay}s`}
                  repeatCount="indefinite"
                />
              </line>
            </g>
          ))}
        </g>

        {/* Bord lumineux supérieur du socle */}
        <g filter="url(#edge-glow-filter)">
          <line
            x1="50"
            y1="30"
            x2="850"
            y2="30"
            stroke="url(#edge-glow)"
            strokeWidth="2"
            className="edge-line"
          >
            <animate
              attributeName="stroke-opacity"
              values="0.8;1;0.8"
              dur="3s"
              repeatCount="indefinite"
            />
          </line>
        </g>

        {/* Flux de données horizontaux animés */}
        <g className="data-flows">
          {DATA_FLOWS.map((flow, i) => (
            <rect
              key={`flow-${i}`}
              x="-100"
              y={flow.y}
              width="100"
              height="1.5"
              fill="url(#data-flow-gradient)"
              opacity="0.6"
            >
              <animate
                attributeName="x"
                values={`-100;${flow.width + 100}`}
                dur={`${flow.speed}s`}
                begin={`${flow.delay}s`}
                repeatCount="indefinite"
              />
            </rect>
          ))}
        </g>

        {/* Points de connexion sur le socle */}
        <g className="connection-points" filter="url(#foundation-glow)">
          {CONNECTION_POINTS.map((point, i) => (
            <g key={`point-${i}`}>
              {/* Cercle externe pulsant */}
              <circle
                cx={point.x}
                cy="30"
                r="6"
                fill="none"
                stroke="#34d399"
                strokeWidth="1"
                opacity="0.3"
              >
                <animate
                  attributeName="r"
                  values="4;10;4"
                  dur="2.5s"
                  begin={`${point.delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5;0;0.5"
                  dur="2.5s"
                  begin={`${point.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
              {/* Point central */}
              <circle cx={point.x} cy="30" r="3" fill="#34d399" opacity="0.8">
                <animate
                  attributeName="opacity"
                  values="0.6;1;0.6"
                  dur="2s"
                  begin={`${point.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
        </g>

        {/* Bordures latérales avec effet de profondeur */}
        <g className="side-edges" opacity="0.4">
          {/* Bord gauche */}
          <line x1="50" y1="30" x2="30" y2="80" stroke="#34d399" strokeWidth="1" opacity="0.5" />
          {/* Bord droit */}
          <line x1="850" y1="30" x2="870" y2="80" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
          {/* Bord inférieur */}
          <line
            x1="30"
            y1="80"
            x2="870"
            y2="80"
            stroke="url(#foundation-base-gradient)"
            strokeWidth="1"
            opacity="0.3"
          />
        </g>

        {/* Particules montantes depuis le socle */}
        <g className="rising-particles">
          {[120, 280, 450, 620, 780].map((x, i) => (
            <circle key={`particle-${i}`} cx={x} cy="25" r="1.5" fill="#22d3ee" opacity="0">
              <animate
                attributeName="cy"
                values="30;-20"
                dur="3s"
                begin={`${i * 0.6}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.6;0"
                dur="3s"
                begin={`${i * 0.6}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      </svg>
    </div>
  )
}
