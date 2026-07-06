"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CountItem } from "@/lib/analytics";

const PRIMARY = "hsl(152 76% 44%)";
const PALETTE = [
  "hsl(152 76% 44%)",
  "hsl(190 80% 50%)",
  "hsl(220 80% 60%)",
  "hsl(265 70% 62%)",
  "hsl(320 70% 60%)",
  "hsl(35 90% 55%)",
  "hsl(0 72% 58%)",
  "hsl(160 60% 55%)",
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-lg">
      <p className="font-medium">{label ?? payload[0].name}</p>
      <p className="text-primary">{payload[0].value} responses</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-muted-foreground">
      No data yet
    </div>
  );
}

/** Vertical bars — good for ordered categories (pricing, interest). */
export function VerticalBarCard({ title, data }: { title: string; data: CountItem[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="h-[280px]">
        {data.length === 0 ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -18 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(240 5% 65%)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-12}
                textAnchor="end"
                height={54}
              />
              <YAxis tick={{ fill: "hsl(240 5% 65%)", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: "hsl(240 5% 15% / 0.5)" }} content={<ChartTooltip />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

/** Horizontal bars — good for long labels (pain points, features, cities). */
export function HorizontalBarCard({
  title,
  data,
  max = 8,
}: {
  title: string;
  data: CountItem[];
  max?: number;
}) {
  const rows = data.slice(0, max);
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent style={{ height: Math.max(220, rows.length * 42 + 24) }}>
        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 8 }}>
              <XAxis type="number" hide allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={160}
                tick={{ fill: "hsl(240 5% 78%)", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip cursor={{ fill: "hsl(240 5% 15% / 0.5)" }} content={<ChartTooltip />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} fill={PRIMARY} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

/** Donut — good for share-of-total (gym size, software). */
export function DonutCard({ title, data }: { title: string; data: CountItem[] }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="h-[280px]">
        {total === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex h-full items-center gap-4">
            <ResponsiveContainer width="55%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={2} stroke="none">
                  {data.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="flex-1 space-y-2 text-sm">
              {data.map((d, i) => (
                <li key={d.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
                  <span className="flex-1 truncate text-muted-foreground">{d.name}</span>
                  <span className="font-medium">{Math.round((d.value / total) * 100)}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
