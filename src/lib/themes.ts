/** Site styles, chosen in /admin → Profile → Site style. Each one is a block in src/styles/global.css. */
export const themes = ['night', 'day', 'sidebar', 'minimal', 'slate'] as const;
export type Theme = (typeof themes)[number];

/** How the home page introduces you: centred profile, profile column on every page, or text beside photo. */
export const homeLayout: Record<Theme, 'centered' | 'sidebar' | 'split'> = {
  night: 'centered',
  day: 'centered',
  sidebar: 'sidebar',
  minimal: 'centered',
  slate: 'split',
};
