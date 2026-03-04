"use client";

// Realistic Tennis Ball
export function TennisBallLogo({ className = "", size = 80 }: { className?: string; size?: number }) {
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
        <radialGradient id="ballGrad" cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#D4FF4A" />
          <stop offset="60%" stopColor="#ADFF2F" />
          <stop offset="100%" stopColor="#7CB342" />
        </radialGradient>
      </defs>
      
      {/* Main ball */}
      <circle cx="40" cy="40" r="36" fill="url(#ballGrad)" />
      
      {/* Curved lines */}
      <path d="M16 40 Q40 8 64 40" stroke="#33691E" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M16 40 Q40 72 64 40" stroke="#33691E" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7"/>
      
      {/* Highlight */}
      <ellipse cx="28" cy="26" rx="14" ry="10" fill="#FFFFFF" opacity="0.3" />
    </svg>
  );
}

// Realistic Tennis Racket
export function TennisRacketLogo({ className = "", size = 80 }: { className?: string; size?: number }) {
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
        <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2D2D2D" />
          <stop offset="50%" stopColor="#1A1A1A" />
          <stop offset="100%" stopColor="#0D0D0D" />
        </linearGradient>
      </defs>
      
      {/* Racket head */}
      <ellipse cx="40" cy="28" rx="28" ry="22" fill="none" stroke="#C0C0C0" strokeWidth="4" />
      
      {/* Throat */}
      <path d="M22 44 Q40 52 58 44" stroke="#A0A0A0" strokeWidth="3" fill="none" />
      
      {/* Handle */}
      <rect x="35" y="52" width="10" height="22" rx="3" fill="url(#handleGrad)" />
      
      {/* Strings */}
      <g stroke="#D0D0D0" strokeWidth="0.5" opacity="0.6">
        {[16, 22, 28, 34, 40, 46, 52, 58, 64].map((x) => (
          <line key={x} x1={x} y1="12" x2={x} y2="44" />
        ))}
        {[18, 26, 34, 42].map((y) => (
          <line key={y} x1="18" y1={y} x2="62" y2={y} />
        ))}
      </g>
    </svg>
  );
}

// Ball + Racket combo for background
export function TennisBallWithRacket({ className = "", size = 200 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Racket tilted */}
      <g transform="rotate(-25, 100, 100)" opacity="0.5">
        <ellipse cx="100" cy="70" rx="50" ry="38" fill="none" stroke="#B0B0B0" strokeWidth="5" />
        <rect x="90" y="105" width="20" height="55" rx="4" fill="#1A1A1A" />
        <g stroke="#D0D0D0" strokeWidth="0.5" opacity="0.4">
          {[60, 70, 80, 90, 100, 110, 120, 130, 140].map((x) => (
            <line key={x} x1={x} y1="40" x2={x} y2="100" />
          ))}
        </g>
      </g>
      {/* Ball */}
      <circle cx="140" cy="140" r="28" fill="#ADFF2F" />
      <path d="M120 140 Q140 118 160 140" stroke="#33691E" strokeWidth="2" fill="none" />
      <path d="M120 140 Q140 162 160 140" stroke="#33691E" strokeWidth="2" fill="none" />
    </svg>
  );
}

// Small ball icon
export function TennisBallIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#ADFF2F" />
      <path d="M5 12 Q12 4 19 12" stroke="#33691E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M5 12 Q12 20 19 12" stroke="#33691E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
