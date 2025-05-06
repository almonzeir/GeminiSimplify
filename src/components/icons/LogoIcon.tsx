import type { SVGProps } from "react";

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5" // Slightly thinner lines for tech look
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Abstract geometric shape representing simplification/transformation */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Outer frame */}
      <path d="M12 2 L22 7 L22 17 L12 22 L2 17 L2 7 Z" stroke="url(#logoGradient)" opacity="0.6"/>

      {/* Inner transforming element */}
      <path d="M6 9 L12 6 L18 9" stroke="hsl(var(--foreground))" opacity="0.8" />
      <path d="M6 15 L12 18 L18 15" stroke="hsl(var(--primary))" strokeWidth="2" />

      {/* Connection lines */}
      <line x1="12" y1="6" x2="12" y2="18" stroke="hsl(var(--accent))" opacity="0.5"/>
      <line x1="6" y1="9" x2="6" y2="15" stroke="hsl(var(--foreground))" opacity="0.4"/>
      <line x1="18" y1="9" x2="18" y2="15" stroke="hsl(var(--foreground))" opacity="0.4"/>
    </svg>
  );
}
