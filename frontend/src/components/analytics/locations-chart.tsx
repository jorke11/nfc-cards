'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Type assertions to fix React 18 compatibility
const ResponsiveContainerFixed = ResponsiveContainer as any;
const BarChartFixed = BarChart as any;
const BarFixed = Bar as any;
const XAxisFixed = XAxis as any;
const YAxisFixed = YAxis as any;
const CartesianGridFixed = CartesianGrid as any;
const TooltipFixed = Tooltip as any;

interface LocationsChartProps {
  data: { country: string; count: number }[];
  isLoading?: boolean;
}

export function LocationsChart({ data, isLoading = false }: LocationsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No location data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get top 10 countries
  const topCountries = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((item) => ({
      country: item.country || 'Unknown',
      views: item.count,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          <ResponsiveContainerFixed width="100%" height="100%">
          <BarChartFixed data={topCountries} layout="horizontal">
            <CartesianGridFixed strokeDasharray="3 3" className="stroke-muted" />
            <XAxisFixed
              type="number"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxisFixed
              type="category"
              dataKey="country"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              width={100}
            />
            <TooltipFixed
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [value, 'Views']}
            />
            <BarFixed
              dataKey="views"
              fill="hsl(var(--primary))"
              radius={[0, 4, 4, 0]}
            />
          </BarChartFixed>
          </ResponsiveContainerFixed>
        </div>
      </CardContent>
    </Card>
  );
}
