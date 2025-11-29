import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Wind, 
  AlertTriangle,
  TrendingUp,
  Loader2,
  Sparkles,
  Thermometer,
  Droplets,
  Users,
  Building2,
  RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import StatsCard from '../components/dashboard/StatsCard';
import RiskMeter from '../components/dashboard/RiskMeter';
import AQIChart from '../components/dashboard/AQIChart';
import PredictionChart from '../components/dashboard/PredictionChart';
import AlertsList from '../components/dashboard/AlertsList';
import ContributingFactors from '../components/dashboard/ContributingFactors';
import LikelyConditions from '../components/dashboard/LikelyConditions';
import { 
  fetchRealTimeAQIWeather, 
  generateAIPrediction, 
  generateResourceRecommendations,
  saveAQIData, 
  savePrediction,
  saveResourceRecommendation,
  createAlert
} from '../components/api/RealTimeDataService';

const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

export default function Dashboard() {
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch AQI/Weather Data
  const { data: aqiData = [], isLoading: loadingAQI } = useQuery({
    queryKey: ['aqi', selectedCity],
    queryFn: () => base44.entities.AQIWeatherData.filter({ city: selectedCity }, '-recorded_at', 7)
  });

  // Fetch Predictions
  const { data: predictions = [], isLoading: loadingPredictions } = useQuery({
    queryKey: ['predictions', selectedCity],
    queryFn: () => base44.entities.SurgePrediction.filter({ city: selectedCity }, '-prediction_date', 7)
  });

  // Fetch Alerts
  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts', selectedCity],
    queryFn: () => base44.entities.Alert.filter({ city: selectedCity, is_acknowledged: false }, '-created_date', 10)
  });

  // Fetch Symptom Reports Count
  const { data: symptomReports = [] } = useQuery({
    queryKey: ['symptoms', selectedCity],
    queryFn: () => base44.entities.SymptomReport.filter({ location_city: selectedCity }, '-created_date', 100)
  });

  // Acknowledge Alert Mutation
  const acknowledgeAlert = useMutation({
    mutationFn: (alert) => base44.entities.Alert.update(alert.id, { 
      is_acknowledged: true,
      acknowledged_at: new Date().toISOString()
    }),
    onSuccess: () => queryClient.invalidateQueries(['alerts'])
  });

  // Calculate stats
  const latestPrediction = predictions[0];
  const latestAQI = aqiData[0];
  const todaySymptoms = symptomReports.filter(s => {
    const today = new Date().toDateString();
    return new Date(s.created_date).toDateString() === today;
  });

  const getRiskLevel = () => latestPrediction?.risk_level || 'low';
  const getRiskScore = () => {
    const levelScores = { low: 25, medium: 50, high: 75, critical: 95 };
    return levelScores[latestPrediction?.risk_level] || 25;
  };

  // Fetch real-time data from APIs
  const fetchRealTimeData = async () => {
    setIsRefreshing(true);
    toast.info(`Fetching real-time data for ${selectedCity}...`);
    
    try {
      // Step 1: Fetch real-time AQI and weather
      const aqiResult = await fetchRealTimeAQIWeather(selectedCity);
      
      if (aqiResult) {
        await saveAQIData(aqiResult);
        toast.success('AQI & Weather data updated!');
        
        // Step 2: Fetch events for context
        const events = await base44.entities.EventCalendar.filter(
          { affected_cities: selectedCity }, 
          'start_date', 
          5
        );
        
        // Step 3: Generate AI prediction
        const prediction = await generateAIPrediction(selectedCity, aqiResult, events);
        
        if (prediction) {
          await savePrediction(prediction, selectedCity);
          toast.success('Surge prediction generated!');
          
          // Step 4: Generate resource recommendations if risk is high
          if (prediction.overall_risk === 'high' || prediction.overall_risk === 'critical') {
            const recommendations = await generateResourceRecommendations(selectedCity, prediction, aqiResult);
            if (recommendations) {
              await saveResourceRecommendation(recommendations, selectedCity);
              toast.success('Resource recommendations created!');
            }
            
            // Create alert for high risk
            await createAlert({
              title: `${prediction.overall_risk.toUpperCase()} Risk Alert - ${selectedCity}`,
              message: prediction.summary || `Surge predicted: ${prediction.predictions?.[0]?.predicted_cases} cases expected. ${prediction.likely_conditions?.[0]?.condition} cases likely to increase.`,
              alert_type: 'surge_warning',
              severity: prediction.overall_risk === 'critical' ? 'critical' : 'warning',
              city: selectedCity
            });
          }
          
          // Create pollution alert if AQI > 300
          if (aqiResult.aqi > 300) {
            await createAlert({
              title: `Hazardous Air Quality - ${selectedCity}`,
              message: `AQI has reached ${aqiResult.aqi} (${aqiResult.aqi_category}). Expected surge in respiratory cases. Hospitals should prepare additional oxygen supplies and pulmonology staff.`,
              alert_type: 'pollution_alert',
              severity: 'critical',
              city: selectedCity
            });
          }
        }
      }
      
      toast.success('All data refreshed successfully!');
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      toast.error('Failed to fetch some data. Please try again.');
    } finally {
      setIsRefreshing(false);
      queryClient.invalidateQueries(['aqi']);
      queryClient.invalidateQueries(['predictions']);
      queryClient.invalidateQueries(['alerts']);
      queryClient.invalidateQueries(['symptoms']);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Surge Forecasting Dashboard</h1>
            <p className="text-gray-500 mt-1">Real-time AI-powered patient surge predictions</p>
          </div>
          <div className="flex items-center gap-3">
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
            <Button 
              onClick={fetchRealTimeData}
              disabled={isRefreshing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
            >
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isRefreshing ? 'Analyzing...' : 'Fetch Live Data'}
            </Button>
          </div>
        </div>

        {/* Live Data Banner */}
        {latestAQI && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Wind className={`w-5 h-5 ${latestAQI.aqi > 200 ? 'text-red-500' : latestAQI.aqi > 100 ? 'text-amber-500' : 'text-emerald-500'}`} />
                  <span className="font-semibold">AQI: {latestAQI.aqi}</span>
                  <span className="text-sm text-gray-500">({latestAQI.aqi_category?.replace(/_/g, ' ')})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                  <span>{latestAQI.temperature_celsius}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span>{latestAQI.humidity_percent}%</span>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                Updated: {new Date(latestAQI.recorded_at).toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Predicted Cases"
            value={latestPrediction?.predicted_cases || '-'}
            subtitle={latestPrediction ? `±${Math.abs(latestPrediction.predicted_cases_upper - latestPrediction.predicted_cases)}` : ''}
            icon={TrendingUp}
            color="blue"
            trend={latestPrediction?.surge_factor > 1.2 ? 'up' : 'down'}
            trendValue={latestPrediction ? `${((latestPrediction.surge_factor - 1) * 100).toFixed(0)}% surge` : ''}
          />
          <StatsCard
            title="Current AQI"
            value={latestAQI?.aqi || '-'}
            subtitle={latestAQI?.weather_condition || 'N/A'}
            icon={Wind}
            color={latestAQI?.aqi > 200 ? 'red' : latestAQI?.aqi > 100 ? 'orange' : 'green'}
          />
          <StatsCard
            title="Today's Reports"
            value={todaySymptoms.length}
            subtitle="symptom reports"
            icon={Activity}
            color="purple"
          />
          <StatsCard
            title="Active Alerts"
            value={alerts.filter(a => !a.is_acknowledged).length}
            subtitle="requiring attention"
            icon={AlertTriangle}
            color={alerts.length > 3 ? 'red' : 'amber'}
          />
        </div>

        {/* Risk Meter */}
        <div className="mb-6">
          <RiskMeter level={getRiskLevel()} score={getRiskScore()} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AQIChart data={aqiData} />
          <PredictionChart predictions={predictions} />
        </div>

        {/* Analysis Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ContributingFactors 
            factors={latestPrediction?.contributing_factors || [
              { factor: 'AQI Level', impact_score: 0.75 },
              { factor: 'Temperature', impact_score: 0.45 },
              { factor: 'Seasonal Factors', impact_score: 0.30 }
            ]} 
          />
          <LikelyConditions 
            conditions={latestPrediction?.likely_conditions || [
              { condition: 'Respiratory Infections', probability: 0.65, expected_cases: 120 },
              { condition: 'Asthma Exacerbations', probability: 0.45, expected_cases: 85 }
            ]} 
          />
          <AlertsList 
            alerts={alerts}
            onAcknowledge={(alert) => acknowledgeAlert.mutate(alert)}
            onDismiss={(alert) => acknowledgeAlert.mutate(alert)}
          />
        </div>

        {/* Loading Overlay */}
        {(loadingAQI || loadingPredictions) && (
          <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm text-gray-600">Loading data...</span>
          </div>
        )}
      </div>
    </div>
  );
}