'use client';

import { useEffect } from 'react';
import { Profile } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ShareButton } from './share-button';
import {
  Mail,
  Phone,
  Globe,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Facebook,
  Youtube,
  UserPlus,
  LucideIcon,
} from 'lucide-react';
import { apiClient } from '@/lib/api';

interface ProfileDisplayProps {
  profile: Profile;
  shareUrl: string;
}

// Social platform icon mapping
const socialIcons: Record<string, LucideIcon> = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
};

// Get platform display name
const getPlatformName = (key: string): string => {
  const names: Record<string, string> = {
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    instagram: 'Instagram',
    facebook: 'Facebook',
    youtube: 'YouTube',
    tiktok: 'TikTok',
  };
  return names[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

function generateVCard(profile: Profile): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.firstName} ${profile.lastName}`,
    `N:${profile.lastName};${profile.firstName};;;`,
  ];
  if (profile.jobTitle) lines.push(`TITLE:${profile.jobTitle}`);
  if (profile.company) lines.push(`ORG:${profile.company}`);
  if (profile.emailPublic) lines.push(`EMAIL;TYPE=INTERNET:${profile.emailPublic}`);
  if (profile.phone) lines.push(`TEL;TYPE=CELL:${profile.phone}`);
  if (profile.phones?.length) {
    profile.phones.forEach(({ label, number }) => {
      lines.push(`TEL;TYPE=${label.toUpperCase()}:${number}`);
    });
  }
  if (profile.website) lines.push(`URL:${profile.website}`);
  if (profile.photoUrl) lines.push(`PHOTO;VALUE=URL:${profile.photoUrl}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}

function downloadVCard(profile: Profile) {
  const vcf = generateVCard(profile);
  const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${profile.firstName}_${profile.lastName}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ProfileDisplay({ profile, shareUrl }: ProfileDisplayProps) {
  const {
    firstName,
    lastName,
    photoUrl,
    jobTitle,
    company,
    bio,
    phone,
    phones,
    emailPublic,
    website,
    socialLinks,
    themeSettings,
  } = profile;

  // Track profile view on mount
  useEffect(() => {
    const trackView = async () => {
      try {
        await apiClient.analytics.trackView(profile.id, {
          referrer: document.referrer,
          userAgent: navigator.userAgent,
        });
      } catch (error) {
        console.error('Failed to track view:', error);
      }
    };

    trackView();
  }, [profile.id]);

  // Apply custom theme
  const themeStyles: React.CSSProperties = {
    backgroundColor: themeSettings.backgroundColor || '#ffffff',
    backgroundImage:
      themeSettings.backgroundType === 'gradient'
        ? `linear-gradient(135deg, ${themeSettings.backgroundColor || '#f3f4f6'}, ${themeSettings.primaryColor || '#3b82f6'})`
        : themeSettings.backgroundType === 'image' && themeSettings.backgroundImage
        ? `url(${themeSettings.backgroundImage})`
        : undefined,
    backgroundSize: themeSettings.backgroundType === 'image' ? 'cover' : undefined,
    backgroundPosition: themeSettings.backgroundType === 'image' ? 'center' : undefined,
  };

  const accentColor = themeSettings.primaryColor || '#3b82f6';

  // Get initials for avatar fallback
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  // Filter out empty social links
  const activeSocialLinks = Object.entries(socialLinks).filter(
    ([key, value]) => value && value.trim() !== ''
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={themeStyles}
    >
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95">
          <CardContent className="p-6 sm:p-8 lg:p-10">
            {/* Header Section */}
            <div className="flex flex-col items-center text-center mb-6">
              {/* Avatar */}
              <Avatar className="h-32 w-32 mb-4 ring-4 ring-white shadow-lg">
                <AvatarImage src={photoUrl} alt={`${firstName} ${lastName}`} />
                <AvatarFallback
                  className="text-3xl font-bold"
                  style={{ backgroundColor: accentColor, color: 'white' }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Name and Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {firstName} {lastName}
              </h1>

              {jobTitle && (
                <p className="text-lg text-gray-700 font-medium mb-1">{jobTitle}</p>
              )}

              {company && (
                <Badge
                  variant="secondary"
                  className="mb-4"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                    borderColor: accentColor,
                  }}
                >
                  {company}
                </Badge>
              )}

              {/* Bio */}
              {bio && (
                <p className="text-gray-600 text-base sm:text-lg mt-4 leading-relaxed max-w-xl">
                  {bio}
                </p>
              )}
            </div>

            <Separator className="my-6" />

            {/* Save Contact Button */}
            <div className="mb-6">
              <Button
                className="w-full"
                style={{ backgroundColor: accentColor, color: 'white' }}
                onClick={() => downloadVCard(profile)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Save Contact
              </Button>
            </div>

            {/* Contact Information */}
            {(emailPublic || phone || phones?.length || website) && (
              <div className="space-y-3 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>

                {emailPublic && (
                  <a
                    href={`mailto:${emailPublic}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${accentColor}20` }}
                    >
                      <Mail className="h-5 w-5" style={{ color: accentColor }} />
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900">
                      {emailPublic}
                    </span>
                  </a>
                )}

                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${accentColor}20` }}
                    >
                      <Phone className="h-5 w-5" style={{ color: accentColor }} />
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900">{phone}</span>
                  </a>
                )}

                {phones?.map(({ label, number }, i) => (
                  <a
                    key={i}
                    href={`tel:${number}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${accentColor}20` }}
                    >
                      <Phone className="h-5 w-5" style={{ color: accentColor }} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">{label}</span>
                      <span className="text-gray-700 group-hover:text-gray-900">{number}</span>
                    </div>
                  </a>
                ))}

                {website && (
                  <a
                    href={website.startsWith('http') ? website : `https://${website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${accentColor}20` }}
                    >
                      <Globe className="h-5 w-5" style={{ color: accentColor }} />
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 truncate">
                      {website}
                    </span>
                  </a>
                )}
              </div>
            )}

            {/* Social Links */}
            {activeSocialLinks.length > 0 && (
              <>
                {(emailPublic || phone || website) && <Separator className="my-6" />}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Connect</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeSocialLinks.map(([platform, url]) => {
                      const Icon = socialIcons[platform];
                      const displayName = getPlatformName(platform);

                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
                        >
                          {Icon && (
                            <div
                              className="p-2 rounded-full"
                              style={{ backgroundColor: `${accentColor}20` }}
                            >
                              <Icon className="h-5 w-5" style={{ color: accentColor }} />
                            </div>
                          )}
                          <span className="text-gray-700 font-medium group-hover:text-gray-900">
                            {displayName}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Share Button */}
            <div className="mt-8 flex justify-center">
              <ShareButton
                url={shareUrl}
                title={`${firstName} ${lastName}${jobTitle ? ` - ${jobTitle}` : ''}`}
                description={bio}
              />
            </div>
          </CardContent>
        </Card>

        {/* Powered By Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Powered by{' '}
            <a
              href="/"
              className="font-semibold hover:underline"
              style={{ color: accentColor }}
            >
              NFC Digital Profiles
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
