import type { ReactNode } from 'react'

export type XpIconName =
  | 'about'
  | 'projects'
  | 'skills-experience'
  | 'education'
  | 'blog'
  | 'contact'
  | 'help'
  | 'computer'

/**
 * Original colour icons for the XP desktop, drawn on a 32px grid.
 *
 * Flat fills only, no <linearGradient>: the same icon renders several times
 * at once (desktop, title bar, taskbar, Start menu) and a gradient id inside
 * a minimized window (display:none) stops resolving for every other copy.
 */
const ART: Record<XpIconName, ReactNode> = {
  about: (
    <>
      <path d="M6 28c0-6 4.5-9 10-9s10 3 10 9z" fill="#3A7BD5" stroke="#1B4A91" />
      <circle cx="16" cy="11" r="6" fill="#F5C9A0" stroke="#B07A4A" />
      <path d="M10 10a6 6 0 0 1 12 0c-2-2.5-10-2.5-12 0z" fill="#5B3A1E" />
    </>
  ),
  projects: (
    <>
      <path d="M3 8h9l3 3h14v15H3z" fill="#E8B030" stroke="#9A6B00" />
      <path d="M3 13h26v13H3z" fill="#FFD766" stroke="#9A6B00" />
      <path d="M5 15h22" stroke="#FFF0B0" />
    </>
  ),
  'skills-experience': (
    <>
      <path d="M16 17l12 5-12 5-12-5z" fill="#E8792B" stroke="#9C4A10" />
      <path d="M16 11l12 5-12 5-12-5z" fill="#5BB83A" stroke="#2F7A1A" />
      <path d="M16 5l12 5-12 5-12-5z" fill="#4A90E2" stroke="#1B4A91" />
    </>
  ),
  education: (
    <>
      <path d="M9 16v6c0 2 3.5 4 7 4s7-2 7-4v-6" fill="#2B3A67" stroke="#141D3A" />
      <path d="M16 6L2 13l14 7 14-7z" fill="#3B4F8C" stroke="#141D3A" />
      <path d="M27 14v8" stroke="#E8B030" strokeWidth="2" />
      <circle cx="27" cy="23" r="2" fill="#E8B030" />
    </>
  ),
  blog: (
    <>
      <path d="M7 3h13l6 6v20H7z" fill="#FFFFFF" stroke="#6B7A99" />
      <path d="M20 3v6h6z" fill="#C9D7FB" stroke="#6B7A99" />
      <path d="M11 14h11M11 18h11M11 22h8" stroke="#316AC5" strokeWidth="2" />
    </>
  ),
  contact: (
    <>
      <rect x="3" y="7" width="26" height="18" rx="1" fill="#FFF8DC" stroke="#9A7B2E" />
      <path d="M3 8l13 10 13-10" fill="none" stroke="#9A7B2E" strokeWidth="1.5" />
    </>
  ),
  help: (
    <>
      <circle cx="16" cy="16" r="13" fill="#2F74D8" stroke="#123E8C" />
      <path
        d="M12 12.5a4 4 0 1 1 6.2 3.3c-1.4 1-2.2 1.7-2.2 3.2"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="16" cy="23.5" r="1.8" fill="#FFFFFF" />
    </>
  ),
  computer: (
    <>
      <rect x="4" y="5" width="24" height="17" rx="2" fill="#D8D4C4" stroke="#6B6857" />
      <rect x="7" y="8" width="18" height="11" fill="#3A8BE0" stroke="#1B4A91" />
      <path d="M13 22h6l1 4h-8z" fill="#B8B4A4" stroke="#6B6857" />
      <rect x="9" y="26" width="14" height="2" fill="#8C8878" />
    </>
  ),
}

/** One XP icon; CSS sizes it per surface (16px default, 32px on the desktop). */
export function XpIcon({ name }: { name: XpIconName }) {
  return (
    <svg className="xp-icon" viewBox="0 0 32 32" width="16" height="16" aria-hidden="true" strokeLinejoin="round">
      {ART[name]}
    </svg>
  )
}
