export interface App {
  name: string;
  url: string;
  description: string;
}

export interface HealthStatus {
  name: string;
  description: string;
  url: string;
  status: 'healthy' | 'unhealthy' | 'down';  // Only these 3 values allowed!
  response_time: number;
  status_code: number | null;
  timestamp: string;
  error: string | null;
}

export interface HealthUpdateMessage {
  type: 'health_update';
  timestamp: string;
  apps: HealthStatus[];
}