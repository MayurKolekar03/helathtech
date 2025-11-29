import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp } from 'lucide-react';

export default function LikelyConditions({ conditions = [] }) {
  const sortedConditions = [...conditions].sort((a, b) => b.probability - a.probability);
  
  return (
    <div className="bg-white rounded-2xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Likely Conditions</h3>
        <Activity className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {sortedConditions.slice(0, 5).map((condition, index) => {
          const probability = Math.round(condition.probability * 100);
          
          return (
            <motion.div
              key={condition.condition}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {condition.condition}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    ~{condition.expected_cases} cases
                  </span>
                  <span className={`text-sm font-semibold px-2 py-0.5 rounded ${
                    probability > 70 ? 'bg-red-100 text-red-700' :
                    probability > 40 ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {probability}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${probability}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`h-full rounded-full ${
                    probability > 70 ? 'bg-red-400' :
                    probability > 40 ? 'bg-amber-400' :
                    'bg-emerald-400'
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
        
        {conditions.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>No condition predictions available</p>
          </div>
        )}
      </div>
    </div>
  );
}