import { IClientOptions } from 'mqtt';

const generateClientId = () => {
  const envId = process.env.NEXT_PUBLIC_MQTT_CLIENT_ID || 'nextjs_client';
  const randomSuffix = Math.random().toString(16).slice(2, 8);
  return `${envId}_${randomSuffix}`;
};

export const MQTT_CONFIG = {
  url: process.env.NEXT_PUBLIC_MQTT_BROKER_URL || '',

  options: {
    clientId: generateClientId(),
    clean: true,
    keepalive: 60,
    reconnectPeriod: 1000,
    connectTimeout: 5000,
    protocolVersion: 4,
    protocol: 'wss',
    path: '/mqtt',
    rejectUnauthorized: false,
  } satisfies IClientOptions,

  topics: {
    command: process.env.NEXT_PUBLIC_MQTT_TOPIC_LAMP_COMMAND || '',
    status: process.env.NEXT_PUBLIC_MQTT_TOPIC_LAMP_STATUS || '',
    sensor: process.env.NEXT_PUBLIC_MQTT_TOPIC_SENSOR || '',
  },
};
