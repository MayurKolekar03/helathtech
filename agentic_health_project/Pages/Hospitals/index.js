import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Search, 
  Loader2,
  Bed,
  Users,
  Activity,
  Wind,
  Phone,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Package
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const CITIES = ['All', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'];

const STATUS_COLORS = {
  normal: 'bg-emerald-100 text-emerald-800',
  elevated: 'bg-amber-100 text-amber-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

export default function Hospitals() {
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: hospitals = [], isLoading: loadingHospitals } = useQuery({
    queryKey: ['hospitals'],
    queryFn: () => base44.entities.Hospital.list('-created_date', 100)
  });

  const { data: hospitalStatus = [] } = useQuery({
    queryKey: ['hospitalStatus'],
    queryFn: () => base44.entities.HospitalStatus.list('-reported_at', 100)
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['allRecommendations'],
    queryFn: () => base44.entities.ResourceRecommendation.filter({ status: 'pending' }, '-created_date', 20)
  });

  const acknowledgeRec = useMutation({
    mutationFn: (rec) => base44.entities.ResourceRecommendation.update(rec.id, { status: 'acknowledged' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['allRecommendations']);
      toast.success('Recommendation acknowledged');
    }
  });

  const filteredHospitals = hospitals.filter(h => {
    const matchesCity = selectedCity === 'All' || h.city === selectedCity;
    const matchesSearch = !searchTerm || 
      h.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.code?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const getLatestStatus = (hospitalId) => {
    return hospitalStatus.find(s => s.hospital_id === hospitalId);
  };

  const filteredRecs = recommendations.filter(r => 
    selectedCity === 'All' || r.city === selectedCity
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              Hospital Management
            </h1>
            <p className="text-gray-500 mt-1">Monitor capacity & manage AI resource recommendations</p>
          </div>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="hospitals">
          <TabsList className="mb-6">
            <TabsTrigger value="hospitals">Hospitals ({filteredHospitals.length})</TabsTrigger>
            <TabsTrigger value="recommendations">
              AI Recommendations
              {filteredRecs.length > 0 && (
                <Badge className="ml-2 bg-red-500">{filteredRecs.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hospitals">
            <div className="mb-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search hospitals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loadingHospitals ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHospitals.map((hospital, idx) => {
                  const status = getLatestStatus(hospital.id);
                  const bedOccupancy = status ? Math.round((status.occupied_beds / hospital.total_beds) * 100) : 0;
                  const icuOccupancy = status && hospital.icu_beds ? Math.round((status.occupied_icu / hospital.icu_beds) * 100) : 0;
                  
                  return (
                    <motion.div
                      key={hospital.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{hospital.name}</CardTitle>
                              <p className="text-sm text-gray-500">{hospital.code}</p>
                            </div>
                            <Badge className={STATUS_COLORS[status?.status_level || 'normal']}>
                              {status?.status_level || 'normal'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              {hospital.city}, {hospital.state}
                            </div>
                            
                            {/* Bed Occupancy */}
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="flex items-center gap-1">
                                  <Bed className="w-4 h-4" /> Beds
                                </span>
                                <span>{status?.occupied_beds || 0}/{hospital.total_beds}</span>
                              </div>
                              <Progress value={bedOccupancy} className="h-2" />
                            </div>

                            {/* ICU */}
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="flex items-center gap-1">
                                  <Activity className="w-4 h-4" /> ICU
                                </span>
                                <span>{status?.occupied_icu || 0}/{hospital.icu_beds}</span>
                              </div>
                              <Progress 
                                value={icuOccupancy} 
                                className={`h-2 ${icuOccupancy > 80 ? '[&>div]:bg-red-500' : ''}`} 
                              />
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-2 pt-2">
                              <div className="bg-gray-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-gray-500">Ventilators</p>
                                <p className="font-semibold">{hospital.ventilators}</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-gray-500">Emergency</p>
                                <p className="font-semibold">{hospital.emergency_beds}</p>
                              </div>
                            </div>

                            {hospital.contact_phone && (
                              <div className="pt-2 border-t">
                                <a href={`tel:${hospital.contact_phone}`} className="flex items-center gap-2 text-sm text-blue-600">
                                  <Phone className="w-4 h-4" />
                                  {hospital.contact_phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="space-y-4">
              {filteredRecs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                    <p className="text-lg font-medium">All Caught Up!</p>
                    <p className="text-sm">No pending resource recommendations</p>
                  </CardContent>
                </Card>
              ) : (
                filteredRecs.map((rec) => (
                  <Card key={rec.id} className="border-2 border-amber-200 bg-amber-50/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-amber-600" />
                            Resource Recommendation
                          </CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            {rec.city} • Valid until {rec.valid_until}
                          </p>
                        </div>
                        <Badge className={
                          rec.priority === 'urgent' ? 'bg-red-500' :
                          rec.priority === 'high' ? 'bg-orange-500' :
                          rec.priority === 'medium' ? 'bg-amber-500' :
                          'bg-emerald-500'
                        }>
                          {rec.priority?.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        {/* Staffing */}
                        <div className="bg-white rounded-lg p-3">
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                            <Users className="w-4 h-4 text-purple-600" />
                            Staffing
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Doctors</span>
                              <span className="font-semibold">+{rec.staffing_recommendations?.additional_doctors || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Nurses</span>
                              <span className="font-semibold">+{rec.staffing_recommendations?.additional_nurses || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* Beds */}
                        <div className="bg-white rounded-lg p-3">
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                            <Bed className="w-4 h-4 text-blue-600" />
                            Beds
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>General</span>
                              <span className="font-semibold">+{rec.bed_recommendations?.additional_general_beds || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>ICU</span>
                              <span className="font-semibold">+{rec.bed_recommendations?.additional_icu_beds || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* Supplies */}
                        <div className="bg-white rounded-lg p-3">
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                            <Package className="w-4 h-4 text-emerald-600" />
                            Top Supplies
                          </h4>
                          <div className="space-y-1 text-sm">
                            {rec.supply_recommendations?.slice(0, 2).map((s, i) => (
                              <div key={i} className="flex justify-between">
                                <span className="truncate">{s.item_name}</span>
                                <span className="font-semibold">{s.recommended_stock}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {rec.notes && (
                        <div className="bg-amber-100 rounded-lg p-3 mb-4">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                            <p className="text-sm text-amber-800">{rec.notes}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Est. Cost: ₹{((rec.estimated_cost || 0) / 100000).toFixed(1)} Lakhs
                        </span>
                        <Button onClick={() => acknowledgeRec.mutate(rec)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Acknowledge
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}