'use client'

import React from 'react'

interface BrainProps {
  className?: string
}

// Nœuds du réseau neuronal avec positions relatives
const NEURAL_NODES = [
  // Hémisphère gauche
  { id: 'l1', x: 180, y: 120, size: 4 },
  { id: 'l2', x: 150, y: 180, size: 5 },
  { id: 'l3', x: 200, y: 200, size: 4 },
  { id: 'l4', x: 170, y: 260, size: 5 },
  { id: 'l5', x: 220, y: 280, size: 4 },
  { id: 'l6', x: 140, y: 320, size: 4 },
  // Hémisphère droit
  { id: 'r1', x: 420, y: 120, size: 4 },
  { id: 'r2', x: 450, y: 180, size: 5 },
  { id: 'r3', x: 400, y: 200, size: 4 },
  { id: 'r4', x: 430, y: 260, size: 5 },
  { id: 'r5', x: 380, y: 280, size: 4 },
  { id: 'r6', x: 460, y: 320, size: 4 },
  // Centre (corps calleux)
  { id: 'c1', x: 300, y: 150, size: 6 },
  { id: 'c2', x: 300, y: 220, size: 5 },
  { id: 'c3', x: 300, y: 300, size: 5 },
]

// Connexions entre les nœuds
const CONNECTIONS = [
  // Hémisphère gauche interne
  { from: 'l1', to: 'l2' },
  { from: 'l2', to: 'l3' },
  { from: 'l3', to: 'l4' },
  { from: 'l4', to: 'l5' },
  { from: 'l5', to: 'l6' },
  { from: 'l2', to: 'l4' },
  { from: 'l1', to: 'l3' },
  // Hémisphère droit interne
  { from: 'r1', to: 'r2' },
  { from: 'r2', to: 'r3' },
  { from: 'r3', to: 'r4' },
  { from: 'r4', to: 'r5' },
  { from: 'r5', to: 'r6' },
  { from: 'r2', to: 'r4' },
  { from: 'r1', to: 'r3' },
  // Connexions inter-hémisphères via le centre
  { from: 'l1', to: 'c1' },
  { from: 'r1', to: 'c1' },
  { from: 'l3', to: 'c2' },
  { from: 'r3', to: 'c2' },
  { from: 'l5', to: 'c3' },
  { from: 'r5', to: 'c3' },
  { from: 'c1', to: 'c2' },
  { from: 'c2', to: 'c3' },
]

// Flux de signaux neuronaux (particules animées sur les connexions)
const SIGNAL_PATHS = [
  { from: 'l1', to: 'c1', delay: 0, duration: 2 },
  { from: 'c1', to: 'r1', delay: 0.5, duration: 2 },
  { from: 'l3', to: 'c2', delay: 1, duration: 1.8 },
  { from: 'c2', to: 'r3', delay: 1.5, duration: 1.8 },
  { from: 'l2', to: 'l4', delay: 0.3, duration: 1.5 },
  { from: 'r2', to: 'r4', delay: 0.8, duration: 1.5 },
  { from: 'c1', to: 'c2', delay: 2, duration: 1.2 },
  { from: 'c2', to: 'c3', delay: 2.5, duration: 1.2 },
]

export const Brain: React.FC<BrainProps> = ({ className = '' }) => {
  const getNode = (id: string) => NEURAL_NODES.find((n) => n.id === id)

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 600 400"
        fill="none"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Visualisation d'un cerveau avec des connexions neuronales animées"
      >
        <defs>
          {/* Gradient principal teal → secondaire → primaire */}
          <linearGradient id="brain-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#0d9488" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.8" />
          </linearGradient>

          {/* Gradient pour les connexions */}
          <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#0d9488" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.3" />
          </linearGradient>

          {/* Gradient pour le contour du cerveau */}
          <linearGradient id="brain-outline" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#0d9488" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.4" />
          </linearGradient>

          {/* Gradient pour les signaux */}
          <radialGradient id="signal-gradient">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="1" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
          </radialGradient>

          {/* Filtre de lueur */}
          <filter id="brain-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Filtre de lueur intense pour les signaux */}
          <filter id="signal-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Contour stylisé du cerveau - hémisphère gauche */}
        <path
          d="M 120 200
             C 100 140, 140 80, 200 80
             C 260 80, 280 120, 290 160
             C 295 180, 298 200, 298 220
             C 298 260, 280 320, 240 360
             C 200 390, 140 380, 120 340
             C 100 300, 100 260, 120 200"
          fill="none"
          stroke="url(#brain-outline)"
          strokeWidth="2"
          opacity="0.5"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.3;0.6;0.3"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        {/* Contour stylisé du cerveau - hémisphère droit */}
        <path
          d="M 480 200
             C 500 140, 460 80, 400 80
             C 340 80, 320 120, 310 160
             C 305 180, 302 200, 302 220
             C 302 260, 320 320, 360 360
             C 400 390, 460 380, 480 340
             C 500 300, 500 260, 480 200"
          fill="none"
          stroke="url(#brain-outline)"
          strokeWidth="2"
          opacity="0.5"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.3;0.6;0.3"
            dur="4s"
            begin="0.5s"
            repeatCount="indefinite"
          />
        </path>

        {/* Sillon central (corps calleux) */}
        <path
          d="M 300 100 C 300 120, 300 140, 300 160"
          fill="none"
          stroke="url(#connection-gradient)"
          strokeWidth="1.5"
          opacity="0.4"
        />

        {/* Connexions entre les nœuds */}
        <g className="connections">
          {CONNECTIONS.map((conn, i) => {
            const fromNode = getNode(conn.from)
            const toNode = getNode(conn.to)
            if (!fromNode || !toNode) return null

            return (
              <line
                key={`conn-${i}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="url(#connection-gradient)"
                strokeWidth="1"
                opacity="0.4"
              >
                <animate
                  attributeName="opacity"
                  values="0.2;0.5;0.2"
                  dur={`${2 + (i % 3)}s`}
                  begin={`${(i * 0.2) % 2}s`}
                  repeatCount="indefinite"
                />
              </line>
            )
          })}
        </g>

        {/* Nœuds neuronaux pulsants */}
        <g className="nodes" filter="url(#brain-glow)">
          {NEURAL_NODES.map((node, i) => (
            <g key={node.id}>
              {/* Cercle externe pulsant */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size + 4}
                fill="none"
                stroke="#14B8A6"
                strokeWidth="1"
                opacity="0"
              >
                <animate
                  attributeName="r"
                  values={`${node.size};${node.size + 10};${node.size}`}
                  dur="3s"
                  begin={`${i * 0.2}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0;0.4"
                  dur="3s"
                  begin={`${i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </circle>
              {/* Nœud principal */}
              <circle cx={node.x} cy={node.y} r={node.size} fill="url(#brain-gradient)">
                <animate
                  attributeName="opacity"
                  values="0.6;1;0.6"
                  dur={`${2 + (i % 2)}s`}
                  begin={`${i * 0.15}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
        </g>

        {/* Signaux neuronaux animés (particules voyageant sur les connexions) */}
        <g className="signals" filter="url(#signal-glow)">
          {SIGNAL_PATHS.map((signal, i) => {
            const fromNode = getNode(signal.from)
            const toNode = getNode(signal.to)
            if (!fromNode || !toNode) return null

            return (
              <circle key={`signal-${i}`} r="3" fill="#14B8A6" opacity="0">
                <animate
                  attributeName="cx"
                  values={`${fromNode.x};${toNode.x}`}
                  dur={`${signal.duration}s`}
                  begin={`${signal.delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`${fromNode.y};${toNode.y}`}
                  dur={`${signal.duration}s`}
                  begin={`${signal.delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.9;0.9;0"
                  keyTimes="0;0.1;0.9;1"
                  dur={`${signal.duration}s`}
                  begin={`${signal.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )
          })}
        </g>

        {/* Particules ambiantes flottantes */}
        <g className="ambient-particles">
          {[
            { x: 160, y: 150, delay: 0 },
            { x: 440, y: 150, delay: 0.7 },
            { x: 200, y: 300, delay: 1.4 },
            { x: 400, y: 300, delay: 2.1 },
            { x: 300, y: 180, delay: 0.5 },
          ].map((particle, i) => (
            <circle
              key={`particle-${i}`}
              cx={particle.x}
              cy={particle.y}
              r="1.5"
              fill="#14B8A6"
              opacity="0"
            >
              <animate
                attributeName="cy"
                values={`${particle.y};${particle.y - 30};${particle.y}`}
                dur="4s"
                begin={`${particle.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.6;0"
                dur="4s"
                begin={`${particle.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      </svg>
    </div>
  )
}

export default Brain
