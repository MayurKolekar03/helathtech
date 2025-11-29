import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Bed, Users, Wind, Loader2 } from 'lucide-react';

export default function HospitalStatusForm({ hospitals = [], onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    hospital_id: '',
    hospital_name: '',
    occupied_beds: 0,
    occupied_icu: 0,
    occupied_emergency: 0,
    available_ventilators: 0,
    current_patients: 0,
    waiting_patients: 0,
    staff_on_duty: 0,
    doctors_available: 0,
    nurses_available: 0,
    oxygen_stock_hours: 0,
    blood_units_available: 0,
    status_level: 'normal',
    notes: ''
  });

  const handleHospitalSelect = (hospitalId) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    setFormData({
      ...formData,
      hospital_id: hospitalId,
      hospital_name: hospital?.name || ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      reported_at: new Date().toISOString()
    });
  };

  return (
    <Card className="bg-white rounded-2xl border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          Update Hospital Status
        </CardTitle>
        <p className="text-sm text-gray-500">
          Real-time status update for surge management
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hospital Selection */}
          <div>
            <Label>Select Hospital *</Label>
            <Select
              value={formData.hospital_id}
              onValueChange={handleHospitalSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your hospital" />
              </SelectTrigger>
              <SelectContent>
                {hospitals.map(hospital => (
                  <SelectItem key={hospital.id} value={hospital.id}>
                    {hospital.name} - {hospital.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bed Status */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Bed className="w-4 h-4" />
              Bed Occupancy
            </Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-gray-500">General Beds</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.occupied_beds}
                  onChange={(e) => setFormData({ ...formData, occupied_beds: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">ICU Beds</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.occupied_icu}
                  onChange={(e) => setFormData({ ...formData, occupied_icu: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Emergency Beds</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.occupied_emergency}
                  onChange={(e) => setFormData({ ...formData, occupied_emergency: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          {/* Staff Status */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Staff On Duty
            </Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-gray-500">Doctors</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.doctors_available}
                  onChange={(e) => setFormData({ ...formData, doctors_available: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Nurses</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.nurses_available}
                  onChange={(e) => setFormData({ ...formData, nurses_available: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Total Staff</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.staff_on_duty}
                  onChange={(e) => setFormData({ ...formData, staff_on_duty: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          {/* Patient Count */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-gray-500">Current Patients</Label>
              <Input
                type="number"
                min="0"
                value={formData.current_patients}
                onChange={(e) => setFormData({ ...formData, current_patients: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Waiting Patients</Label>
              <Input
                type="number"
                min="0"
                value={formData.waiting_patients}
                onChange={(e) => setFormData({ ...formData, waiting_patients: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Wind className="w-4 h-4" />
              Critical Resources
            </Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-gray-500">Ventilators Available</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.available_ventilators}
                  onChange={(e) => setFormData({ ...formData, available_ventilators: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">O₂ Stock (hours)</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.oxygen_stock_hours}
                  onChange={(e) => setFormData({ ...formData, oxygen_stock_hours: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Blood Units</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.blood_units_available}
                  onChange={(e) => setFormData({ ...formData, blood_units_available: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          {/* Status Level */}
          <div>
            <Label>Current Status Level</Label>
            <Select
              value={formData.status_level}
              onValueChange={(value) => setFormData({ ...formData, status_level: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal - Operating normally</SelectItem>
                <SelectItem value="elevated">Elevated - Increased activity</SelectItem>
                <SelectItem value="high">High - Near capacity</SelectItem>
                <SelectItem value="critical">Critical - Immediate support needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label>Additional Notes</Label>
            <Textarea
              placeholder="Any important observations or requests..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !formData.hospital_id}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Hospital Status'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}