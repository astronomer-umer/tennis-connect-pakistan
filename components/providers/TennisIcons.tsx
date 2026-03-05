"use client";

// 3D Mesh-style Tennis Ball — wireframe sphere with depth shading
export function TennisBallLogo({ className = "", size = 80 }: { className?: string; size?: number }) {
  const id = `ball-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 3D sphere gradient — bright highlight top-left, deep shadow bottom-right */}
        <radialGradient id={`${id}-sphere`} cx="30%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#E8FF6A" />
          <stop offset="30%" stopColor="#C6F02A" />
          <stop offset="65%" stopColor="#7CB342" />
          <stop offset="100%" stopColor="#3D6B1A" />
        </radialGradient>
        {/* Specular highlight */}
        <radialGradient id={`${id}-spec`} cx="32%" cy="26%" r="28%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        {/* Inner shadow for depth */}
        <radialGradient id={`${id}-inner`} cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </radialGradient>
        {/* Ambient occlusion / drop shadow */}
        <radialGradient id={`${id}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="42" cy="72" rx="20" ry="4" fill={`url(#${id}-shadow)`} />

      {/* Main sphere body */}
      <circle cx="40" cy="38" r="34" fill={`url(#${id}-sphere)`} />

      {/* Wireframe mesh — latitude lines (curved for 3D effect) */}
      <g stroke="#2E5A0E" strokeWidth="0.8" fill="none" opacity="0.5">
        {/* Equator */}
        <ellipse cx="40" cy="38" rx="34" ry="6" />
        {/* Upper latitude */}
        <ellipse cx="40" cy="24" rx="28" ry="5" />
        {/* Lower latitude */}
        <ellipse cx="40" cy="52" rx="28" ry="5" />
        {/* Near top */}
        <ellipse cx="40" cy="14" rx="16" ry="3" />
        {/* Near bottom */}
        <ellipse cx="40" cy="62" rx="16" ry="3" />
      </g>

      {/* Wireframe mesh — longitude lines (ellipses rotated) */}
      <g stroke="#2E5A0E" strokeWidth="0.8" fill="none" opacity="0.45">
        <ellipse cx="40" cy="38" rx="6" ry="34" />
        <ellipse cx="40" cy="38" rx="18" ry="34" />
        <ellipse cx="40" cy="38" rx="28" ry="34" />
      </g>

      {/* Tennis seam curves — the signature S-curve */}
      <path
        d="M12 30 C22 10, 40 8, 40 38 C40 68, 58 66, 68 46"
        stroke="#1B4D0A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M68 30 C58 10, 40 8, 40 38 C40 68, 22 66, 12 46"
        stroke="#1B4D0A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Inner shadow for 3D depth */}
      <circle cx="40" cy="38" r="34" fill={`url(#${id}-inner)`} />

      {/* Specular highlight — glass-like reflection */}
      <circle cx="40" cy="38" r="34" fill={`url(#${id}-spec)`} />

      {/* Secondary highlight edge */}
      <ellipse cx="30" cy="24" rx="10" ry="7" fill="#FFFFFF" opacity="0.15" />
    </svg>
  );
}

// 3D Mesh-style Tennis Racket — perspective with depth
export function TennisRacketLogo({ className = "", size = 80 }: { className?: string; size?: number }) {
  const id = `racket-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Metallic frame gradient */}
        <linearGradient id={`${id}-frame`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8E8E8" />
          <stop offset="25%" stopColor="#B0B0B0" />
          <stop offset="50%" stopColor="#D8D8D8" />
          <stop offset="75%" stopColor="#909090" />
          <stop offset="100%" stopColor="#686868" />
        </linearGradient>
        {/* Frame inner edge */}
        <linearGradient id={`${id}-frame-inner`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A0A0A0" />
          <stop offset="100%" stopColor="#606060" />
        </linearGradient>
        {/* Handle wrap gradient — leather texture */}
        <linearGradient id={`${id}-handle`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1A1A1A" />
          <stop offset="20%" stopColor="#3A3A3A" />
          <stop offset="40%" stopColor="#1A1A1A" />
          <stop offset="60%" stopColor="#3A3A3A" />
          <stop offset="80%" stopColor="#1A1A1A" />
          <stop offset="100%" stopColor="#2A2A2A" />
        </linearGradient>
        {/* Lime accent for brand */}
        <linearGradient id={`${id}-accent`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        {/* Drop shadow */}
        <filter id={`${id}-dshadow`} x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter={`url(#${id}-dshadow)`}>
        {/* Racket head — outer frame (3D with double stroke) */}
        <ellipse cx="40" cy="26" rx="26" ry="20" stroke={`url(#${id}-frame)`} strokeWidth="5" fill="none" />
        <ellipse cx="40" cy="26" rx="23" ry="17" stroke={`url(#${id}-frame-inner)`} strokeWidth="1.5" fill="none" opacity="0.6" />

        {/* String mesh — vertical (with slight perspective convergence) */}
        <g stroke="#D4D4D4" strokeWidth="0.6" opacity="0.55">
          <line x1="24" y1="14" x2="25" y2="40" />
          <line x1="28" y1="11" x2="29" y2="42" />
          <line x1="32" y1="9" x2="33" y2="43" />
          <line x1="36" y1="8" x2="37" y2="44" />
          <line x1="40" y1="7" x2="40" y2="44" />
          <line x1="44" y1="8" x2="43" y2="44" />
          <line x1="48" y1="9" x2="47" y2="43" />
          <line x1="52" y1="11" x2="51" y2="42" />
          <line x1="56" y1="14" x2="55" y2="40" />
        </g>

        {/* String mesh — horizontal (curved for 3D) */}
        <g stroke="#D4D4D4" strokeWidth="0.6" opacity="0.55">
          <path d="M18 16 Q40 13 62 16" />
          <path d="M16 22 Q40 18 64 22" />
          <path d="M15 28 Q40 24 65 28" />
          <path d="M16 34 Q40 30 64 34" />
          <path d="M18 40 Q40 37 62 40" />
        </g>

        {/* Mesh intersection dots — gives woven look */}
        <g fill="#FFFFFF" opacity="0.2">
          {[24,32,40,48,56].map((x) =>
            [16,22,28,34].map((y) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" />
            ))
          )}
        </g>

        {/* Throat / Y-piece */}
        <path d="M26 42 L36 54" stroke={`url(#${id}-frame)`} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M54 42 L44 54" stroke={`url(#${id}-frame)`} strokeWidth="3.5" strokeLinecap="round" />

        {/* Handle shaft */}
        <rect x="36" y="52" width="8" height="22" rx="2" fill={`url(#${id}-handle)`} />

        {/* Handle accent band (brand color) */}
        <rect x="36" y="56" width="8" height="3" rx="1" fill={`url(#${id}-accent)`} opacity="0.9" />
        <rect x="36" y="62" width="8" height="3" rx="1" fill={`url(#${id}-accent)`} opacity="0.7" />

        {/* Handle butt cap */}
        <rect x="35" y="72" width="10" height="3" rx="1.5" fill="#2A2A2A" />

        {/* Frame highlight — top edge for 3D pop */}
        <path d="M20 20 Q40 4 60 20" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// 3D Mesh Ball + Racket combo for background watermark
export function TennisBallWithRacket({ className = "", size = 200 }: { className?: string; size?: number }) {
  const id = "combo";
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${id}-ball`} cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#D4FF4A" />
          <stop offset="40%" stopColor="#A8E02A" />
          <stop offset="100%" stopColor="#4A7A18" />
        </radialGradient>
        <radialGradient id={`${id}-ball-inner`} cx="50%" cy="50%" r="50%">
          <stop offset="65%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
        </radialGradient>
        <linearGradient id={`${id}-frame`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D0D0D0" />
          <stop offset="50%" stopColor="#A0A0A0" />
          <stop offset="100%" stopColor="#707070" />
        </linearGradient>
      </defs>

      {/* Racket — tilted with 3D frame */}
      <g transform="rotate(-25, 100, 100)" opacity="0.5">
        {/* Head frame — double stroke for depth */}
        <ellipse cx="100" cy="65" rx="48" ry="36" stroke={`url(#${id}-frame)`} strokeWidth="6" fill="none" />
        <ellipse cx="100" cy="65" rx="44" ry="32" stroke="#888888" strokeWidth="1.5" fill="none" opacity="0.4" />

        {/* String mesh — vertical */}
        <g stroke="#C0C0C0" strokeWidth="0.7" opacity="0.4">
          {[64, 72, 80, 88, 96, 104, 112, 120, 128, 136].map((x) => (
            <line key={x} x1={x} y1="36" x2={x} y2="94" />
          ))}
        </g>

        {/* String mesh — horizontal curved */}
        <g stroke="#C0C0C0" strokeWidth="0.7" opacity="0.4">
          <path d="M58 48 Q100 42 142 48" />
          <path d="M55 58 Q100 52 145 58" />
          <path d="M54 68 Q100 62 146 68" />
          <path d="M55 78 Q100 72 145 78" />
          <path d="M58 88 Q100 82 142 88" />
        </g>

        {/* Throat */}
        <path d="M66 94 L88 115" stroke="#A0A0A0" strokeWidth="4" strokeLinecap="round" />
        <path d="M134 94 L112 115" stroke="#A0A0A0" strokeWidth="4" strokeLinecap="round" />

        {/* Handle */}
        <rect x="88" y="112" width="24" height="50" rx="4" fill="#1A1A1A" />
        <rect x="88" y="120" width="24" height="4" rx="1" fill="#22c55e" opacity="0.4" />
        <rect x="88" y="130" width="24" height="4" rx="1" fill="#22c55e" opacity="0.3" />
      </g>

      {/* 3D Tennis Ball */}
      <g>
        {/* Shadow beneath ball */}
        <ellipse cx="144" cy="172" rx="18" ry="4" fill="#000000" opacity="0.2" />

        {/* Main sphere */}
        <circle cx="140" cy="140" r="28" fill={`url(#${id}-ball)`} />

        {/* Wireframe mesh on ball */}
        <g stroke="#2E5A0E" strokeWidth="0.6" fill="none" opacity="0.4">
          <ellipse cx="140" cy="140" rx="28" ry="5" />
          <ellipse cx="140" cy="128" rx="22" ry="4" />
          <ellipse cx="140" cy="152" rx="22" ry="4" />
          <ellipse cx="140" cy="140" rx="5" ry="28" />
          <ellipse cx="140" cy="140" rx="16" ry="28" />
        </g>

        {/* Seam curves */}
        <path d="M118 134 C126 118, 138 116, 140 140 C142 164, 154 162, 162 146" stroke="#1B4D0A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M162 134 C154 118, 142 116, 140 140 C138 164, 126 162, 118 146" stroke="#1B4D0A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />

        {/* Inner shadow */}
        <circle cx="140" cy="140" r="28" fill={`url(#${id}-ball-inner)`} />

        {/* Specular highlight */}
        <ellipse cx="132" cy="130" rx="10" ry="7" fill="#FFFFFF" opacity="0.25" />
      </g>
    </svg>
  );
}

// Small 3D mesh tennis ball icon
export function TennisBallIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  const id = `mini-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${id}-g`} cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#E0FF50" />
          <stop offset="50%" stopColor="#A8E02A" />
          <stop offset="100%" stopColor="#5A8A20" />
        </radialGradient>
        <radialGradient id={`${id}-s`} cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
        </radialGradient>
      </defs>

      {/* Sphere */}
      <circle cx="12" cy="12" r="10" fill={`url(#${id}-g)`} />

      {/* Mini wireframe */}
      <g stroke="#2E5A0E" strokeWidth="0.4" fill="none" opacity="0.4">
        <ellipse cx="12" cy="12" rx="10" ry="2" />
        <ellipse cx="12" cy="12" rx="2" ry="10" />
        <ellipse cx="12" cy="12" rx="6" ry="10" />
      </g>

      {/* Seam curves */}
      <path d="M4 10 C7 4, 11 3, 12 12 C13 21, 17 20, 20 14" stroke="#1B4D0A" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M20 10 C17 4, 13 3, 12 12 C11 21, 7 20, 4 14" stroke="#1B4D0A" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />

      {/* Inner shadow */}
      <circle cx="12" cy="12" r="10" fill={`url(#${id}-s)`} />

      {/* Highlight */}
      <ellipse cx="9" cy="8" rx="3" ry="2.5" fill="#FFFFFF" opacity="0.3" />
    </svg>
  );
}

// 3D Tennis Court icon — top-down perspective court
export function TennisCourtIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="court-surface" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a6b3c" />
          <stop offset="100%" stopColor="#0e4d2a" />
        </linearGradient>
      </defs>
      {/* Court surface */}
      <rect x="2" y="3" width="20" height="18" rx="1" fill="url(#court-surface)" />
      {/* Outer boundary */}
      <rect x="3" y="4" width="18" height="16" rx="0.5" stroke="#FFFFFF" strokeWidth="0.8" fill="none" />
      {/* Center line */}
      <line x1="12" y1="4" x2="12" y2="20" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.8" />
      {/* Service boxes */}
      <line x1="3" y1="12" x2="21" y2="12" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.8" />
      {/* Service line left */}
      <line x1="6" y1="7" x2="6" y2="17" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.6" />
      {/* Service line right */}
      <line x1="18" y1="7" x2="18" y2="17" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.6" />
      {/* Net */}
      <line x1="12" y1="3" x2="12" y2="21" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.3" strokeDasharray="1 1" />
    </svg>
  );
}

// 3D Net mesh icon
export function TennisNetIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Net posts */}
      <rect x="2" y="4" width="1.5" height="16" rx="0.5" fill="#A0A0A0" />
      <rect x="20.5" y="4" width="1.5" height="16" rx="0.5" fill="#808080" />
      {/* Top cable */}
      <path d="M3 5 Q12 3 21 5" stroke="#D0D0D0" strokeWidth="1" fill="none" />
      {/* Vertical mesh lines */}
      <g stroke="#C0C0C0" strokeWidth="0.4" opacity="0.6">
        {[5, 7.5, 10, 12.5, 15, 17.5].map((x) => (
          <line key={x} x1={x} y1="5" x2={x} y2="20" />
        ))}
      </g>
      {/* Horizontal mesh lines */}
      <g stroke="#C0C0C0" strokeWidth="0.4" opacity="0.6">
        <path d="M3 8 Q12 6.5 21 8" />
        <path d="M3 11 Q12 9.5 21 11" />
        <path d="M3 14 Q12 13 21 14" />
        <path d="M3 17 Q12 16 21 17" />
      </g>
      {/* Post caps */}
      <circle cx="2.75" cy="4" r="1" fill="#C0C0C0" />
      <circle cx="21.25" cy="4" r="1" fill="#A0A0A0" />
    </svg>
  );
}
