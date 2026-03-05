# Layout Components Usage Guide

This document provides examples of how to use the layout components in the NFC Digital Profile frontend.

## Available Components

### 1. MainLayout
Used for general pages like landing page, about, contact, etc.

**Location:** `/Users/x2/Documents/projects/nfc-cards/frontend/src/components/layout/main-layout.tsx`

**Features:**
- Includes Navbar with authentication-aware navigation
- Footer with auto-updating copyright year
- Toast notifications (Sonner)
- Responsive container

**Example:**
```tsx
import { MainLayout } from '@/components/layout';

export default function AboutPage() {
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold">About Us</h1>
      <p>Your content here...</p>
    </MainLayout>
  );
}
```

### 2. DashboardLayout
Used for dashboard and authenticated user pages.

**Location:** `/Users/x2/Documents/projects/nfc-cards/frontend/src/components/layout/dashboard-layout.tsx`

**Features:**
- Sidebar navigation with 4 menu items:
  - Dashboard (`/dashboard`)
  - Edit Profile (`/dashboard/profile`)
  - Analytics (`/dashboard/analytics`)
  - Settings (`/dashboard/settings`)
- Mobile-responsive with hamburger menu
- Active route highlighting
- Includes Navbar and Footer
- Toast notifications

**Example:**
```tsx
import { DashboardLayout } from '@/components/layout';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Your dashboard content */}
      </div>
    </DashboardLayout>
  );
}
```

### 3. Navbar
Standalone navigation component with authentication support.

**Location:** `/Users/x2/Documents/projects/nfc-cards/frontend/src/components/layout/navbar.tsx`

**Features:**
- Logo/brand name "NFC Profile"
- Authenticated users see:
  - Navigation links (Dashboard, Profile, Analytics)
  - User avatar dropdown with Settings and Logout
- Unauthenticated users see:
  - Login button
  - Register button
- Uses `next-auth` `useSession` hook

**Standalone Usage:**
```tsx
import { Navbar } from '@/components/layout';

export default function CustomPage() {
  return (
    <>
      <Navbar />
      <main>{/* Your content */}</main>
    </>
  );
}
```

### 4. Footer
Simple footer component.

**Location:** `/Users/x2/Documents/projects/nfc-cards/frontend/src/components/layout/footer.tsx`

**Features:**
- Auto-updating copyright year
- Links to: About, Privacy Policy, Terms of Service, Contact
- Responsive design

**Standalone Usage:**
```tsx
import { Footer } from '@/components/layout';

export default function CustomPage() {
  return (
    <>
      <main>{/* Your content */}</main>
      <Footer />
    </>
  );
}
```

## Component Hierarchy

```
RootLayout (app/layout.tsx)
├── Providers (SessionProvider + QueryClientProvider)
├── Toaster (Global toast notifications)
└── Page Content
    ├── MainLayout (for public pages)
    │   ├── Navbar
    │   ├── Main Content Container
    │   ├── Footer
    │   └── Toaster
    │
    └── DashboardLayout (for dashboard pages)
        ├── Navbar
        ├── Sidebar Navigation (desktop/mobile)
        ├── Main Content Container
        ├── Footer
        └── Toaster
```

## Dependencies

All layout components use the following:
- **shadcn/ui components:** Button, DropdownMenu, Avatar, Toaster
- **next-auth:** For authentication state
- **Next.js:** Link component for navigation
- **Tailwind CSS:** For styling
- **Lucide React / Heroicons:** For icons (inline SVG)

## Authentication Integration

The Navbar component integrates with NextAuth.js:

```tsx
const { data: session, status } = useSession();
const isAuthenticated = status === 'authenticated';
```

Make sure NextAuth is properly configured in your app.

## Styling Notes

- All components use Tailwind CSS
- Responsive breakpoints: sm, md, lg
- Color scheme follows shadcn/ui design system
- Custom utilities available via `cn()` helper from `@/lib/utils`

## Mobile Responsiveness

- **Navbar:** Automatically hides navigation links on mobile, keeps user menu
- **DashboardLayout:** Sidebar transforms to mobile overlay with hamburger button
- **Footer:** Stacks vertically on mobile devices
- All layouts use responsive containers

## Toast Notifications

Toast notifications are available globally via the Toaster component from sonner:

```tsx
import { toast } from 'sonner';

// In your component
toast.success('Profile updated!');
toast.error('Something went wrong');
toast.info('Information message');
```

## Next Steps

1. Create authentication pages (login, register) at `/app/(auth)/login` and `/app/(auth)/register`
2. Create dashboard pages using `DashboardLayout`
3. Implement protected routes using NextAuth middleware
4. Customize the Navbar logo and branding
5. Add additional navigation items as needed
