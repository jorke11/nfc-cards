import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProfileDisplay } from '@/components/profile/profile-display';
import { Profile } from '@/types';

// Server-side fetch function — tries username first, then falls back to uniqueId
async function getProfileById(id: string): Promise<Profile | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  try {
    // Try username endpoint first
    const usernameRes = await fetch(`${API_URL}/profiles/username/${id}`, {
      cache: 'no-store',
    });

    if (usernameRes.ok) {
      const data = await usernameRes.json();
      return data.data || data;
    }

    // Fall back to uniqueId endpoint
    const idRes = await fetch(`${API_URL}/profiles/${id}`, {
      cache: 'no-store',
    });

    if (!idRes.ok) {
      return null;
    }

    const data = await idRes.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const profile = await getProfileById(params.id);

  if (!profile) {
    return {
      title: 'Profile Not Found - NFC Digital Profiles',
      description: 'The requested profile could not be found.',
    };
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const title = profile.jobTitle
    ? `${fullName} - ${profile.jobTitle}`
    : fullName;
  const description =
    profile.bio ||
    `Connect with ${fullName}${profile.company ? ` at ${profile.company}` : ''}. View contact information, social links, and more.`;

  return {
    title: `${title} | NFC Digital Profiles`,
    description,
    openGraph: {
      title,
      description,
      images: profile.photoUrl ? [profile.photoUrl] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: profile.photoUrl ? [profile.photoUrl] : [],
    },
  };
}

// Main page component
export default async function ProfileIdPage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await getProfileById(params.id);

  // Return 404 if profile not found or disabled
  if (!profile || !profile.isEnabled) {
    notFound();
  }

  // Construct the share URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/p/${profile.uniqueId}`;

  return <ProfileDisplay profile={profile} shareUrl={shareUrl} />;
}
