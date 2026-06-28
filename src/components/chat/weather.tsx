"use client";

import { CloudIcon, DropletIcon, ThermometerIcon, WindIcon } from "lucide-react";
import type { WeatherData } from "@/lib/types";
import { Shimmer } from "../ai-elements/shimmer";

function WeatherIcon({ condition }: { condition: string }) {
  const lower = condition.toLowerCase();
  if (lower.includes("sun") || lower.includes("clear")) {
    return (
      <svg viewBox="0 0 24 24" className="size-12 text-amber-400" fill="currentColor">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    );
  }
  if (lower.includes("cloud")) {
    return <CloudIcon className="size-12 text-slate-400" />;
  }
  if (lower.includes("rain")) {
    return (
      <svg viewBox="0 0 24 24" className="size-12 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" strokeLinecap="round" />
        <path d="M8 19v1M8 23v1M12 21v1M12 17v1M16 19v1M16 23v1" strokeLinecap="round" />
      </svg>
    );
  }
  return <ThermometerIcon className="size-12 text-orange-400" />;
}

export function WeatherCard({ data }: { data: WeatherData }) {
  return (
    <div className="w-[min(100%,360px)] overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-950/40 dark:to-blue-950/40 shadow-sm">
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{data.condition}</p>
            <p className="text-5xl font-semibold tracking-tight text-foreground mt-1">
              {data.temperature}°
            </p>
            <p className="text-sm text-muted-foreground mt-1">{data.city}</p>
          </div>
          <WeatherIcon condition={data.condition} />
        </div>

        <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
          <span>H:{data.high}°</span>
          <span className="mx-1 text-border">·</span>
          <span>L:{data.low}°</span>
          <span className="mx-1 text-border">·</span>
          <span>Feels like {data.feelsLike}°</span>
        </div>
      </div>

      <div className="border-t border-border/30 px-5 py-3 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm">
          <DropletIcon className="size-4 text-blue-400 shrink-0" />
          <span className="text-muted-foreground">Humidity</span>
          <span className="ml-auto font-medium text-foreground">{data.humidity}%</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <WindIcon className="size-4 text-slate-400 shrink-0" />
          <span className="text-muted-foreground">Wind</span>
          <span className="ml-auto font-medium text-foreground">{data.wind} km/h</span>
        </div>
      </div>
    </div>
  );
}

export function WeatherToolLoading() {
  return (
    <div className="w-[min(100%,360px)] overflow-hidden rounded-2xl border border-border/40 bg-muted/40 p-5">
      <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
        <CloudIcon className="size-5 shrink-0 animate-pulse text-blue-400" />
        <Shimmer className="font-medium" duration={1.5}>
          Fetching weather data...
        </Shimmer>
      </div>
    </div>
  );
}
