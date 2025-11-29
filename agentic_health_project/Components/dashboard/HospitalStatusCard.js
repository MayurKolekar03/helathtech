import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bed, 
  Heart, 
  Users, 
  Wind,
  Activity,
  AlertCircle
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const statusColors = {
  normal: 'border-emerald-200 bg-emerald-50',
  elevated: 'border-amber-200 bg-amber-50',
  high: 'border-orange-200 bg-orange-50',
  critical: 'border-red-200 bg-red-50'
};

const statusBadgeColors = {
  normal: 'bg-emerald-100 text-emerald-700',
  elevated: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700'
};

export default function HospitalStatusCard({ hospital, status }) {
  if (!status) return null;
  
  const bedOccupancy = hospital?.total_beds 
    ? Math.round((status.occupied_beds / hospital.total_beds) * 100) 
    : 0;
  
  const icuOccupancy = hospital?.icu_beds 
    ? Math.round((status.occupied_icu / hospital.icu_beds) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl border-2 p-5 ${statusColors[status.status_level] || statusColors.normal}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{status.hospital_name}</h3>
          <p className="text-sm text-gray-500">{hospital?.city}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          statusBadgeColors[status.status_level] || statusBadgeColors.normal
        }`}>
          {status.status_level?.toUpperCase()}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Bed className="w-4 h-4" />
            <span>Bed Occupancy</span>
          </div>
          <Progress value={bedOccupancy} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">
            {status.occupied_beds}/{hospital?.total_beds || '?'} beds
          </p>
        </div>
        
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Heart className="w-4 h-4" />
            <span>ICU Occupancy</span>
          </div>
          <Progress value={icuOccupancy} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">
            {status.occupied_icu}/{hospital?.icu_beds || '?'} ICU
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <Users className="w-5 h-5 mx-auto text-gray-400 mb-1" />
          <p className="text-lg font-semibold text-gray-900">{status.doctors_available || 0}</p>
          <p className="text-xs text-gray-500">Doctors</p>
        </div>
        <div className="text-center">
          <Activity className="w-5 h-5 mx-auto text-gray-400 mb-1" />
          <p className="text-lg font-semibold text-gray-900">{status.waiting_patients || 0}</p>
          <p className="text-xs text-gray-500">Waiting</p>
        </div>
        <div className="text-center">
          <Wind className="w-5 h-5 mx-auto text-gray-400 mb-1" />
          <p className="text-lg font-semibold text-gray-900">{status.oxygen_stock_hours || 0}h</p>
          <p className="text-xs text-gray-500">O₂ Stock</p>
        </div>
      </div>
      
      {status.notes && (
        <div className="mt-4 p-3 bg-white/50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5" />
            <p className="text-sm text-gray-600">{status.notes}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}