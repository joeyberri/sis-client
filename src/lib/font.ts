// Geist font configuration using fallback approach
// Instead of using next/font/google which can cause Turbopack issues,
// we use system fonts with Geist as a CSS fallback.
// The actual Geist font is loaded via CSS in layout.tsx

export const fontVariables = 'font-sans';
