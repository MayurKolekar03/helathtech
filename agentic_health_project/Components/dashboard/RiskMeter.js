import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const riskConfig = {
  low: {
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    icon: CheckCircle,
    label: 'Low Risk',
    description: 'Normal operations'
  },
  medium: {
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    icon: AlertCircle,
    label: 'Medium Risk',
    description: 'Elevated attention needed'
  },
  high: {
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    icon: AlertTriangle,
    label: 'High Risk',
    description: 'Prepare for surge'
  },
  critical: {
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    icon: XCircle,
    label: 'Critical',
    description: 'Immediate action required'
  }
};

export default function RiskMeter({ level = 'low', score = 0, showLabel = true }) {
  const config = riskConfig[level] || riskConfig.low;
  const Icon = config.icon;
  
  const rotation = Math.min(Math.max(score, 0), 100) * 1.8 - 90;
  
  return (
    <div className={`rounded-2xl ${config.bgColor} ${config.borderColor} border p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${config.color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`font-semibold ${config.textColor}`}>{config.label}</h3>
            <p className="text-sm text-gray-500">{config.description}</p>
          </div>
        </div>
        <div className={`text-3xl font-bold ${config.textColor}`}>{score}%</div>
      </div>
      
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full ${config.color} rounded-full`}
        />
        <div className="absolute inset-0 flex">
          <div className="w-1/4 border-r border-white/30" />
          <div className="w-1/4 border-r border-white/30" />
          <div className="w-1/4 border-r border-white/30" />
          <div className="w-1/4" />
        </div>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
        <span>Critical</span>
      </div>
    </div>
  );
}