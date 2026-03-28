import { Activity, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import type { HealthStatus } from '../types';

interface StatusCardProps {
  app: HealthStatus;
}

export function StatusCard({ app }: StatusCardProps) {
  
  const getStatusIcon = () => {
    switch (app.status) {
      case 'healthy':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'unhealthy':
        return <AlertCircle className="w-6 h-6 text-yellow-400" />;
      case 'down':
        return <XCircle className="w-6 h-6 text-red-400" />;
    }
  };

  const getStatusColor = () => {
    switch (app.status) {
      case 'healthy':
        return 'border-green-500 bg-green-500/10';
      case 'unhealthy':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'down':
        return 'border-red-500 bg-red-500/10';
    }
  };

  const getStatusText = () => {
    switch (app.status) {
      case 'healthy':
        return 'Healthy';
      case 'unhealthy':
        return 'Degraded';
      case 'down':
        return 'Down';
    }
  };

  return (
    <div className={`border-2 rounded-xl p-6 ${getStatusColor()} transition-all hover:scale-105`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-xl font-bold">{app.name}</h3>
            <p className="text-sm text-gray-400">{app.description}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          app.status === 'healthy' ? 'bg-green-500/20 text-green-300' :
          app.status === 'unhealthy' ? 'bg-yellow-500/20 text-yellow-300' :
          'bg-red-500/20 text-red-300'
        }`}>
          {getStatusText()}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-xs text-gray-400">Response Time</p>
          <p className="text-2xl font-bold">
            {app.response_time.toFixed(0)}
            <span className="text-sm text-gray-400 ml-1">ms</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Status Code</p>
          <p className="text-2xl font-bold">
            {app.status_code || 'N/A'}
          </p>
        </div>
      </div>

      {/* Error message if exists */}
      {app.error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-xs text-red-300">{app.error}</p>
        </div>
      )}

      {/* Endpoint */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">{app.url}</p>
      </div>
    </div>
  );
}