import React from 'react';
import { 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white rounded-lg shadow-lg border p-4">
        <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500">Predicted Cases:</span>
            <span className="font-bold text-blue-600">{data.predicted}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500">Confidence Range:</span>
            <span className="font-medium text-gray-700">{data.lower} - {data.upper}</span>
          </div>
          {data.actual !== undefined && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">Actual Cases:</span>
              <span className="font-bold text-emerald-600">{data.actual}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500">Risk Level:</span>
            <span className={`font-medium px-2 py-0.5 rounded text-xs ${
              data.risk === 'critical' ? 'bg-red-100 text-red-700' :
              data.risk === 'high' ? 'bg-orange-100 text-orange-700' :
              data.risk === 'medium' ? 'bg-amber-100 text-amber-700' :
              'bg-emerald-100 text-emerald-700'
            }`}>{data.risk?.toUpperCase()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function PredictionChart({ predictions = [], actuals = [] }) {
  const data = predictions.map((pred, idx) => ({
    date: format(new Date(pred.prediction_date), 'MMM dd'),
    predicted: pred.predicted_cases,
    lower: pred.predicted_cases_lower,
    upper: pred.predicted_cases_upper,
    actual: actuals[idx]?.cases,
    risk: pred.risk_level
  }));

  return (
    <div className="bg-white rounded-2xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Surge Predictions</h3>
          <p className="text-sm text-gray-500">7-day forecast with confidence intervals</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="upper"
            stroke="transparent"
            fill="url(#confidenceGradient)"
            name="Upper Bound"
          />
          <Area
            type="monotone"
            dataKey="lower"
            stroke="transparent"
            fill="#ffffff"
            name="Lower Bound"
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            name="Predicted Cases"
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
            name="Actual Cases"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}