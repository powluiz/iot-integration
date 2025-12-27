'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import { MQTT_CONFIG } from '@/app/config/mqtt';

interface SensorData {
  temp: number;
  hum: number;
  deviceId?: string;
  type?: string;
  uptime?: number;
}
interface LampCommand {
  action: 'ON' | 'OFF';
}

export function useMqtt() {
  const [connected, setConnected] = useState<boolean>(false);
  const [lampState, setLampState] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    // Evita múltiplas conexões no Strict Mode do React 18/19
    if (clientRef.current) return;

    console.log('[MQTT] Iniciando conexão:', MQTT_CONFIG.options.clientId);

    const client = mqtt.connect(MQTT_CONFIG.url, MQTT_CONFIG.options);
    clientRef.current = client;

    client.on('connect', () => {
      setConnected(true);
      console.log('[MQTT] Conectado com sucesso ao Broker');

      const subTopics = [MQTT_CONFIG.topics.status, MQTT_CONFIG.topics.sensor];
      client.subscribe(subTopics, (err) => {
        if (!err) {
          console.log('[MQTT] Inscrito nos tópicos:', subTopics);
        } else {
          console.error('[MQTT] Erro na inscrição:', err);
        }
      });
    });

    client.on('message', (topic, message) => {
      const payload = message.toString();
      // console.log(`[MQTT] Mensagem em [${topic}]:`, payload);

      if (topic === MQTT_CONFIG.topics.status) {
        try {
          const data = payload.startsWith('{')
            ? JSON.parse(payload)
            : { status: payload };
          const statusStr = (
            data.status ||
            data.action ||
            data.power ||
            payload
          )
            .toString()
            .toUpperCase();
          setLampState(statusStr === 'ON');
        } catch (e) {
          setLampState(payload.toUpperCase() === 'ON');
        }
      } else if (topic === MQTT_CONFIG.topics.sensor) {
        try {
          const data: SensorData = JSON.parse(payload);
          if (typeof data.temp === 'number') setTemperature(data.temp);
          if (typeof data.hum === 'number') setHumidity(data.hum);
          setLastUpdate(new Date());
        } catch (error) {
          console.error('[MQTT] Falha no parse dos dados do sensor:', error);
        }
      }
    });

    client.on('error', (err) => {
      console.error('[MQTT] Erro na conexão:', err);
      setConnected(false);
    });

    client.on('close', () => {
      console.log('[MQTT] Conexão encerrada');
      setConnected(false);
    });

    return () => {
      if (clientRef.current) {
        clientRef.current.removeAllListeners();
        clientRef.current.end(true);
        clientRef.current = null;
        setConnected(false);
      }
    };
  }, []);

  // Função para alternar o estado da lâmpada (Envia para a Fog)
  const toggleLamp = useCallback(() => {
    if (clientRef.current && connected) {
      const nextAction = lampState ? 'OFF' : 'ON';
      const command: LampCommand = { action: nextAction };

      clientRef.current.publish(
        MQTT_CONFIG.topics.command,
        JSON.stringify(command),
        { qos: 0 },
      );

      // optimistic UI update: Altera o estado local antes da resposta do servidor, mas se ajusta no proximo retorno via MQTT
      setLampState(!lampState);
    } else {
      console.warn('[MQTT] Tentativa de toggle sem conexão ativa');
    }
  }, [connected, lampState]);

  return {
    connected,
    lampState,
    temperature,
    humidity,
    lastUpdate,
    toggleLamp,
  };
}
