export default function AQIChart(){return <div>AQIChart</div>}import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';

const getAQIColor = (aqi) => {
  if (aqi <= 50) return '#22c55e';
  if (aqi <= 100) return '#eab308';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  if (aqi <= 300) return '#8b5cf6';
  return '#991b1b';
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white rounded-lg shadow-lg border p-3">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm">
            <span className="text-gray-500">AQI: </span>
            <span className="font-semibold" style={{ color: getAQIColor(data.aqi) }}>{data.aqi}</span>
          </p>
          <p className="text-sm">
            <span className="text-gray-500">Temp: </span>
            <span className="font-semibold">{data.temperature}°C</span>
          </p>
          <p className="text-sm">
            <span className="text-gray-500">Humidity: </span>
            <span className="font-semibold">{data.humidity}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function AQIChart({ data = [] }) {
  const formattedData = data.map(item => ({
    ...item,
    date: format(new Date(item.recorded_at || item.date), 'MMM dd'),
    aqi: item.aqi || 0,
    temperature: item.temperature_celsius || item.temperature || 0,
    humidity: item.humidity_percent || item.humidity || 0
  }));

  return (
    <div className="bg-white rounded-2xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Air Quality Index</h3>
          <p className="text-sm text-gray-500">7-day trend</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Good (0-50)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Moderate (51-100)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Unhealthy (151+)</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 500]} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={100} stroke="#eab308" strokeDasharray="5 5" />
          <ReferenceLine y={200} stroke="#ef4444" strokeDasharray="5 5" />
          <Area
            type="monotone"
            dataKey="aqi"
            stroke="#f97316"
            strokeWidth={2}
            fill="url(#aqiGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}