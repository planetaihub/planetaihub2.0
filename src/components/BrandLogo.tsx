import React, { useId } from 'react';

interface BrandLogoProps {
  className?: string;
}

/**
 * Custom geometric planet-orbit emblem for PlanetAI Hub
 * with an Electric Cyan (#22D3EE) to Indigo (#6366F1) gradient stroke.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = 'h-7 w-7 shrink-0',
}) => {
  const uid = useId().replace(/:/g, '');
  const strokeGradId = `planetai-stroke-${uid}`;
  const coreGradId = `planetai-core-${uid}`;

  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient
          id={strokeGradId}
          x1="4"
          y1="6"
          x2="32"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="55%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <radialGradient
          id={coreGradId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(15 15) rotate(45) scale(13)"
        >
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.06" />
        </radialGradient>
      </defs>

      {/* Planet Sphere */}
      <circle
        cx="18"
        cy="18"
        r="9.25"
        fill={`url(#${coreGradId})`}
        stroke={`url(#${strokeGradId})`}
        strokeWidth="1.85"
      />

      {/* Geometric Meridian Arc */}
      <path
        d="M18 8.75C21.2 11.4 22.75 14.5 22.75 18C22.75 21.5 21.2 24.6 18 27.25"
        stroke={`url(#${strokeGradId})`}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />

      {/* Tilted Elliptical Orbit Ring */}
      <ellipse
        cx="18"
        cy="18"
        rx="15.2"
        ry="5.6"
        transform="rotate(-24 18 18)"
        stroke={`url(#${strokeGradId})`}
        strokeWidth="1.75"
        strokeLinecap="round"
      />

      {/* Orbital AI Satellite Node */}
      <circle cx="29.6" cy="12.8" r="2.1" fill="#22D3EE" />
      <circle cx="29.6" cy="12.8" r="3.4" stroke="#22D3EE" strokeOpacity="0.35" strokeWidth="1" />
    </svg>
  );
};
