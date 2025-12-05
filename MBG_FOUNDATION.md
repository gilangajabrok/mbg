# MBG Premium Admin Foundation UI System

## Overview

The MBG Foundation is a comprehensive, enterprise-grade admin UI system engineered for clarity, expressiveness, and physical interactivity. Built with Next.js 16, Tailwind CSS v4, Framer Motion, and premium UX patterns.

## Key Features

### 🎨 Visual & Motion Design

- **Glassmorphism**: Translucent panels with backdrop blur and subtle gradients
- **Premium Typography**: Inter font with optical sizing and responsive scale
- **Soft Color Palette**: Neutral backgrounds with blue and pink accents
- **Framer Motion**: Expressive micro-interactions and smooth transitions
- **Sound Feedback**: Subtle audio cues for all interactions (15% volume)

### 🏗️ Architecture

\`\`\`
/app
  /dashboard         - Main overview page with stats and charts
  /analytics         - Traffic and conversion analytics
  /users             - User management table
  /projects          - Project cards grid
  /billing           - Subscription plans and pricing
  /settings          - Appearance, notifications, security
  /ai                - AI assistant chat interface
  /add-data          - Custom form with validation

/components
  /layout
    - mbg-sidebar.tsx
    - mbg-topbar.tsx
    - mbg-layout.tsx
  /ui
    - mbg-stat-card.tsx
    - mbg-chart-placeholder.tsx
    - mbg-profile-menu.tsx
    - mbg-logout-modal.tsx
    - mbg-toast.tsx
    - mbg-modal.tsx
    - mbg-form.tsx (Input, Select, Toggle, Submit)

/lib
  - mbg-theme.ts         - Color system and gradients
  - mbg-motion.ts        - Framer Motion variants
  - mbg-keyboard.ts      - Keyboard shortcuts hook

/hooks
  - use-mbg-sound.ts     - Sound playback utility
  - use-mbg-keyboard.ts  - Keyboard shortcut handler
\`\`\`

## Component Library

### Core Components

**MBGSidebar**
- Collapsible navigation with smooth animations
- Hover expansion and active state indicators
- Keyboard shortcut support (Ctrl+B)

**MBGTopbar**
- Global search with focus animation
- Quick-create button ("+")
- Notifications bell with pulse animation
- Theme toggle
- Profile avatar menu trigger

**MBGStatCard**
- Metric display with trend indicators
- Hover float animation
- Customizable icon and styling

**MBGChart Placeholder**
- Glassmorphic container for charts
- Ready for Recharts integration
- Responsive layout

### Universal Systems

**Toast System**
- Bottom-right slide-in notifications
- Success, warning, error, info variants
- Auto-dismiss with sound
- Soft fade animation

**Modal System**
- Spring pop animation
- Backdrop blur overlay
- Click-away and ESC key close
- Customizable header and footer

**Form System**
- MBGInput: Animated focus states
- MBGSelect: Styled dropdowns
- MBGToggle: Smooth animated switches
- MBGSubmitButton: Loading state feedback
- MBGFormField: Label with optional required indicator

### Profile Menu

- Dropdown menu with user info
- Profile, preferences, 2FA, billing, shortcuts options
- Logout button with confirmation modal
- Spring animation entrance

## Motion Library

All animations use `mbgMotion` variants:

- `panelReveal` - Fade in with Y translation
- `menuHoverBloom` - Spring scale animation
- `toastSlideIn` - Slide from right with fade
- `modalPopSpring` - Pop scale animation
- `buttonPressDepress` - Hover scale up, tap scale down
- `cardFloatHover` - Lift up on hover
- `sidebarHover` - Smooth opacity and translation
- `activeIndicatorPulse` - Continuous opacity pulse

## Sound Feedback

All interactions trigger optional sound events:

- **navOpen** - Sidebar navigation click
- **buttonPress** - Button interactions
- **toggleChange** - Toggle switches
- **modalOpen/Close** - Modal appearance/dismissal
- **formSubmit** - Form submission
- **success/error** - Confirmation feedback

Volume set to 15% for subtle notification without distraction.

## Keyboard Shortcuts

- `Ctrl+B` - Toggle sidebar collapse
- `Ctrl+K` - Open search
- `Ctrl+,` - Open settings
- `Esc` - Close dialogs and modals

## Pages Included

### Dashboard (`/dashboard`)
- 4-column stat cards with trends
- Revenue trend line chart placeholder
- Quick stats sidebar
- Revenue breakdown chart placeholder
- Recent activity feed

### Analytics (`/analytics`)
- Traffic sources line chart
- Conversion by product pie chart
- Key metrics display (bounce rate, session time, etc.)

### Users (`/users`)
- Searchable user table
- Role and status badges
- Export functionality
- Join date display

### Projects (`/projects`)
- Project cards grid
- Progress bars with animation
- Team member count
- Due date tracking
- Status indicators

### Billing (`/billing`)
- Current subscription display
- Three pricing tiers
- Feature comparison
- Upgrade buttons

### Settings (`/settings`)
- Theme selection (light/dark/system)
- Email and push notifications
- Sound effects toggle
- Password management
- 2FA setup
- Active sessions control

### AI Assistant (`/ai`)
- Chat interface with user/AI messages
- Real-time message animation
- Loading state with pulsing indicator
- Enter key send, Shift+Enter new line
- Sound feedback on send

### Add Data (`/add-data`)
- Custom form with step validation
- Floating label inputs
- Category and status selectors
- Multiline description field
- Price input with decimals
- Featured item toggle
- Sound feedback on submit

## Customization

### Colors
Edit `lib/mbg-theme.ts`:
\`\`\`typescript
export const MBG_COLORS = {
  light: { ... },
  dark: { ... }
}
\`\`\`

### Motion Timing
Edit `lib/mbg-motion.ts` to adjust spring physics and durations.

### Sound Volume
Adjust in `hooks/use-mbg-sound.ts`:
\`\`\`typescript
audio.volume = 0.15  // Change 0.15 to desired volume (0-1)
\`\`\`

### Navigation Items
Edit `components/layout/mbg-sidebar.tsx`:
\`\`\`typescript
const SIDEBAR_ITEMS = [ ... ]
\`\`\`

## Best Practices

1. **Always use MBG components** for consistency across the app
2. **Leverage motion variants** from `mbgMotion` library
3. **Include sound feedback** on all interactive elements
4. **Maintain glassmorphic design** with backdrop-blur and transparency
5. **Test keyboard shortcuts** for accessibility
6. **Use proper ARIA labels** on interactive elements
7. **Respect prefers-reduced-motion** for accessibility

## Performance Tips

- Motion is GPU-accelerated via transform and opacity
- Lazy load chart components to reduce initial bundle
- Use `useCallback` for event handlers in lists
- Implement virtualization for large tables
- Monitor animation frame rates

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Getting Started

1. Install dependencies: `npm install`
2. Update sidebar items in `/components/layout/mbg-sidebar.tsx`
3. Customize colors in `/lib/mbg-theme.ts`
4. Add your API endpoints to page components
5. Deploy to Vercel: `vercel deploy`

## Next Steps

- Integrate real data from your APIs
- Add authentication layer (Supabase, Auth0, etc.)
- Implement backend route handlers
- Add database integration for forms
- Set up analytics tracking
- Customize branding and colors

---

Built with v0, Vercel's AI-powered code generation. Ready for production use.
