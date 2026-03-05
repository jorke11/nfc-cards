/**
 * Layout Components for NFC Digital Profile
 *
 * Usage Examples:
 *
 * 1. For regular pages (landing, about, etc.):
 *    import { MainLayout } from '@/components/layout';
 *
 *    export default function Page() {
 *      return (
 *        <MainLayout>
 *          <h1>Your content here</h1>
 *        </MainLayout>
 *      );
 *    }
 *
 * 2. For dashboard pages:
 *    import { DashboardLayout } from '@/components/layout';
 *
 *    export default function DashboardPage() {
 *      return (
 *        <DashboardLayout>
 *          <h1>Dashboard content here</h1>
 *        </DashboardLayout>
 *      );
 *    }
 *
 * 3. For custom layouts using individual components:
 *    import { Navbar, Footer } from '@/components/layout';
 */

export { Navbar } from './navbar';
export { Footer } from './footer';
export { MainLayout } from './main-layout';
export { DashboardLayout } from './dashboard-layout';
