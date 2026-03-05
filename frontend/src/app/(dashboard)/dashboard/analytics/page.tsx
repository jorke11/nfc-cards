'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AnalyticsStats,
  ViewsChart,
  DeviceBreakdown,
  LocationsChart,
  RecentViewsTable,
} from '@/components/analytics';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/api';
import { AnalyticsSummary } from '@/types';
import { Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type DateRange = '7' | '30' | '90' | 'all';

const DATE_RANGE_OPTIONS = [
  { value: '7' as DateRange, label: 'Last 7 days' },
  { value: '30' as DateRange, label: 'Last 30 days' },
  { value: '90' as DateRange, label: 'Last 90 days' },
  { value: 'all' as DateRange, label: 'All time' },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30');

  // Fetch analytics data
  const {
    data: analytics,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<AnalyticsSummary>({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      const params = getDateRangeParams(dateRange);
      const response = await apiClient.analytics.getProfileAnalytics(params);
      return response.data;
    },
    retry: 1,
  });

  const handleExportData = () => {
    if (!analytics) {
      toast.error('No data to export');
      return;
    }

    try {
      // Create CSV content
      const csvData = generateCSV(analytics);

      // Create blob and download
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `analytics-${dateRange}-days-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Analytics data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  // Calculate average views per day
  const calculateAverageViewsPerDay = (): number => {
    if (!analytics || !analytics.viewsByDate || analytics.viewsByDate.length === 0) {
      return 0;
    }

    const days = dateRange === 'all'
      ? analytics.viewsByDate.length
      : parseInt(dateRange);

    return analytics.totalViews / Math.max(days, 1);
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Track your profile performance and visitor insights
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Date Range Selector */}
            <Select value={dateRange} onValueChange={(value: DateRange) => setDateRange(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Export Button */}
            <Button
              onClick={handleExportData}
              variant="outline"
              disabled={isLoading || !analytics}
              className="w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive">
                    Failed to load analytics
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {error instanceof Error ? error.message : 'An error occurred'}
                  </p>
                </div>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <AnalyticsStats
          totalViews={analytics?.totalViews || 0}
          uniqueVisitors={analytics?.uniqueVisitors || 0}
          averageViewsPerDay={calculateAverageViewsPerDay()}
          isLoading={isLoading}
        />

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <ViewsChart
            data={analytics?.viewsByDate || []}
            isLoading={isLoading}
          />
          <DeviceBreakdown
            data={analytics?.viewsByDevice || []}
            isLoading={isLoading}
          />
        </div>

        {/* Locations Chart */}
        <LocationsChart
          data={analytics?.viewsByCountry || []}
          isLoading={isLoading}
        />

        {/* Recent Views Table */}
        <RecentViewsTable
          views={analytics?.recentViews || []}
          isLoading={isLoading}
        />
      </div>
  );
}

// Helper function to get date range parameters
function getDateRangeParams(range: DateRange): { start: string; end: string } | undefined {
  if (range === 'all') {
    return undefined;
  }

  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - parseInt(range));

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

// Helper function to generate CSV
function generateCSV(analytics: AnalyticsSummary): string {
  const lines: string[] = [];

  // Summary section
  lines.push('ANALYTICS SUMMARY');
  lines.push('');
  lines.push('Metric,Value');
  lines.push(`Total Views,${analytics.totalViews}`);
  lines.push(`Unique Visitors,${analytics.uniqueVisitors}`);
  lines.push('');

  // Views by Date
  lines.push('VIEWS BY DATE');
  lines.push('Date,Views');
  analytics.viewsByDate.forEach((item) => {
    lines.push(`${item.date},${item.count}`);
  });
  lines.push('');

  // Views by Device
  lines.push('VIEWS BY DEVICE');
  lines.push('Device,Count');
  analytics.viewsByDevice.forEach((item) => {
    lines.push(`${item.device},${item.count}`);
  });
  lines.push('');

  // Views by Country
  lines.push('VIEWS BY COUNTRY');
  lines.push('Country,Count');
  analytics.viewsByCountry.forEach((item) => {
    lines.push(`${item.country || 'Unknown'},${item.count}`);
  });
  lines.push('');

  // Recent Views
  lines.push('RECENT VIEWS');
  lines.push('Date,Time,Device,Country,Referrer');
  analytics.recentViews.forEach((view) => {
    const date = new Date(view.viewedAt);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString();
    const referrer = view.referrer || 'Direct';
    lines.push(`${dateStr},${timeStr},${view.deviceType},${view.country || 'Unknown'},"${referrer}"`);
  });

  return lines.join('\n');
}
