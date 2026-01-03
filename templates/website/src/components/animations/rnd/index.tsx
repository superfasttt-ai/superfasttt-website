'use client'

import React from 'react'

interface RnDProps {
  className?: string
}

export const RnD: React.FC<RnDProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 600 360"
        fill="none"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Données métier sécurisées"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="rnd-shield" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>
          <linearGradient id="rnd-core" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>
          <linearGradient id="rnd-scan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0" />
            <stop offset="50%" stopColor="#22C55E" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
          </linearGradient>

          <filter id="rnd-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="rnd-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip pour le scan */}
          <clipPath id="rnd-lab-clip">
            <rect x="320" y="60" width="240" height="240" rx="16" />
          </clipPath>
        </defs>

        {/* Background grid subtil */}
        <g opacity="0.08">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <line
              key={`v-${i}`}
              x1={40 + i * 44}
              y1="30"
              x2={40 + i * 44}
              y2="330"
              stroke="#22C55E"
              strokeWidth="0.5"
            />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line
              key={`h-${i}`}
              x1="40"
              y1={50 + i * 44}
              x2="560"
              y2={50 + i * 44}
              stroke="#22C55E"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* === ZONE GAUCHE : Couches de sécurité (Onion Security) === */}
        <g className="security-layers" filter="url(#rnd-soft)">
          {/* Couche externe - Firewall */}
          <circle
            cx="150"
            cy="180"
            r="120"
            fill="none"
            stroke="#22C55E"
            strokeWidth="1"
            strokeDasharray="8 4"
            opacity="0.3"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 150 180;360 150 180"
              dur="60s"
              repeatCount="indefinite"
            />
          </circle>
          <text x="150" y="55" textAnchor="middle" fill="#22C55E" fontSize="9" opacity="0.5">
            FIREWALL
          </text>

          {/* Couche 2 - Encryption */}
          <circle
            cx="150"
            cy="180"
            r="90"
            fill="none"
            stroke="#14B8A6"
            strokeWidth="1"
            strokeDasharray="6 3"
            opacity="0.4"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="360 150 180;0 150 180"
              dur="45s"
              repeatCount="indefinite"
            />
          </circle>
          <text x="150" y="85" textAnchor="middle" fill="#14B8A6" fontSize="9" opacity="0.6">
            ENCRYPTION
          </text>

          {/* Couche 3 - Access Control */}
          <circle
            cx="150"
            cy="180"
            r="60"
            fill="none"
            stroke="#22C55E"
            strokeWidth="1"
            strokeDasharray="4 2"
            opacity="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 150 180;360 150 180"
              dur="30s"
              repeatCount="indefinite"
            />
          </circle>
          <text x="150" y="115" textAnchor="middle" fill="#22C55E" fontSize="9" opacity="0.7">
            ACCESS
          </text>

          {/* Coeur sécurisé - Core avec bouclier */}
          <g filter="url(#rnd-glow)">
            <circle
              cx="150"
              cy="180"
              r="35"
              fill="#1e293b"
              stroke="url(#rnd-shield)"
              strokeWidth="1"
            />

            {/* Bouclier au centre */}
            <path
              d="M150 155 C135 155 130 162 130 170 C130 188 150 205 150 205 C150 205 170 188 170 170 C170 162 165 155 150 155Z"
              fill="none"
              stroke="#22C55E"
              strokeWidth="1"
              opacity="0.9"
            />

            {/* Checkmark dans le bouclier */}
            <path
              d="M142 178 L148 184 L160 170"
              fill="none"
              stroke="#22C55E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            >
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Particules de sécurité orbitales */}
          <g>
            <circle r="3" fill="#22C55E" opacity="0.7">
              <animateMotion
                path="M150 180 m-90 0 a90 90 0 1 1 180 0 a90 90 0 1 1 -180 0"
                dur="8s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="2" fill="#14B8A6" opacity="0.6">
              <animateMotion
                path="M150 180 m-60 0 a60 60 0 1 1 120 0 a60 60 0 1 1 -120 0"
                dur="5s"
                begin="1s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="2.5" fill="#22C55E" opacity="0.8">
              <animateMotion
                path="M150 180 m-120 0 a120 120 0 1 1 240 0 a120 120 0 1 1 -240 0"
                dur="12s"
                begin="2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </g>

        {/* === CONNEXION CENTRALE === */}
        <g className="connection" opacity="0.6">
          <path
            d="M275 180 L320 180"
            stroke="url(#rnd-shield)"
            strokeWidth="1"
            strokeDasharray="4 4"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-8"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </path>
          {/* Données qui transitent */}
          <circle r="3" fill="#22C55E">
            <animateMotion path="M275 180 L320 180" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* === ZONE DROITE : Laboratoire R&D === */}
        <g className="lab-zone">
          {/* Container du lab */}
          <rect
            x="320"
            y="60"
            width="240"
            height="240"
            rx="16"
            fill="#1e293b"
            stroke="#14B8A6"
            strokeWidth="1"
            opacity="0.95"
          />

          {/* Header du lab */}
          <rect x="320" y="60" width="240" height="32" rx="16" fill="#14B8A6" opacity="0.2" />
          <text x="440" y="82" textAnchor="middle" fill="#14B8A6" fontSize="11" fontWeight="600">
            BUSINESS DATA - SECURED
          </text>
          <circle cx="540" cy="76" r="4" fill="#22C55E" opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Scan de sécurité */}
          <g clipPath="url(#rnd-lab-clip)">
            <rect x="320" y="60" width="240" height="8" fill="url(#rnd-scan)">
              <animate attributeName="y" values="60;292;60" dur="4s" repeatCount="indefinite" />
            </rect>
          </g>

          {/* Expérience 1 - Molécule/ADN */}
          <g transform="translate(370, 140)" filter="url(#rnd-soft)">
            <rect
              x="-35"
              y="-35"
              width="70"
              height="70"
              rx="8"
              fill="#0f172a"
              stroke="#0d9488"
              strokeWidth="1"
              opacity="0.8"
            />

            {/* Double hélice ADN simplifiée */}
            <g>
              <ellipse
                cx="0"
                cy="-15"
                rx="18"
                ry="6"
                fill="none"
                stroke="#0d9488"
                strokeWidth="1"
                opacity="0.7"
              >
                <animate attributeName="ry" values="6;4;6" dur="2s" repeatCount="indefinite" />
              </ellipse>
              <ellipse
                cx="0"
                cy="0"
                rx="18"
                ry="6"
                fill="none"
                stroke="#14B8A6"
                strokeWidth="1"
                opacity="0.7"
              >
                <animate attributeName="ry" values="4;6;4" dur="2s" repeatCount="indefinite" />
              </ellipse>
              <ellipse
                cx="0"
                cy="15"
                rx="18"
                ry="6"
                fill="none"
                stroke="#0d9488"
                strokeWidth="1"
                opacity="0.7"
              >
                <animate attributeName="ry" values="6;4;6" dur="2s" repeatCount="indefinite" />
              </ellipse>

              {/* Points de connexion */}
              <circle cx="-12" cy="-15" r="2" fill="#0d9488" opacity="0.8" />
              <circle cx="12" cy="-15" r="2" fill="#0d9488" opacity="0.8" />
              <circle cx="-12" cy="0" r="2" fill="#14B8A6" opacity="0.8" />
              <circle cx="12" cy="0" r="2" fill="#14B8A6" opacity="0.8" />
              <circle cx="-12" cy="15" r="2" fill="#0d9488" opacity="0.8" />
              <circle cx="12" cy="15" r="2" fill="#0d9488" opacity="0.8" />
            </g>

            <text x="0" y="50" textAnchor="middle" fill="#0d9488" fontSize="8" opacity="0.7">
              GENOMICS
            </text>
          </g>

          {/* Expérience 2 - Graphe/Network */}
          <g transform="translate(510, 140)" filter="url(#rnd-soft)">
            <rect
              x="-35"
              y="-35"
              width="70"
              height="70"
              rx="8"
              fill="#0f172a"
              stroke="#F59E0B"
              strokeWidth="1"
              opacity="0.8"
            />

            {/* Réseau de noeuds */}
            <g>
              {/* Noeuds */}
              <circle cx="0" cy="-12" r="6" fill="#F59E0B" opacity="0.6">
                <animate attributeName="r" values="6;7;6" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="-15" cy="8" r="5" fill="#F59E0B" opacity="0.5" />
              <circle cx="15" cy="8" r="5" fill="#F59E0B" opacity="0.5" />
              <circle cx="0" cy="18" r="4" fill="#F59E0B" opacity="0.4" />

              {/* Connexions */}
              <line x1="0" y1="-6" x2="-12" y2="5" stroke="#F59E0B" strokeWidth="1" opacity="0.4" />
              <line x1="0" y1="-6" x2="12" y2="5" stroke="#F59E0B" strokeWidth="1" opacity="0.4" />
              <line x1="-10" y1="8" x2="10" y2="8" stroke="#fbbf24" strokeWidth="1" opacity="0.3" />
              <line
                x1="-12"
                y1="10"
                x2="-3"
                y2="16"
                stroke="#F59E0B"
                strokeWidth="1"
                opacity="0.3"
              />
              <line x1="12" y1="10" x2="3" y2="16" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />
            </g>

            <text x="0" y="50" textAnchor="middle" fill="#F59E0B" fontSize="8" opacity="0.7">
              NETWORK
            </text>
          </g>

          {/* Expérience 3 - Formule chimique */}
          <g transform="translate(370, 235)" filter="url(#rnd-soft)">
            <rect
              x="-35"
              y="-35"
              width="70"
              height="70"
              rx="8"
              fill="#0f172a"
              stroke="#EF4444"
              strokeWidth="1"
              opacity="0.8"
            />

            {/* Structure moléculaire hexagonale */}
            <g>
              <polygon
                points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8"
                fill="none"
                stroke="#EF4444"
                strokeWidth="1"
                opacity="0.7"
              />
              <circle cx="0" cy="-16" r="3" fill="#EF4444" opacity="0.6" />
              <circle cx="14" cy="-8" r="3" fill="#EF4444" opacity="0.5" />
              <circle cx="14" cy="8" r="3" fill="#EF4444" opacity="0.6" />
              <circle cx="0" cy="16" r="3" fill="#EF4444" opacity="0.5" />
              <circle cx="-14" cy="8" r="3" fill="#EF4444" opacity="0.6" />
              <circle cx="-14" cy="-8" r="3" fill="#EF4444" opacity="0.5" />

              {/* Centre pulsant */}
              <circle cx="0" cy="0" r="4" fill="#EF4444" opacity="0.4">
                <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />
                <animate
                  attributeName="opacity"
                  values="0.4;0.7;0.4"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>

            <text x="0" y="50" textAnchor="middle" fill="#EF4444" fontSize="8" opacity="0.7">
              CHEMISTRY
            </text>
          </g>

          {/* Expérience 4 - Data/AI */}
          <g transform="translate(510, 235)" filter="url(#rnd-soft)">
            <rect
              x="-35"
              y="-35"
              width="70"
              height="70"
              rx="8"
              fill="#0f172a"
              stroke="#14B8A6"
              strokeWidth="1"
              opacity="0.8"
            />

            {/* Cerveau IA simplifié */}
            <g>
              {/* Forme cerveau */}
              <path
                d="M0 -18 C-12 -18 -18 -10 -18 0 C-18 12 -8 20 0 20 C8 20 18 12 18 0 C18 -10 12 -18 0 -18"
                fill="none"
                stroke="#14B8A6"
                strokeWidth="1"
                opacity="0.6"
              />

              {/* Connexions neuronales */}
              <line
                x1="-10"
                y1="-5"
                x2="10"
                y2="5"
                stroke="#14B8A6"
                strokeWidth="0.5"
                opacity="0.5"
              />
              <line
                x1="-10"
                y1="5"
                x2="10"
                y2="-5"
                stroke="#14B8A6"
                strokeWidth="0.5"
                opacity="0.5"
              />
              <line
                x1="0"
                y1="-12"
                x2="0"
                y2="12"
                stroke="#14B8A6"
                strokeWidth="0.5"
                opacity="0.5"
              />

              {/* Points neuronaux */}
              <circle cx="0" cy="0" r="3" fill="#14B8A6" opacity="0.8">
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="-8" cy="-6" r="2" fill="#14B8A6" opacity="0.6">
                <animate
                  attributeName="opacity"
                  values="0.3;0.8;0.3"
                  dur="1.2s"
                  begin="0.2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="8" cy="-6" r="2" fill="#14B8A6" opacity="0.6">
                <animate
                  attributeName="opacity"
                  values="0.3;0.8;0.3"
                  dur="1.2s"
                  begin="0.4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="-8" cy="6" r="2" fill="#14B8A6" opacity="0.6">
                <animate
                  attributeName="opacity"
                  values="0.3;0.8;0.3"
                  dur="1.2s"
                  begin="0.6s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="8" cy="6" r="2" fill="#14B8A6" opacity="0.6">
                <animate
                  attributeName="opacity"
                  values="0.3;0.8;0.3"
                  dur="1.2s"
                  begin="0.8s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>

            <text x="0" y="50" textAnchor="middle" fill="#14B8A6" fontSize="8" opacity="0.7">
              AI MODEL
            </text>
          </g>
        </g>

        {/* Labels */}
        <text
          x="150"
          y="320"
          textAnchor="middle"
          fill="#22C55E"
          fontSize="10"
          fontWeight="500"
          opacity="0.7"
        >
          SÉCURITÉ SOUVERAINE
        </text>
        <text
          x="440"
          y="320"
          textAnchor="middle"
          fill="#14B8A6"
          fontSize="10"
          fontWeight="500"
          opacity="0.7"
        >
          DONNÉES MÉTIER
        </text>
      </svg>
    </div>
  )
}

export default RnD
