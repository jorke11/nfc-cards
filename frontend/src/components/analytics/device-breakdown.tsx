'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import type { TooltipProps } from 'recharts';

// Type assertions to fix React 18 compatibility
const ResponsiveContainerFixed = ResponsiveContainer as any;
const PieChartFixed = PieChart as any;
const PieFixed = Pie as any;
const CellFixed = Cell as any;
const TooltipFixed = Tooltip as any;
const LegendFixed = Legend as any;
import { Smartphone, Monitor, Tablet } from 'lucide-react';

interface DeviceBreakdownProps {
  data: { device: string; count: number }[];
  isLoading?: boolean;
}

const COLORS = {
  mobile: '#3b82f6', // blue
  desktop: '#10b981', // green
  tablet: '#8b5cf6', // purple
  other: '#6b7280', // gray
};

const DEVICE_ICONS = {
  mobile: Smartphone,
  desktop: Monitor,
  tablet: Tablet,
};

export function DeviceBreakdown({ data, isLoading = false }: DeviceBreakdownProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Device Breakdown</CardTitle>
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
          <CardTitle>Device Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No device data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate total and percentages
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const chartData = data.map((item) => ({
    name: item.device.charAt(0).toUpperCase() + item.device.slice(1),
    value: item.count,
    percentage: ((item.count / total) * 100).toFixed(1),
    color: COLORS[item.device.toLowerCase() as keyof typeof COLORS] || COLORS.other,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          <ResponsiveContainerFixed width="100%" height="100%">
            <PieChartFixed>
            <PieFixed
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ percentage }: any) => `${percentage}%`}
            >
              {chartData.map((entry, index) => (
                <CellFixed key={`cell-${index}`} fill={entry.color} />
              ))}
            </PieFixed>
            <TooltipFixed
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} views (${props.payload.percentage}%)`,
                name,
              ]}
            />
            <LegendFixed
              verticalAlign="bottom"
              height={36}
              content={({ payload }: any) => (
                <div className="flex justify-center gap-4 mt-4">
                  {payload?.map((entry: any, index: number) => {
                    const deviceKey = entry.value?.toLowerCase() as keyof typeof DEVICE_ICONS;
                    const Icon = DEVICE_ICONS[deviceKey];
                    return (
                      <div key={index} className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4" style={{ color: entry.color }} />}
                        <span className="text-sm text-muted-foreground">
                          {entry.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            />
            </PieChartFixed>
          </ResponsiveContainerFixed>
        </div>
      </CardContent>
    </Card>
  );
}
