"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Check, X, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/use-debounce';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/profile/image-upload';
import { SocialLinksForm } from '@/components/profile/social-links-form';
import { ThemeCustomizer } from '@/components/profile/theme-customizer';

// Zod schema matching backend DTOs
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Username can only contain lowercase letters, numbers, and hyphens')
    .optional(),
  jobTitle: z.string().max(150).optional(),
  company: z.string().max(150).optional(),
  bio: z.string().optional(),
  phone: z.string().max(50).optional(),
  phones: z.array(z.object({ label: z.string(), number: z.string() })).optional(),
  emailPublic: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  photoUrl: z.string().optional(),
  socialLinks: z
    .object({
      twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
      linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
      github: z.string().url('Invalid URL').optional().or(z.literal('')),
      facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
      instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
    })
    .optional(),
  themeSettings: z
    .object({
      primaryColor: z.string().optional(),
      backgroundColor: z.string().optional(),
    })
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileEditorPage() {
  const queryClient = useQueryClient();
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [initialUsername, setInitialUsername] = useState<string>('');

  // Fetch existing profile data
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.profiles.getMyProfile();
      return response.data;
    },
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      jobTitle: '',
      company: '',
      bio: '',
      phone: '',
      phones: [],
      emailPublic: '',
      website: '',
      photoUrl: '',
      socialLinks: {
        twitter: '',
        linkedin: '',
        github: '',
        facebook: '',
        instagram: '',
      },
      themeSettings: {
        primaryColor: '#3b82f6',
        backgroundColor: '#ffffff',
      },
    },
  });

  // Set form data when profile loads — skip if user has unsaved changes
  useEffect(() => {
    if (profileData && !form.formState.isDirty) {
      const profile = profileData;
      form.reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        username: profile.username || '',
        jobTitle: profile.jobTitle || '',
        company: profile.company || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        phones: profile.phones || [],
        emailPublic: profile.emailPublic || '',
        website: profile.website || '',
        photoUrl: profile.photoUrl || '',
        socialLinks: profile.socialLinks || {
          twitter: '',
          linkedin: '',
          github: '',
          facebook: '',
          instagram: '',
        },
        themeSettings: profile.themeSettings || {
          primaryColor: '#3b82f6',
          backgroundColor: '#ffffff',
        },
      });
      setInitialUsername(profile.username || '');
    }
  }, [profileData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Username availability check with debouncing
  const username = form.watch('username');
  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    const checkUsername = async () => {
      if (!debouncedUsername || debouncedUsername.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      // Don't check if it's the same as the initial username
      if (debouncedUsername === initialUsername) {
        setUsernameAvailable(true);
        return;
      }

      // Validate format before checking availability
      if (!/^[a-z0-9-]+$/.test(debouncedUsername)) {
        setUsernameAvailable(null);
        return;
      }

      setIsCheckingUsername(true);
      try {
        const response = await apiClient.profiles.checkUsernameAvailability(debouncedUsername);
        setUsernameAvailable(response.data.available);
      } catch (error) {
        console.error('Username check error:', error);
        setUsernameAvailable(null);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkUsername();
  }, [debouncedUsername, initialUsername]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      // Remove empty strings and convert to undefined for optional fields
      const cleanData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
          if (value === '') return [key, undefined];
          if (Array.isArray(value)) return [key, value]; // pass arrays through as-is
          if (typeof value === 'object' && value !== null) {
            const cleanedObj = Object.fromEntries(
              Object.entries(value).filter(([, v]) => v !== '')
            );
            return [key, Object.keys(cleanedObj).length > 0 ? cleanedObj : undefined];
          }
          return [key, value];
        })
      );

      const response = await apiClient.profiles.updateProfile(cleanData);
      return response.data;
    },
    onSuccess: (savedProfile) => {
      toast.success('Profile updated successfully');
      // Reset form with saved data so isDirty becomes false
      form.reset({
        firstName: savedProfile.firstName || '',
        lastName: savedProfile.lastName || '',
        username: savedProfile.username || '',
        jobTitle: savedProfile.jobTitle || '',
        company: savedProfile.company || '',
        bio: savedProfile.bio || '',
        phone: savedProfile.phone || '',
        phones: savedProfile.phones || [],
        emailPublic: savedProfile.emailPublic || '',
        website: savedProfile.website || '',
        photoUrl: savedProfile.photoUrl || '',
        socialLinks: savedProfile.socialLinks || { twitter: '', linkedin: '', github: '', facebook: '', instagram: '' },
        themeSettings: savedProfile.themeSettings || { primaryColor: '#3b82f6', backgroundColor: '#ffffff' },
      });
      setInitialUsername(savedProfile.username || '');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    // Check username availability before submitting
    if (data.username && data.username !== initialUsername && usernameAvailable === false) {
      toast.error('Username is not available');
      return;
    }

    updateProfileMutation.mutate(data);
  };

  const isFormChanged = form.formState.isDirty;
  const isFormValid = form.formState.isValid;

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <p className="text-gray-500 mt-2">
          Manage your digital profile information and customize your public page
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>
                Upload a professional photo for your digital profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="photoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={async (url) => {
                          field.onChange(url);
                          try {
                            await apiClient.profiles.updateProfile({ photoUrl: url });
                            queryClient.invalidateQueries({ queryKey: ['profile'] });
                          } catch {
                            toast.error('Failed to save photo');
                          }
                        }}
                        onDelete={async () => {
                          field.onChange('');
                          try {
                            await apiClient.profiles.updateProfile({ photoUrl: null });
                            queryClient.invalidateQueries({ queryKey: ['profile'] });
                          } catch {
                            toast.error('Failed to remove photo');
                          }
                        }}
                        fallback={`${form.watch('firstName')?.[0] || 'U'}${form.watch('lastName')?.[0] || ''}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Your basic profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormDescription className="text-xs">
                      Your unique profile URL (lowercase letters, numbers, and hyphens only)
                    </FormDescription>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="johndoe"
                          {...field}
                          value={field.value || ''}
                          className="pr-10"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {isCheckingUsername && (
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          )}
                          {!isCheckingUsername && usernameAvailable === true && field.value && (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                          {!isCheckingUsername && usernameAvailable === false && field.value && (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    {!isCheckingUsername && usernameAvailable === false && field.value && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Username is already taken
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Software Engineer" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself..."
                        className="min-h-24 resize-none"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How people can reach you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Additional phones */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Additional Phones</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const current = form.getValues('phones') || [];
                      form.setValue('phones', [...current, { label: 'Mobile', number: '' }], { shouldDirty: true });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Phone
                  </Button>
                </div>
                {(form.watch('phones') || []).map((_, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Input
                      placeholder="Label (Mobile, Work…)"
                      value={form.watch(`phones.${index}.label`) || ''}
                      onChange={(e) => {
                        const phones = [...(form.getValues('phones') || [])];
                        phones[index] = { ...phones[index], label: e.target.value };
                        form.setValue('phones', phones, { shouldDirty: true });
                      }}
                      className="w-32 shrink-0"
                    />
                    <Input
                      placeholder="+1 (555) 000-0000"
                      value={form.watch(`phones.${index}.number`) || ''}
                      onChange={(e) => {
                        const phones = [...(form.getValues('phones') || [])];
                        phones[index] = { ...phones[index], number: e.target.value };
                        form.setValue('phones', phones, { shouldDirty: true });
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const phones = (form.getValues('phones') || []).filter((_, i) => i !== index);
                        form.setValue('phones', phones, { shouldDirty: true });
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>

              <FormField
                control={form.control}
                name="emailPublic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Public Email</FormLabel>
                    <FormDescription className="text-xs">
                      Email address to display on your public profile
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://johndoe.com"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Connect your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SocialLinksForm form={form} />
            </CardContent>
          </Card>

          {/* Theme Customization */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the appearance of your public profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeCustomizer form={form} />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={!isFormChanged || updateProfileMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormChanged || !isFormValid || updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
