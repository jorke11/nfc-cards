'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Type assertions to fix React 18 compatibility
const ResponsiveContainerFixed = ResponsiveContainer as any;
const LineChartFixed = LineChart as any;
const LineFixed = Line as any;
const XAxisFixed = XAxis as any;
const YAxisFixed = YAxis as any;
const CartesianGridFixed = CartesianGrid as any;
const TooltipFixed = Tooltip as any;

interface ViewsChartProps {
  data: { date: string; count: number }[];
  isLoading?: boolean;
}

export function ViewsChart({ data, isLoading = false }: ViewsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Views Over Time</CardTitle>
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
          <CardTitle>Views Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No view data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for the chart
  const chartData = data.map((item) => ({
    date: formatDate(item.date),
    views: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Views Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          <ResponsiveContainerFixed width="100%" height="100%">
          <LineChartFixed data={chartData}>
            <CartesianGridFixed strokeDasharray="3 3" className="stroke-muted" />
            <XAxisFixed
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxisFixed
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
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
            <LineFixed
              type="monotone"
              dataKey="views"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChartFixed>
          </ResponsiveContainerFixed>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}
