"use client";

// Tennis Racket Logo Component
export function TennisRacketLogo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Racket handle */}
      <rect x="28" y="38" width="8" height="22" rx="2" fill="currentColor" className="text-lime-400"/>
      {/* Racket head */}
      <ellipse cx="32" cy="20" rx="20" ry="18" fill="none" stroke="currentColor" strokeWidth="4" className="text-lime-400"/>
      {/* Racket strings vertical */}
      <line x1="20" y1="8" x2="20" y2="32" stroke="currentColor" strokeWidth="1.5" className="text-lime-400/60"/>
      <line x1="26" y1="6" x2="26" y2="34" stroke="currentColor" strokeWidth="1.5" className="text-lime-400/60"/>
      <line x1="32" y1="5" x2="32" y2="35" stroke="currentColor" strokeWidth="1.5" className="text-lime-400/60"/>
      <line x1="38" y1="6" x2="38" y2="34" stroke="currentColor" strokeWidth="1.5" className="text-lime-400/60"/>
      <line x1="44" y1="8" x2="44" y2="32" stroke="currentColor" strokeWidth="1.5" className="text-lime-400/60"/>
      {/* Racket strings horizontal */}
      <line x1="14" y1="14" x2="50" y2="14" stroke="currentColor" strokeWidth="1.5" className="text-lime-400/60"/>
      <line x1="12" y1="20" x2="52" y2="20" stroke="currentColor" strokeWidth="1.5" className="text-lime-400/60"/>
      <line x1="12" y1="26" x2="52" y2="26" stroke="currentColor" strokeWidth="1.5" className="text-lime-400/60"/>
    </svg>
  );
}

// Tennis Ball Icon
export function TennisBallIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ball */}
      <circle cx="20" cy="20" r="18" fill="currentColor" className="text-lime-400"/>
      {/* Curved lines on ball */}
      <path d="M8 20 Q20 6 32 20" stroke="#0a1628" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M8 20 Q20 34 32 20" stroke="#0a1628" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// Tennis Court Icon
export function TennisCourtIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Court outline */}
      <rect x="4" y="8" width="40" height="32" rx="2" stroke="currentColor" strokeWidth="2" className="text-lime-400"/>
      {/* Center line */}
      <line x1="4" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="1.5" className="text-lime-400"/>
      {/* Service boxes */}
      <line x1="24" y1="8" x2="24" y2="16" stroke="currentColor" strokeWidth="1.5" className="text-lime-400"/>
      <line x1="24" y1="32" x2="24" y2="40" stroke="currentColor" strokeWidth="1.5" className="text-lime-400"/>
      {/* Net */}
      <line x1="4" y1="16" x2="44" y2="16" stroke="currentColor" strokeWidth="2" className="text-orange-500"/>
      <line x1="4" y1="32" x2="44" y2="32" stroke="currentColor" strokeWidth="2" className="text-orange-500"/>
    </svg>
  );
}

// Combined Tennis Ball & Racket Icon
export function TennisIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ball */}
      <circle cx="18" cy="18" r="12" fill="currentColor" className="text-lime-400"/>
      <path d="M10 18 Q18 10 26 18" stroke="#0a1628" strokeWidth="1.5" fill="none"/>
      <path d="M10 18 Q18 26 26 18" stroke="#0a1628" strokeWidth="1.5" fill="none"/>
      {/* Racket */}
      <rect x="30" y="28" width="4" height="14" rx="1" fill="currentColor" className="text-lime-400"/>
      <ellipse cx="39" cy="18" rx="8" ry="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-lime-400"/>
    </svg>
  );
}
