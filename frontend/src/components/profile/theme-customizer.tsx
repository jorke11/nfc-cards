"use client";

import { Palette, RotateCcw } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ThemeCustomizerProps {
  form: UseFormReturn<any>;
}

const DEFAULT_COLORS = {
  primaryColor: '#3b82f6',
  backgroundColor: '#ffffff',
};

export function ThemeCustomizer({ form }: ThemeCustomizerProps) {
  const primaryColor = form.watch('themeSettings.primaryColor') || DEFAULT_COLORS.primaryColor;
  const backgroundColor = form.watch('themeSettings.backgroundColor') || DEFAULT_COLORS.backgroundColor;

  const resetToDefaults = () => {
    form.setValue('themeSettings.primaryColor', DEFAULT_COLORS.primaryColor);
    form.setValue('themeSettings.backgroundColor', DEFAULT_COLORS.backgroundColor);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium">Theme Customization</h3>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetToDefaults}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
      </div>

      <p className="text-sm text-gray-500">
        Customize the colors of your public profile
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="themeSettings.primaryColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Color</FormLabel>
              <FormDescription className="text-xs">
                Used for buttons and accents
              </FormDescription>
              <FormControl>
                <div className="flex gap-3 items-center">
                  <Input
                    type="color"
                    {...field}
                    value={field.value || DEFAULT_COLORS.primaryColor}
                    className="h-12 w-20 cursor-pointer"
                  />
                  <Input
                    type="text"
                    {...field}
                    value={field.value || DEFAULT_COLORS.primaryColor}
                    placeholder="#3b82f6"
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="themeSettings.backgroundColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background Color</FormLabel>
              <FormDescription className="text-xs">
                Main background color
              </FormDescription>
              <FormControl>
                <div className="flex gap-3 items-center">
                  <Input
                    type="color"
                    {...field}
                    value={field.value || DEFAULT_COLORS.backgroundColor}
                    className="h-12 w-20 cursor-pointer"
                  />
                  <Input
                    type="text"
                    {...field}
                    value={field.value || DEFAULT_COLORS.backgroundColor}
                    placeholder="#ffffff"
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Live Preview */}
      <Card className="p-6 mt-4">
        <h4 className="text-sm font-medium mb-3">Preview</h4>
        <div
          className="rounded-lg p-6 transition-colors"
          style={{ backgroundColor }}
        >
          <div className="space-y-3">
            <div className="h-8 w-32 rounded" style={{ backgroundColor: primaryColor }} />
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-64 bg-gray-200 rounded" />
            <button
              className="px-4 py-2 rounded-md text-white text-sm font-medium"
              style={{ backgroundColor: primaryColor }}
            >
              Sample Button
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
