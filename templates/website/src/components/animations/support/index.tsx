'use client'

import React from 'react'

interface SupportProps {
  className?: string
}

// Tickets de support entrants
const TICKETS = [
  { id: 'ticket1', x: 80, y: 80, color: '#3b82f6', delay: 0 },
  { id: 'ticket2', x: 180, y: 80, color: '#8b5cf6', delay: 0.5 },
  { id: 'ticket3', x: 280, y: 80, color: '#f59e0b', delay: 1.0 },
  { id: 'ticket4', x: 380, y: 80, color: '#22c55e', delay: 1.5 },
  { id: 'ticket5', x: 480, y: 80, color: '#ec4899', delay: 2.0 },
]

// Hub central (IA économique)
const HUB = { x: 280, y: 220 }

// Courbes de connexion
const getCurvePath = (ticket: (typeof TICKETS)[0]) => {
  const startX = ticket.x
  const startY = ticket.y + 35
  const endX = HUB.x
  const endY = HUB.y - 45

  const ctrlX1 = startX
  const ctrlY1 = startY + 40
  const ctrlX2 = endX + (startX < HUB.x ? -20 : startX > HUB.x ? 20 : 0)
  const ctrlY2 = endY - 20

  return `M ${startX} ${startY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${endX} ${endY}`
}

export const Support: React.FC<SupportProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 560 360"
        fill="none"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Support client optimisé"
      >
        <defs>
          <filter id="support-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="support-signal" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Paths pour animations */}
          {TICKETS.map((ticket) => (
            <path
              key={`path-${ticket.id}`}
              id={`support-path-${ticket.id}`}
              d={getCurvePath(ticket)}
            />
          ))}
        </defs>

        {/* Connexions */}
        <g className="connections">
          {TICKETS.map((ticket) => (
            <path
              key={`conn-${ticket.id}`}
              d={getCurvePath(ticket)}
              fill="none"
              stroke={ticket.color}
              strokeWidth="2"
              opacity="0.5"
              strokeLinecap="round"
            >
              <animate
                attributeName="opacity"
                values="0.3;0.7;0.3"
                dur="2s"
                begin={`${ticket.delay}s`}
                repeatCount="indefinite"
              />
            </path>
          ))}
        </g>

        {/* Flux de tickets */}
        <g className="ticket-flows" filter="url(#support-signal)">
          {TICKETS.map((ticket) => (
            <g key={`flow-${ticket.id}`}>
              {/* Ticket animé */}
              <g opacity="0">
                <animateMotion dur="1.5s" begin={`${ticket.delay}s`} repeatCount="indefinite">
                  <mpath href={`#support-path-${ticket.id}`} />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.9;1"
                  dur="1.5s"
                  begin={`${ticket.delay}s`}
                  repeatCount="indefinite"
                />
                {/* Mini enveloppe */}
                <rect x="-6" y="-4" width="12" height="8" rx="1" fill={ticket.color} />
                <path
                  d="M-6 -4L0 1L6 -4"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.8"
                />
              </g>
            </g>
          ))}
        </g>

        {/* Cartes des tickets */}
        <g className="ticket-cards" filter="url(#support-glow)">
          {TICKETS.map((ticket, index) => (
            <g key={ticket.id}>
              <rect
                x={ticket.x - 28}
                y={ticket.y - 28}
                width="56"
                height="56"
                rx="10"
                fill="#1e293b"
                stroke={ticket.color}
                strokeWidth="1.5"
                opacity="0.95"
              />

              {/* Icône message/ticket */}
              <g transform={`translate(${ticket.x}, ${ticket.y})`}>
                {/* Bulle de chat */}
                <path
                  d="M-14 -10C-14 -14 -10 -16 -6 -16H6C10 -16 14 -14 14 -10V4C14 8 10 10 6 10H-2L-10 16V10C-14 10 -14 6 -14 4V-10Z"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  opacity="0.9"
                />
                {/* Lignes de texte */}
                <line
                  x1="-8"
                  y1="-8"
                  x2="8"
                  y2="-8"
                  stroke="white"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
                <line
                  x1="-8"
                  y1="-2"
                  x2="6"
                  y2="-2"
                  stroke="white"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
                <line x1="-8" y1="4" x2="2" y2="4" stroke="white" strokeWidth="1.5" opacity="0.4" />
              </g>

              {/* Numéro de ticket */}
              <text
                x={ticket.x}
                y={ticket.y + 40}
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
                opacity="0.7"
              >
                #{index + 1}
              </text>
            </g>
          ))}
        </g>

        {/* Hub central - IA économique */}
        <g className="hub" filter="url(#support-glow)">
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

          {/* Icône casque/headset centré */}
          <g transform={`translate(${HUB.x}, ${HUB.y})`}>
            {/* Arc du casque */}
            <path
              d="M-20 4C-20 -12 -12 -20 0 -20C12 -20 20 -12 20 4"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.9"
            />
            {/* Écouteur gauche */}
            <rect
              x="-24"
              y="0"
              width="10"
              height="16"
              rx="3"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.9"
            />
            {/* Écouteur droit */}
            <rect
              x="14"
              y="0"
              width="10"
              height="16"
              rx="3"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.9"
            />
            {/* Micro */}
            <path
              d="M14 12C14 12 8 16 0 20"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
            <circle cx="0" cy="22" r="3" fill="white" opacity="0.8" />
          </g>

          {/* Badge coût optimisé */}
          <g transform={`translate(${HUB.x + 35}, ${HUB.y - 35})`}>
            <circle r="14" fill="#22c55e" opacity="0.95">
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Symbole dollar barré / économie */}
            <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
              $
            </text>
            {/* Flèche vers le bas (coût réduit) */}
            <path
              d="M8 -2V6M5 3L8 6L11 3"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
          </g>
        </g>

        {/* Réponses sortantes (checkmarks) */}
        <g className="responses">
          {[
            { x: 120, y: 300, delay: 0.8 },
            { x: 220, y: 320, delay: 1.6 },
            { x: 340, y: 320, delay: 2.4 },
            { x: 440, y: 300, delay: 3.2 },
          ].map((resp, i) => (
            <g key={`resp-${i}`} opacity="0">
              <animate
                attributeName="opacity"
                values="0;0.8;0.8;0"
                keyTimes="0;0.2;0.8;1"
                dur="2s"
                begin={`${resp.delay}s`}
                repeatCount="indefinite"
              />
              <circle cx={resp.x} cy={resp.y} r="12" fill="#22c55e" opacity="0.3" />
              <path
                d={`M${resp.x - 5} ${resp.y}L${resp.x - 1} ${resp.y + 4}L${resp.x + 6} ${resp.y - 4}`}
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

export default Support
