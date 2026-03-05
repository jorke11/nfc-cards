# Public Profile Pages Documentation

This document describes the public profile display pages created for the NFC Digital Profile application.

## Overview

The application now has two public profile display routes:
1. **Username Route**: `/{username}` - Display profiles by custom username
2. **Unique ID Route**: `/p/{id}` - Display profiles by unique ID (used for NFC card redirects)

## Files Created

### 1. Profile Display Component
**Path**: `/src/components/profile/profile-display.tsx`

A reusable client component that displays profile information in a beautiful, card-based layout.

**Features**:
- Profile photo with avatar fallback showing initials
- Full name, job title, and company badge
- Bio section
- Contact information (email, phone, website) with clickable links
- Social media links with platform icons
- Custom theme support (background colors, gradients, images, primary accent color)
- Automatic view tracking via analytics API
- Share button integration
- Fully responsive design
- Professional card-based layout with hover effects

**Theme Support**:
- Solid background color
- Gradient backgrounds
- Background images
- Custom primary/accent color for icons and badges
- Applied via inline styles for dynamic theming

### 2. Share Button Component
**Path**: `/src/components/profile/share-button.tsx`

A client component that provides sharing functionality.

**Features**:
- Native Web Share API support (mobile devices)
- Fallback to clipboard copy with toast notification
- Visual feedback with checkmark on successful copy
- Styled with shadcn/ui Button component

### 3. Username Profile Page
**Path**: `/src/app/[username]/page.tsx`

Dynamic route for accessing profiles via custom username (e.g., `/johndoe`).

**Features**:
- Server-side data fetching for SEO optimization
- Dynamic metadata generation (title, description, OpenGraph, Twitter cards)
- Automatic 404 redirect for non-existent or disabled profiles
- Returns profile using username lookup API endpoint

**API Endpoint Used**: `GET /api/profiles/username/{username}`

### 4. Unique ID Profile Page
**Path**: `/src/app/p/[id]/page.tsx`

Dynamic route for accessing profiles via unique ID (e.g., `/p/abc123xyz`).

**Features**:
- Server-side data fetching for SEO optimization
- Dynamic metadata generation (title, description, OpenGraph, Twitter cards)
- Automatic 404 redirect for non-existent or disabled profiles
- Primary route for NFC card redirects
- Returns profile using unique ID lookup API endpoint

**API Endpoint Used**: `GET /api/profiles/{id}`

### 5. Loading States
**Paths**:
- `/src/app/[username]/loading.tsx`
- `/src/app/p/[id]/loading.tsx`

Skeleton loading screens displayed while profile data is being fetched.

**Features**:
- Professional skeleton UI with shadcn/ui Skeleton component
- Matches the layout structure of the actual profile display
- Provides smooth loading experience

### 6. Not Found Pages
**Paths**:
- `/src/app/[username]/not-found.tsx`
- `/src/app/p/[id]/not-found.tsx`

Custom 404 pages for profiles that don't exist or are disabled.

**Features**:
- User-friendly error message
- Call-to-action to return home
- Link to sign up page for new users
- Professional design with icons

### 7. Component Index
**Path**: `/src/components/profile/index.ts`

Exports all profile-related components for easy imports.

## How It Works

### Profile Display Flow

1. **User Access**:
   - User visits `/{username}` or `/p/{id}`
   - Next.js shows loading skeleton immediately

2. **Server-Side Rendering**:
   - Page component fetches profile data from backend API
   - Generates SEO metadata (title, description, social media tags)
   - If profile not found or disabled → shows 404 page
   - If profile found → renders ProfileDisplay component

3. **Client-Side Features**:
   - ProfileDisplay mounts and tracks analytics view
   - Custom theme is applied via CSS-in-JS
   - User can interact with contact links and social links
   - Share button allows native sharing or clipboard copy

### Analytics Tracking

When a profile is viewed, the component automatically:
- Calls `POST /api/analytics/track/{profileId}` with metadata
- Sends referrer and user agent information
- Does not block rendering if tracking fails
- Happens on component mount (client-side)

### Theme Customization

Profiles support the following theme settings:
- **Background Type**: solid | gradient | image
- **Background Color**: Hex color code
- **Background Image**: URL to background image
- **Primary Color**: Hex color for accents, icons, and badges

The theme is applied dynamically using inline styles on the container element.

### SEO Optimization

Both profile pages implement:
- **generateMetadata()**: Dynamic page titles and descriptions
- **OpenGraph tags**: Social media preview cards
- **Twitter card tags**: Twitter-specific preview optimization
- **Server-side rendering**: Full HTML sent on first request
- **Profile photos**: Used as OpenGraph images when available

## API Integration

### Profile Retrieval

```typescript
// Username lookup
GET /api/profiles/username/:username
Response: { data: Profile }

// Unique ID lookup
GET /api/profiles/:id
Response: { data: Profile }
```

### Analytics Tracking

```typescript
// Track profile view
POST /api/analytics/track/:profileId
Body: { referrer?: string, userAgent?: string, ... }
```

## Social Platform Support

The profile display supports the following social platforms with icons:
- Twitter
- LinkedIn
- GitHub
- Instagram
- Facebook
- YouTube
- TikTok (icon not available in lucide-react, shows text only)

Links are automatically prefixed with platform URLs if needed.

## Responsive Design

The profile pages are fully responsive:
- **Mobile**: Single column layout, stacked elements
- **Tablet**: Optimized spacing, 2-column social links
- **Desktop**: Maximum width container (max-w-2xl), centered layout

## Environment Variables

The following environment variables are used:

- `NEXT_PUBLIC_API_URL`: Backend API base URL (default: `http://localhost:4000/api`)
- `NEXT_PUBLIC_APP_URL`: Frontend app URL for share links (default: `http://localhost:3000`)

## Component Dependencies

### shadcn/ui Components Used
- Card, CardContent
- Button
- Badge
- Avatar, AvatarFallback, AvatarImage
- Separator
- Skeleton

### Icons Used (lucide-react)
- Mail, Phone, Globe, MapPin (contact)
- Twitter, LinkedIn, GitHub, Instagram, Facebook, YouTube (social)
- Share2, Check, Copy (share button)
- UserX (404 page)

### Other Dependencies
- next/navigation (notFound, useRouter)
- sonner (toast notifications)
- Custom API client (@/lib/api)

## Future Enhancements

Potential improvements for the profile pages:
1. QR code display on profile for easy sharing
2. vCard download button for adding to contacts
3. Profile visit statistics shown to profile owners
4. Dark mode support based on user preference
5. Profile themes with predefined color schemes
6. Custom fonts from theme settings
7. Link click tracking
8. Profile badges (verified, premium, etc.)
9. Multiple photos/gallery section
10. Testimonials or reviews section

## Testing

To test the profile pages:

1. **Create a profile** via the dashboard
2. **Set a custom username** (optional)
3. **Visit** `/{username}` or `/p/{uniqueId}`
4. **Verify**:
   - Profile displays correctly
   - Theme is applied
   - Contact links work
   - Social links work
   - Share button works
   - Analytics tracking fires
   - SEO meta tags are present (view page source)
   - 404 page shows for non-existent profiles
   - Loading state appears briefly

## Browser Compatibility

- **Web Share API**: Modern mobile browsers (fallback to copy)
- **Clipboard API**: All modern browsers
- **CSS Grid/Flexbox**: All modern browsers
- **Fetch API**: All modern browsers

## Build Verification

The profile pages successfully compile with Next.js:
```bash
npm run build
# ✓ Compiled successfully
# Both [username] and p/[id] routes built
```

## Performance

- **Server-side rendering**: Fast initial page load
- **Static generation**: Can be cached at CDN edge
- **Code splitting**: Profile components only load when needed
- **Image optimization**: Next.js automatic image optimization for avatars
- **Analytics**: Non-blocking, fire-and-forget tracking

## Security

- **Public access**: No authentication required (intentional)
- **Disabled profiles**: Hidden with 404 response
- **XSS protection**: React automatic escaping
- **CORS**: Handled by backend API
- **Rate limiting**: Should be implemented on analytics endpoint

---

**Created**: 2026-02-22
**Status**: Complete and tested
**Build Status**: ✅ Passing
