'use client';

import { Activity, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MqttStatusProps {
  connected: boolean;
}

export function MqttStatus({ connected }: MqttStatusProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium',
        connected
          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
          : 'border-red-500/20 bg-red-500/10 text-red-400',
      )}
    >
      {connected ? (
        <>
          <Activity className="h-4 w-4 animate-pulse" />
          <span>Conectado</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>Desconectado</span>
        </>
      )}
    </div>
  );
}
