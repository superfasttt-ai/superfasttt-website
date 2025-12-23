'use client'

import React from 'react'

interface MarketingProps {
  className?: string
}

export const Marketing: React.FC<MarketingProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 600 360"
        fill="none"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Génération de contenu marketing par IA"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="mkt-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="mkt-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="mkt-flow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>

          <filter id="mkt-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="mkt-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background grid subtil */}
        <g opacity="0.1">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <line
              key={`v-${i}`}
              x1={60 + i * 48}
              y1="40"
              x2={60 + i * 48}
              y2="320"
              stroke="#8b5cf6"
              strokeWidth="0.5"
            />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={`h-${i}`}
              x1="60"
              y1={60 + i * 48}
              x2="540"
              y2={60 + i * 48}
              stroke="#8b5cf6"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* Zone INPUT - Idées brutes à gauche */}
        <g className="input-zone">
          {/* Bulles d'idées flottantes */}
          <g filter="url(#mkt-soft)">
            {/* Bulle 1 - Texte brut */}
            <g>
              <rect
                x="40"
                y="100"
                width="80"
                height="50"
                rx="8"
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth="1"
                opacity="0.9"
              >
                <animate attributeName="y" values="100;95;100" dur="3s" repeatCount="indefinite" />
              </rect>
              <line
                x1="52"
                y1="115"
                x2="105"
                y2="115"
                stroke="#94a3b8"
                strokeWidth="1"
                opacity="0.6"
              >
                <animate
                  attributeName="y1"
                  values="115;110;115"
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y2"
                  values="115;110;115"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="52"
                y1="125"
                x2="95"
                y2="125"
                stroke="#94a3b8"
                strokeWidth="1"
                opacity="0.4"
              >
                <animate
                  attributeName="y1"
                  values="125;120;125"
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y2"
                  values="125;120;125"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="52"
                y1="135"
                x2="80"
                y2="135"
                stroke="#94a3b8"
                strokeWidth="1"
                opacity="0.3"
              >
                <animate
                  attributeName="y1"
                  values="135;130;135"
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y2"
                  values="135;130;135"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </line>
            </g>

            {/* Bulle 2 - Data */}
            <g>
              <rect
                x="55"
                y="180"
                width="70"
                height="45"
                rx="8"
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth="1"
                opacity="0.9"
              >
                <animate
                  attributeName="y"
                  values="180;175;180"
                  dur="3.5s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
              </rect>
              <text
                x="90"
                y="208"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="16"
                fontFamily="monospace"
                opacity="0.7"
              >
                <animate
                  attributeName="y"
                  values="208;203;208"
                  dur="3.5s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
                {'{ }'}
              </text>
            </g>

            {/* Bulle 3 - Brief */}
            <g>
              <rect
                x="35"
                y="250"
                width="90"
                height="55"
                rx="8"
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth="1"
                opacity="0.9"
              >
                <animate
                  attributeName="y"
                  values="250;247;250"
                  dur="4s"
                  begin="1s"
                  repeatCount="indefinite"
                />
              </rect>
              <circle
                cx="55"
                cy="275"
                r="8"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1"
                opacity="0.5"
              >
                <animate
                  attributeName="cy"
                  values="275;272;275"
                  dur="4s"
                  begin="1s"
                  repeatCount="indefinite"
                />
              </circle>
              <line
                x1="70"
                y1="272"
                x2="110"
                y2="272"
                stroke="#94a3b8"
                strokeWidth="1"
                opacity="0.5"
              >
                <animate
                  attributeName="y1"
                  values="272;269;272"
                  dur="4s"
                  begin="1s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y2"
                  values="272;269;272"
                  dur="4s"
                  begin="1s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="70"
                y1="285"
                x2="100"
                y2="285"
                stroke="#94a3b8"
                strokeWidth="1"
                opacity="0.3"
              >
                <animate
                  attributeName="y1"
                  values="285;282;285"
                  dur="4s"
                  begin="1s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y2"
                  values="285;282;285"
                  dur="4s"
                  begin="1s"
                  repeatCount="indefinite"
                />
              </line>
            </g>
          </g>

          {/* Label INPUT */}
          <text
            x="80"
            y="75"
            textAnchor="middle"
            fill="#64748b"
            fontSize="11"
            fontWeight="500"
            letterSpacing="0.1em"
          >
            INPUT
          </text>
        </g>

        {/* Flèches d'entrée */}
        <g className="input-arrows" opacity="0.6">
          <path
            d="M130 125 L170 180"
            stroke="url(#mkt-gradient-1)"
            strokeWidth="1"
            strokeDasharray="4 4"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-8"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M135 200 L170 180"
            stroke="url(#mkt-gradient-1)"
            strokeWidth="1"
            strokeDasharray="4 4"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-8"
              dur="1s"
              begin="0.2s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M135 275 L170 180"
            stroke="url(#mkt-gradient-1)"
            strokeWidth="1"
            strokeDasharray="4 4"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-8"
              dur="1s"
              begin="0.4s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* ZONE IA CENTRALE - Machine créative */}
        <g className="ai-zone" filter="url(#mkt-glow)">
          {/* Conteneur principal */}
          <rect
            x="170"
            y="120"
            width="160"
            height="120"
            rx="16"
            fill="#1e293b"
            stroke="url(#mkt-gradient-1)"
            strokeWidth="1"
          />

          {/* Engrenages internes animés */}
          <g transform="translate(210, 160)">
            <circle
              cx="0"
              cy="0"
              r="20"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="1"
              strokeDasharray="8 4"
              opacity="0.7"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0;360"
                dur="8s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="0" cy="0" r="8" fill="#8b5cf6" opacity="0.5">
              <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          <g transform="translate(260, 180)">
            <circle
              cx="0"
              cy="0"
              r="15"
              fill="none"
              stroke="#ec4899"
              strokeWidth="1"
              strokeDasharray="6 3"
              opacity="0.7"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="360;0"
                dur="6s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="0" cy="0" r="6" fill="#ec4899" opacity="0.5">
              <animate attributeName="r" values="6;8;6" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </g>

          <g transform="translate(290, 150)">
            <circle
              cx="0"
              cy="0"
              r="12"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1"
              strokeDasharray="4 2"
              opacity="0.6"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0;360"
                dur="5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          {/* Étoile IA au centre */}
          <g transform="translate(250, 180)">
            <polygon
              points="0,-12 3,-4 12,-4 5,2 7,11 0,6 -7,11 -5,2 -12,-4 -3,-4"
              fill="#fbbf24"
              opacity="0.9"
            >
              <animate
                attributeName="opacity"
                values="0.7;1;0.7"
                dur="2s"
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1;1.1;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </polygon>
          </g>

          {/* Label */}
          <text x="250" y="225" textAnchor="middle" fill="#a78bfa" fontSize="12" fontWeight="600">
            AI CONTENT
          </text>
        </g>

        {/* Flux de sortie - multiple canaux */}
        <g className="output-flow">
          {/* Canal 1 - vers Post */}
          <path
            d="M330 150 Q380 150 400 120"
            stroke="#3b82f6"
            strokeWidth="1.5"
            fill="none"
            opacity="0.7"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-20"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </path>
          <circle r="4" fill="#3b82f6">
            <animateMotion path="M330 150 Q380 150 400 120" dur="1.5s" repeatCount="indefinite" />
          </circle>

          {/* Canal 2 - vers Image */}
          <path
            d="M330 180 L420 180"
            stroke="#10b981"
            strokeWidth="1.5"
            fill="none"
            opacity="0.7"
          />
          <circle r="4" fill="#10b981">
            <animateMotion
              path="M330 180 L420 180"
              dur="1.2s"
              begin="0.3s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Canal 3 - vers Video */}
          <path
            d="M330 210 Q380 210 400 250"
            stroke="#f59e0b"
            strokeWidth="1.5"
            fill="none"
            opacity="0.7"
          />
          <circle r="4" fill="#f59e0b">
            <animateMotion
              path="M330 210 Q380 210 400 250"
              dur="1.5s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* ZONE OUTPUT - Contenus générés à droite */}
        <g className="output-zone" filter="url(#mkt-soft)">
          {/* Carte 1 - Article/Post */}
          <g>
            <rect
              x="420"
              y="80"
              width="130"
              height="75"
              rx="10"
              fill="#1e293b"
              stroke="#3b82f6"
              strokeWidth="1"
            >
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="3s"
                repeatCount="indefinite"
              />
            </rect>
            {/* Header image */}
            <rect x="430" y="90" width="110" height="30" rx="4" fill="#3b82f6" opacity="0.3" />
            <polygon points="460,100 470,115 450,115" fill="#3b82f6" opacity="0.6" />
            {/* Lignes de texte */}
            <line
              x1="430"
              y1="130"
              x2="540"
              y2="130"
              stroke="#64748b"
              strokeWidth="1"
              opacity="0.5"
            />
            <line
              x1="430"
              y1="142"
              x2="520"
              y2="142"
              stroke="#64748b"
              strokeWidth="1"
              opacity="0.3"
            />
            {/* Badge */}
            <rect x="500" y="85" width="45" height="16" rx="8" fill="#3b82f6" opacity="0.8" />
            <text x="522" y="96" textAnchor="middle" fill="white" fontSize="8" fontWeight="600">
              POST
            </text>
          </g>

          {/* Carte 2 - Image/Visual */}
          <g>
            <rect
              x="430"
              y="165"
              width="120"
              height="85"
              rx="10"
              fill="#1e293b"
              stroke="#10b981"
              strokeWidth="1"
            >
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="3s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            </rect>
            {/* Image placeholder avec montagne/soleil */}
            <rect x="440" y="175" width="100" height="50" rx="4" fill="#10b981" opacity="0.2" />
            <circle cx="465" cy="190" r="10" fill="#fbbf24" opacity="0.6" />
            <polygon points="480,220 510,190 530,220" fill="#10b981" opacity="0.5" />
            <polygon points="455,220 475,200 495,220" fill="#10b981" opacity="0.7" />
            {/* Badge */}
            <rect x="495" y="230" width="50" height="16" rx="8" fill="#10b981" opacity="0.8" />
            <text x="520" y="241" textAnchor="middle" fill="white" fontSize="8" fontWeight="600">
              VISUAL
            </text>
          </g>

          {/* Carte 3 - Video */}
          <g>
            <rect
              x="415"
              y="260"
              width="140"
              height="80"
              rx="10"
              fill="#1e293b"
              stroke="#f59e0b"
              strokeWidth="1"
            >
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="3s"
                begin="1s"
                repeatCount="indefinite"
              />
            </rect>
            {/* Video frame */}
            <rect x="425" y="270" width="120" height="50" rx="4" fill="#f59e0b" opacity="0.15" />
            {/* Play button */}
            <circle cx="485" cy="295" r="15" fill="#f59e0b" opacity="0.3" />
            <polygon points="480,288 480,302 495,295" fill="white" opacity="0.9" />
            {/* Progress bar */}
            <rect x="425" y="325" width="120" height="4" rx="2" fill="#374151" />
            <rect x="425" y="325" width="50" height="4" rx="2" fill="#f59e0b" opacity="0.8">
              <animate attributeName="width" values="20;80;20" dur="4s" repeatCount="indefinite" />
            </rect>
            {/* Badge */}
            <rect x="500" y="265" width="50" height="16" rx="8" fill="#f59e0b" opacity="0.8" />
            <text x="525" y="276" textAnchor="middle" fill="white" fontSize="8" fontWeight="600">
              VIDEO
            </text>
          </g>

          {/* Label OUTPUT */}
          <text
            x="485"
            y="60"
            textAnchor="middle"
            fill="#64748b"
            fontSize="11"
            fontWeight="500"
            letterSpacing="0.1em"
          >
            OUTPUT
          </text>
        </g>

        {/* Particules décoratives */}
        <g className="particles" opacity="0.5">
          <circle cx="180" cy="100" r="2" fill="#8b5cf6">
            <animate attributeName="cy" values="100;90;100" dur="2s" repeatCount="indefinite" />
            <animate
              attributeName="opacity"
              values="0.3;0.7;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="320" cy="100" r="2" fill="#ec4899">
            <animate
              attributeName="cy"
              values="100;95;100"
              dur="2.5s"
              begin="0.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0.7;0.3"
              dur="2.5s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="380" cy="140" r="1.5" fill="#f59e0b">
            <animate
              attributeName="cy"
              values="140;135;140"
              dur="1.8s"
              begin="0.8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="350" cy="250" r="2" fill="#10b981">
            <animate
              attributeName="cy"
              values="250;245;250"
              dur="2.2s"
              begin="0.3s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    </div>
  )
}

export default Marketing
