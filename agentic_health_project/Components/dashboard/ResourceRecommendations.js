import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Package, 
  Bed, 
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const priorityColors = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700'
};

const statusIcons = {
  pending: Clock,
  acknowledged: CheckCircle,
  in_progress: AlertTriangle,
  completed: CheckCircle
};

export default function ResourceRecommendations({ recommendations = [], onAcknowledge }) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Recommendations</h3>
      
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {recommendations.map((rec, index) => {
          const StatusIcon = statusIcons[rec.status] || Clock;
          
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">
                      {rec.hospital_name || rec.city}
                    </h4>
                    <Badge className={priorityColors[rec.priority]}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Valid until: {new Date(rec.valid_until).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <StatusIcon className="w-4 h-4" />
                  <span className="capitalize">{rec.status}</span>
                </div>
              </div>
              
              {/* Staffing */}
              {rec.staffing_recommendations && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4" />
                    <span>Staffing Needs</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <p className="font-semibold text-blue-700">
                        +{rec.staffing_recommendations.additional_doctors || 0}
                      </p>
                      <p className="text-xs text-blue-600">Doctors</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2 text-center">
                      <p className="font-semibold text-purple-700">
                        +{rec.staffing_recommendations.additional_nurses || 0}
                      </p>
                      <p className="text-xs text-purple-600">Nurses</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="font-semibold text-gray-700">
                        +{rec.staffing_recommendations.additional_support_staff || 0}
                      </p>
                      <p className="text-xs text-gray-600">Support</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Beds */}
              {rec.bed_recommendations && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Bed className="w-4 h-4" />
                    <span>Additional Beds Required</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600">
                      General: <strong>+{rec.bed_recommendations.additional_general_beds || 0}</strong>
                    </span>
                    <span className="text-gray-600">
                      ICU: <strong>+{rec.bed_recommendations.additional_icu_beds || 0}</strong>
                    </span>
                    <span className="text-gray-600">
                      Emergency: <strong>+{rec.bed_recommendations.additional_emergency_beds || 0}</strong>
                    </span>
                  </div>
                </div>
              )}
              
              {/* Supplies */}
              {rec.supply_recommendations?.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Package className="w-4 h-4" />
                    <span>Supply Needs</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rec.supply_recommendations.slice(0, 4).map((supply, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg px-3 py-1.5 text-xs">
                        <span className="font-medium">{supply.item_name}</span>
                        <span className="text-gray-500 ml-1">
                          ({supply.current_stock} → {supply.recommended_stock})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {rec.status === 'pending' && (
                <Button 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => onAcknowledge?.(rec)}
                >
                  Acknowledge Recommendation
                </Button>
              )}
            </motion.div>
          );
        })}
        
        {recommendations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No resource recommendations at this time</p>
          </div>
        )}
      </div>
    </div>
  );
}