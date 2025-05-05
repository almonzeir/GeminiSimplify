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
      {/* Simple wave/transformation symbol */}
      <path d="M3 6c3 0 6 4 9 4s6-4 9-4" />
      <path d="M3 18c3 0 6-4 9-4s6 4 9 4" />
      <path d="M3 12h18" />
    </svg>
  );
}
