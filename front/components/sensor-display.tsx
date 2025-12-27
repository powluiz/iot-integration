'use client';

import { Thermometer, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SensorDisplayProps {
  type: 'temperature' | 'humidity';
  value: number | null;
  lastUpdate: Date | null;
}

export function SensorDisplay({ type, value, lastUpdate }: SensorDisplayProps) {
  const isTemperature = type === 'temperature';
  const Icon = isTemperature ? Thermometer : Droplets;

  const getTemperatureColor = (temp: number) => {
    if (temp < 15) return 'text-blue-400';
    if (temp < 25) return 'text-emerald-400';
    if (temp < 30) return 'text-amber-400';
    return 'text-red-400';
  };

  const getHumidityColor = (hum: number) => {
    if (hum < 30) return 'text-amber-400';
    if (hum < 60) return 'text-emerald-400';
    return 'text-blue-400';
  };

  const valueColor =
    value !== null
      ? isTemperature
        ? getTemperatureColor(value)
        : getHumidityColor(value)
      : 'text-slate-500';

  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Aguardando dados...';
    const seconds = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
    if (seconds < 5) return 'Agora';
    if (seconds < 60) return `${seconds}s atrás`;
    return `${Math.floor(seconds / 60)}min atrás`;
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          {isTemperature ? 'Temperatura' : 'Umidade'}
        </h3>
        <div className={cn('rounded-full bg-slate-800 p-2', valueColor)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-1">
          <span className={cn('text-4xl font-bold', valueColor)}>
            {value !== null ? value.toFixed(1) : '--'}
          </span>
          <span className="text-lg text-slate-400">
            {isTemperature ? '°C' : '%'}
          </span>
        </div>

        <p className="text-xs text-slate-500">{formatLastUpdate()}</p>
      </div>

      {/* Visual indicator bar */}
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
        {value !== null && (
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              valueColor.replace('text-', 'bg-'),
            )}
            style={{
              width: `${isTemperature ? Math.min((value / 50) * 100, 100) : Math.min(value, 100)}%`,
            }}
          />
        )}
      </div>
    </div>
  );
}
