import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wind, 
  Calendar, 
  Thermometer, 
  Users, 
  Bug,
  CloudRain,
  Sun,
  Factory
} from 'lucide-react';

const factorIcons = {
  aqi: Wind,
  pollution: Factory,
  festival: Calendar,
  temperature: Thermometer,
  crowd: Users,
  epidemic: Bug,
  rain: CloudRain,
  heat: Sun
};

export default function ContributingFactors({ factors = [] }) {
  const sortedFactors = [...factors].sort((a, b) => b.impact_score - a.impact_score);
  
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contributing Factors</h3>
      
      <div className="space-y-3">
        {sortedFactors.map((factor, index) => {
          const Icon = factorIcons[factor.factor?.toLowerCase()] || Wind;
          const impactPercent = Math.round(factor.impact_score * 100);
          
          return (
            <motion.div
              key={factor.factor}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className={`p-2 rounded-lg ${
                impactPercent > 70 ? 'bg-red-100 text-red-600' :
                impactPercent > 40 ? 'bg-amber-100 text-amber-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {factor.factor?.replace(/_/g, ' ')}
                  </span>
                  <span className={`text-sm font-semibold ${
                    impactPercent > 70 ? 'text-red-600' :
                    impactPercent > 40 ? 'text-amber-600' :
                    'text-blue-600'
                  }`}>
                    {impactPercent}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${impactPercent}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full rounded-full ${
                      impactPercent > 70 ? 'bg-red-500' :
                      impactPercent > 40 ? 'bg-amber-500' :
                      'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {factors.length === 0 && (
          <p className="text-center text-gray-500 py-4">No contributing factors identified</p>
        )}
      </div>
    </div>
  );
}