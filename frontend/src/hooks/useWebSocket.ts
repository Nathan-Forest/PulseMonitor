import { useEffect, useState, useRef } from 'react';
import type { HealthStatus, HealthUpdateMessage } from '../types';

export function useWebSocket(url: string) {
  const [healthData, setHealthData] = useState<HealthStatus[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log('🔌 Connecting to WebSocket:', url);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const message: HealthUpdateMessage = JSON.parse(event.data);
      
      console.log('📨 Received update:', message);

      setHealthData(message.apps);
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
    };

    return () => {
      console.log('🧹 Cleaning up WebSocket');
      ws.close();
    };
  }, [url]);  

  return { healthData, isConnected };
}