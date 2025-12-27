'use client';

import { Lightbulb, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LampControlProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function LampControl({ isOn, onToggle, disabled }: LampControlProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      {/* Glow effect when lamp is on */}
      {isOn && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-amber-500/20 via-transparent to-transparent" />
      )}

      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Lâmpada</h2>
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full',
              isOn
                ? 'bg-amber-500/20 text-amber-500'
                : 'bg-slate-800 text-slate-400',
            )}
          >
            <Lightbulb className="h-4 w-4" />
          </div>
        </div>

        {/* Lamp Visualization */}
        <div className="flex justify-center py-8">
          <div className="relative">
            {isOn && (
              <div className="absolute inset-0 animate-pulse rounded-full bg-amber-500/30 blur-xl" />
            )}
            <Lightbulb
              className={cn(
                'relative h-24 w-24 transition-all duration-300',
                isOn
                  ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.7)]'
                  : 'text-slate-700',
              )}
            />
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <p className="text-sm text-slate-400">Status</p>
          <p
            className={cn(
              'text-2xl font-bold',
              isOn ? 'text-amber-400' : 'text-slate-500',
            )}
          >
            {isOn ? 'Ligada' : 'Desligada'}
          </p>
        </div>

        {/* Control Button */}
        <Button
          onClick={onToggle}
          disabled={disabled}
          className={cn(
            'w-full gap-2 transition-all duration-300',
            isOn
              ? 'bg-amber-500 text-slate-900 hover:bg-amber-600'
              : 'bg-slate-800 text-white hover:bg-slate-700',
          )}
          size="lg"
        >
          <Power className="h-4 w-4" />
          {isOn ? 'Desligar' : 'Ligar'}
        </Button>

        {disabled && (
          <p className="text-center text-xs text-slate-500">
            Aguardando conexão MQTT...
          </p>
        )}
      </div>
    </div>
  );
}
