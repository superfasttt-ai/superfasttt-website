'use client'

import React from 'react'

interface MarketingProps {
  className?: string
}

// Éléments de contenu marketing avec couleurs du visuel de référence
const CONTENT_ITEMS = [
  { id: 'post', x: 80, y: 80, color: '#3b82f6', delay: 0, type: 'post' }, // Post/Article - Bleu
  { id: 'image', x: 180, y: 80, color: '#f59e0b', delay: 0.4, type: 'image' }, // Image - Orange
  { id: 'video', x: 420, y: 80, color: '#8b5cf6', delay: 0.8, type: 'video' }, // Vidéo - Violet
  { id: 'social', x: 520, y: 80, color: '#ef4444', delay: 1.2, type: 'social' }, // Social - Rouge
]

// Hub créatif central (IA)
const HUB = { x: 300, y: 220 }

// Courbes de connexion
const getCurvePath = (item: (typeof CONTENT_ITEMS)[0]) => {
  const startX = item.x
  const startY = item.y + 35
  const endX = HUB.x
  const endY = HUB.y - 45

  const ctrlX1 = startX
  const ctrlY1 = startY + 50
  const ctrlX2 = endX + (startX < HUB.x ? -30 : 30)
  const ctrlY2 = endY - 20

  return `M ${startX} ${startY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${endX} ${endY}`
}

export const Marketing: React.FC<MarketingProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 600 360"
        fill="none"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Marketing créatif avec IA"
      >
        <defs>
          <filter id="marketing-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="marketing-signal" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Paths pour animations */}
          {CONTENT_ITEMS.map((item) => (
            <path key={`path-${item.id}`} id={`marketing-path-${item.id}`} d={getCurvePath(item)} />
          ))}
        </defs>

        {/* Connexions courbes */}
        <g className="connections">
          {CONTENT_ITEMS.map((item) => (
            <path
              key={`conn-${item.id}`}
              d={getCurvePath(item)}
              fill="none"
              stroke={item.color}
              strokeWidth="2.5"
              opacity="0.6"
              strokeLinecap="round"
            >
              <animate
                attributeName="opacity"
                values="0.4;0.8;0.4"
                dur="3s"
                begin={`${item.delay}s`}
                repeatCount="indefinite"
              />
            </path>
          ))}
        </g>

        {/* Flux de données */}
        <g className="data-flows" filter="url(#marketing-signal)">
          {CONTENT_ITEMS.map((item) => (
            <circle key={`flow-${item.id}`} r="5" fill={item.color}>
              <animateMotion dur="2s" begin={`${item.delay}s`} repeatCount="indefinite">
                <mpath href={`#marketing-path-${item.id}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.9;1"
                dur="2s"
                begin={`${item.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* Cartes de contenu marketing */}
        <g className="content-cards" filter="url(#marketing-glow)">
          {CONTENT_ITEMS.map((item) => (
            <g key={item.id}>
              <rect
                x={item.x - 32}
                y={item.y - 32}
                width="64"
                height="64"
                rx="12"
                fill="#1e293b"
                stroke={item.color}
                strokeWidth="1.5"
                opacity="0.95"
              />

              {/* Icône Post/Article */}
              {item.type === 'post' && (
                <g transform={`translate(${item.x}, ${item.y})`}>
                  <rect
                    x="-16"
                    y="-18"
                    width="32"
                    height="36"
                    rx="3"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  <line
                    x1="-10"
                    y1="-10"
                    x2="10"
                    y2="-10"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <line
                    x1="-10"
                    y1="-2"
                    x2="10"
                    y2="-2"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  <line
                    x1="-10"
                    y1="6"
                    x2="6"
                    y2="6"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  <line
                    x1="-10"
                    y1="14"
                    x2="2"
                    y2="14"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.4"
                  />
                </g>
              )}

              {/* Icône Image */}
              {item.type === 'image' && (
                <g transform={`translate(${item.x}, ${item.y})`}>
                  <rect
                    x="-16"
                    y="-14"
                    width="32"
                    height="28"
                    rx="3"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  <circle cx="-6" cy="-4" r="4" fill="white" opacity="0.7" />
                  <path
                    d="M-14 10L-4 0L4 8L10 4L14 10"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                </g>
              )}

              {/* Icône Vidéo */}
              {item.type === 'video' && (
                <g transform={`translate(${item.x}, ${item.y})`}>
                  <rect
                    x="-18"
                    y="-12"
                    width="36"
                    height="24"
                    rx="3"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  <path d="M-4 -6L8 0L-4 6Z" fill="white" opacity="0.9" />
                </g>
              )}

              {/* Icône Social/Share */}
              {item.type === 'social' && (
                <g transform={`translate(${item.x}, ${item.y})`}>
                  <circle
                    cx="-8"
                    cy="0"
                    r="6"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  <circle
                    cx="8"
                    cy="-8"
                    r="5"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  <circle
                    cx="8"
                    cy="8"
                    r="5"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  <line
                    x1="-3"
                    y1="-2"
                    x2="4"
                    y2="-6"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.7"
                  />
                  <line
                    x1="-3"
                    y1="2"
                    x2="4"
                    y2="6"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.7"
                  />
                </g>
              )}
            </g>
          ))}
        </g>

        {/* Hub créatif central */}
        <g className="hub" filter="url(#marketing-glow)">
          {/* Cercle externe pulsant */}
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r="55"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1"
            opacity="0"
          >
            <animate attributeName="r" values="50;65;50" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Fond du hub */}
          <circle cx={HUB.x} cy={HUB.y} r="50" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />

          {/* Icône mégaphone centré */}
          <g transform={`translate(${HUB.x}, ${HUB.y})`}>
            {/* Corps du mégaphone */}
            <path
              d="M-18 -6L8 -16V16L-18 6V-6Z"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinejoin="round"
              opacity="0.9"
            />
            {/* Pavillon du mégaphone */}
            <path
              d="M8 -16C8 -16 20 -12 20 0C20 12 8 16 8 16"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.9"
            />
            {/* Poignée */}
            <rect
              x="-24"
              y="-4"
              width="8"
              height="8"
              rx="2"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.9"
            />
            {/* Ondes sonores */}
            <path
              d="M24 -8C28 -4 28 4 24 8"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M28 -12C34 -6 34 6 28 12"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.4"
            >
              <animate
                attributeName="opacity"
                values="0.2;0.6;0.2"
                dur="1.5s"
                begin="0.3s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>
      </svg>
    </div>
  )
}

export default Marketing
