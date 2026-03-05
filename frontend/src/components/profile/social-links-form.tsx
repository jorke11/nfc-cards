"use client";

import { Twitter, Linkedin, Github, Facebook, Instagram, Link as LinkIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface SocialLinksFormProps {
  form: UseFormReturn<any>;
}

const socialPlatforms = [
  {
    name: 'twitter',
    label: 'Twitter/X',
    icon: Twitter,
    placeholder: 'https://twitter.com/username',
  },
  {
    name: 'linkedin',
    label: 'LinkedIn',
    icon: Linkedin,
    placeholder: 'https://linkedin.com/in/username',
  },
  {
    name: 'github',
    label: 'GitHub',
    icon: Github,
    placeholder: 'https://github.com/username',
  },
  {
    name: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    placeholder: 'https://facebook.com/username',
  },
  {
    name: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    placeholder: 'https://instagram.com/username',
  },
] as const;

export function SocialLinksForm({ form }: SocialLinksFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <LinkIcon className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-medium">Social Links</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Add your social media profiles (all optional)
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <FormField
              key={platform.name}
              control={form.control}
              name={`socialLinks.${platform.name}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {platform.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={platform.placeholder}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
