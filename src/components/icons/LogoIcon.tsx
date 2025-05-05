import type { SVGProps } from "react";

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Abstract representation of transformation/simplification */}
      {/* Layer 1: Complex lines */}
      <path d="M4 8 L8 12 L4 16" opacity="0.6"/>
      <path d="M8 6 L12 10 L8 14" opacity="0.6"/>
      <path d="M12 4 L16 8 L12 12" opacity="0.6"/>

      {/* Layer 2: Simplified line */}
       <path d="M16 12 L20 16 L16 20" strokeWidth="2.5" className="text-primary"/>

       {/* Arrow indicating direction of transformation */}
       <line x1="10" y1="17" x2="14" y2="17" strokeWidth="1.5" opacity="0.8"/>
       <polyline points="12 15, 14 17, 12 19" strokeWidth="1.5" opacity="0.8"/>
    </svg>
  );
}
