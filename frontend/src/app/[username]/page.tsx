import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProfileDisplay } from '@/components/profile/profile-display';
import { Profile } from '@/types';

// Server-side fetch function
async function getProfileByUsername(username: string): Promise<Profile | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  try {
    const response = await fetch(`${API_URL}/profiles/username/${username}`, {
      cache: 'no-store', // Always fetch fresh data for profiles
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
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
  params: { username: string };
}): Promise<Metadata> {
  const profile = await getProfileByUsername(params.username);

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
export default async function UsernamePage({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getProfileByUsername(params.username);

  // Return 404 if profile not found or disabled
  if (!profile || !profile.isEnabled) {
    notFound();
  }

  // Construct the share URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/${profile.username || profile.uniqueId}`;

  return <ProfileDisplay profile={profile} shareUrl={shareUrl} />;
}
