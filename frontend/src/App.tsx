import { Activity } from 'lucide-react';
import { StatusCard } from './components/StatusCard';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const { healthData, isConnected } = useWebSocket('ws://localhost:8000/ws');

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-10 h-10 text-blue-400" />
            <div>
              <h1 className="text-4xl font-bold">PulseMonitor</h1>
              <p className="text-gray-400">Real-time Application Health Dashboard</p>
            </div>
          </div>

          {/* Connection indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
            }`} />
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </header>

      {/* Dashboard Grid */}
      {healthData.length === 0 ? (
        <div className="text-center py-20">
          <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Connecting to monitoring service...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthData.map((app) => (
            <StatusCard key={app.name} app={app} />
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Last updated: {healthData[0]?.timestamp ? new Date(healthData[0].timestamp).toLocaleString() : 'N/A'}</p>
      </footer>
    </div>
  );
}

export default App;