export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="19" stroke="currentColor" strokeOpacity="0.35" />
      <path
        d="M11 21h15v3a7 7 0 0 1-7 7h-1a7 7 0 0 1-7-7v-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M26 22.5h1.5a2.5 2.5 0 0 1 0 5h-2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M15 17c-1.5-1.6 1.5-2.6 0-4.4M19 17c-1.5-1.6 1.5-2.6 0-4.4M23 17c-1.5-1.6 1.5-2.6 0-4.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="m29 8.5.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z"
        fill="currentColor"
      />
    </svg>
  );
}
