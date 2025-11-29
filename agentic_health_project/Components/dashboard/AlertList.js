import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Bell, 
  Cloud, 
  Wind, 
  Thermometer, 
  Users,
  X,
  Check
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

const alertIcons = {
  surge_warning: Users,
  resource_critical: AlertTriangle,
  anomaly_detected: Bell,
  weather_alert: Cloud,
  pollution_alert: Wind,
  epidemic_alert: Thermometer,
  system: Bell
};

const severityColors = {
  info: 'bg-blue-50 border-blue-200 text-blue-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-700',
  critical: 'bg-red-50 border-red-200 text-red-700'
};

export default function AlertsList({ alerts = [], onAcknowledge, onDismiss }) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
        <span className="text-sm text-gray-500">{alerts.filter(a => !a.is_acknowledged).length} unread</span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No active alerts</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const Icon = alertIcons[alert.alert_type] || Bell;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-4 rounded-xl border ${severityColors[alert.severity]} ${
                    alert.is_acknowledged ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      alert.severity === 'critical' ? 'bg-red-100' :
                      alert.severity === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold truncate">{alert.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          alert.severity === 'critical' ? 'bg-red-200' :
                          alert.severity === 'warning' ? 'bg-amber-200' : 'bg-blue-200'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm mt-1 opacity-80">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs opacity-60">
                        {alert.city && <span>{alert.city}</span>}
                        <span>{format(new Date(alert.created_date), 'MMM dd, HH:mm')}</span>
                      </div>
                    </div>
                    {!alert.is_acknowledged && (
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => onAcknowledge?.(alert)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => onDismiss?.(alert)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}