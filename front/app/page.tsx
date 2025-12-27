'use client';
import { LampControl } from '@/components/lamp-control';
import { SensorDisplay } from '@/components/sensor-display';
import { MqttStatus } from '@/components/mqtt-status';
import { useMqtt } from '@/hooks/use-mqtt';
import { MQTT_CONFIG } from './config/mqtt';

export default function Home() {
  const {
    connected,
    lampState,
    temperature,
    humidity,
    toggleLamp,
    lastUpdate,
  } = useMqtt();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance text-white">
              Painel IoT
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Controle e monitore seus dispositivos em tempo real
            </p>
          </div>
          <MqttStatus connected={connected} />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Lamp Control */}
          <LampControl
            isOn={lampState}
            onToggle={toggleLamp}
            disabled={!connected}
          />

          {/* Sensor Displays */}
          <div className="grid gap-6">
            <SensorDisplay
              type="temperature"
              value={temperature}
              lastUpdate={lastUpdate}
            />
            <SensorDisplay
              type="humidity"
              value={humidity}
              lastUpdate={lastUpdate}
            />
          </div>
        </div>

        {/* Configuration Info */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-white">
            Configuração MQTT
          </h3>
          <div className="grid gap-2 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Broker:</span>
              <span className="font-mono text-slate-300">
                {MQTT_CONFIG.url}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tópico Lâmpada:</span>
              <span className="font-mono text-slate-300">
                {MQTT_CONFIG.topics.command}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tópico Sensores:</span>
              <span className="font-mono text-slate-300">
                {MQTT_CONFIG.topics.sensor}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
