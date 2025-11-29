// Real-time data fetching service using AI with internet access
import { base44 } from '@/api/base44Client';

// City coordinates for reference
const CITY_DATA = {
  'Delhi': { lat: 28.6139, lon: 77.2090, population: 32000000, hospitals: 45 },
  'Mumbai': { lat: 19.0760, lon: 72.8777, population: 21000000, hospitals: 38 },
  'Bangalore': { lat: 12.9716, lon: 77.5946, population: 12000000, hospitals: 28 },
  'Chennai': { lat: 13.0827, lon: 80.2707, population: 11000000, hospitals: 25 },
  'Kolkata': { lat: 22.5726, lon: 88.3639, population: 15000000, hospitals: 30 },
  'Hyderabad': { lat: 17.3850, lon: 78.4867, population: 10000000, hospitals: 22 },
  'Pune': { lat: 18.5204, lon: 73.8567, population: 7000000, hospitals: 18 },
  'Ahmedabad': { lat: 23.0225, lon: 72.5714, population: 8000000, hospitals: 20 },
  'Jaipur': { lat: 26.9124, lon: 75.7873, population: 4000000, hospitals: 15 },
  'Lucknow': { lat: 26.8467, lon: 80.9462, population: 3500000, hospitals: 14 }
};

// Base daily cases by city (historical average)
const BASE_DAILY_CASES = {
  'Delhi': 450, 'Mumbai': 380, 'Bangalore': 280, 'Chennai': 260,
  'Kolkata': 320, 'Hyderabad': 250, 'Pune': 200, 'Ahmedabad': 220,
  'Jaipur': 180, 'Lucknow': 200
};

// Fetch real-time AQI and weather data using AI with internet access
export async function fetchRealTimeAQIWeather(city) {
  try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Get the CURRENT real-time air quality and weather data for ${city}, India RIGHT NOW.

Search for the latest data from sources like:
- IQAir
- CPCB (Central Pollution Control Board)
- AccuWeather
- Weather.com

Provide ONLY current real-time data:
- Current AQI value (0-500 scale)
- PM2.5 level (μg/m³)
- PM10 level (μg/m³)
- NO2, SO2, CO, O3 levels if available
- Current temperature in Celsius
- Current humidity percentage
- Wind speed in km/h
- Weather condition (Clear/Cloudy/Rain/Fog/Haze etc)
- Visibility in km

IMPORTANT: Use actual current data, not estimates.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          city: { type: "string" },
          aqi: { type: "number" },
          aqi_category: { type: "string", enum: ["good", "moderate", "unhealthy_sensitive", "unhealthy", "very_unhealthy", "hazardous"] },
          pm25: { type: "number" },
          pm10: { type: "number" },
          no2: { type: "number" },
          so2: { type: "number" },
          co: { type: "number" },
          o3: { type: "number" },
          temperature_celsius: { type: "number" },
          humidity_percent: { type: "number" },
          wind_speed_kmh: { type: "number" },
          wind_direction: { type: "string" },
          weather_condition: { type: "string" },
          visibility_km: { type: "number" },
          uv_index: { type: "number" },
          data_source: { type: "string" }
        }
      }
    });

    return {
      ...result,
      city: city,
      recorded_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    return null;
  }
}

// Fetch disease outbreak and health alerts
export async function fetchDiseaseOutbreakData(city) {
  try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Get current health and disease information for ${city}, India.

Search for:
- Current disease outbreaks or epidemics
- Seasonal diseases prevalent right now
- Any public health alerts or warnings
- Hospital capacity concerns

Sources to check:
- IDSP (Integrated Disease Surveillance Programme)
- WHO India updates
- State health department advisories
- Local news health reports

Provide factual, current information only.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          city: { type: "string" },
          active_outbreaks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                disease: { type: "string" },
                severity: { type: "string" },
                cases_reported: { type: "number" },
                trend: { type: "string" }
              }
            }
          },
          seasonal_diseases: { type: "array", items: { type: "string" } },
          health_alerts: { type: "array", items: { type: "string" } },
          risk_level: { type: "string" },
          recommendations: { type: "array", items: { type: "string" } }
        }
      }
    });

    return result;
  } catch (error) {
    console.error('Error fetching disease data:', error);
    return null;
  }
}

// Generate AI-powered surge prediction
export async function generateAIPrediction(city, aqiData, events) {
  const baseCase = BASE_DAILY_CASES[city] || 250;
  const cityInfo = CITY_DATA[city] || {};
  
  try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a healthcare surge prediction AI for ${city}, India.

CURRENT CONDITIONS:
- City Population: ${cityInfo.population?.toLocaleString() || '5,000,000'}
- Base Daily Hospital Cases: ${baseCase}
- Current AQI: ${aqiData?.aqi || 'Unknown'}
- AQI Category: ${aqiData?.aqi_category || 'Unknown'}
- Temperature: ${aqiData?.temperature_celsius || 'Unknown'}°C
- Weather: ${aqiData?.weather_condition || 'Unknown'}
- Humidity: ${aqiData?.humidity_percent || 'Unknown'}%
- Upcoming Events: ${events?.map(e => `${e.event_name} (${e.event_type})`).join(', ') || 'None'}

PREDICTION MODEL RULES:
1. Start with base daily cases: ${baseCase}
2. AQI Impact: Every 50 AQI above 100 = +15% respiratory cases
3. Cold weather (<15°C) = +10% respiratory cases
4. High humidity (>80%) = +8% viral infections
5. Festivals = +25-40% surge depending on type
6. Pollution events = +30-50% respiratory surge

Generate 7-day predictions with:
- Daily predicted case counts
- Confidence intervals (±15-25%)
- Risk level per day
- Primary health conditions expected
- Contributing factors with impact scores

Be realistic and data-driven.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          predictions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                day: { type: "number" },
                date: { type: "string" },
                predicted_cases: { type: "number" },
                predicted_cases_lower: { type: "number" },
                predicted_cases_upper: { type: "number" },
                risk_level: { type: "string" },
                confidence_score: { type: "number" },
                primary_conditions: { type: "array", items: { type: "string" } }
              }
            }
          },
          contributing_factors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                factor: { type: "string" },
                impact_score: { type: "number" },
                description: { type: "string" }
              }
            }
          },
          likely_conditions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                condition: { type: "string" },
                probability: { type: "number" },
                expected_cases: { type: "number" }
              }
            }
          },
          overall_risk: { type: "string" },
          summary: { type: "string" }
        }
      }
    });

    return result;
  } catch (error) {
    console.error('Error generating prediction:', error);
    return null;
  }
}

// Generate staffing and supply recommendations
export async function generateResourceRecommendations(city, prediction, aqiData) {
  const baseCase = BASE_DAILY_CASES[city] || 250;
  const surgePercent = prediction?.predictions?.[0]?.predicted_cases 
    ? ((prediction.predictions[0].predicted_cases - baseCase) / baseCase * 100).toFixed(0)
    : 20;

  try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate resource recommendations for ${city} hospitals.

SURGE ANALYSIS:
- Base daily cases: ${baseCase}
- Predicted surge: ${surgePercent}%
- Risk level: ${prediction?.overall_risk || 'medium'}
- Primary conditions: ${prediction?.likely_conditions?.map(c => c.condition).join(', ') || 'Respiratory, Viral'}
- Current AQI: ${aqiData?.aqi || 'Unknown'}

STAFFING FORMULAS:
- 1 additional doctor per 15 surge patients
- 1 additional nurse per 8 surge patients
- 1 support staff per 12 surge patients
- Specialists based on conditions (Pulmonologist for AQI surge)

SUPPLY FORMULAS:
- Oxygen cylinders: 1 per 5 respiratory cases
- N95 masks: 50 per healthcare worker per week
- PPE kits: 20 per shift during high-risk periods
- Nebulizers: 1 per 20 respiratory cases

Calculate specific numbers and provide actionable recommendations.`,
      response_json_schema: {
        type: "object",
        properties: {
          staffing: {
            type: "object",
            properties: {
              additional_doctors: { type: "number" },
              additional_nurses: { type: "number" },
              additional_support_staff: { type: "number" },
              specialists_needed: { type: "array", items: { type: "string" } }
            }
          },
          supplies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                item_name: { type: "string" },
                current_recommended: { type: "number" },
                surge_recommended: { type: "number" },
                urgency: { type: "string" }
              }
            }
          },
          beds: {
            type: "object",
            properties: {
              additional_general: { type: "number" },
              additional_icu: { type: "number" },
              additional_emergency: { type: "number" }
            }
          },
          estimated_cost_inr: { type: "number" },
          priority: { type: "string" },
          action_items: { type: "array", items: { type: "string" } }
        }
      }
    });

    return result;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return null;
  }
}

// Generate health advisory in multiple languages
export async function generateHealthAdvisory(city, aqiData, severity, conditions) {
  try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a public health advisory for ${city}, India.

CONDITIONS:
- Current AQI: ${aqiData?.aqi || 'Unknown'} (${aqiData?.aqi_category || 'Unknown'})
- Temperature: ${aqiData?.temperature_celsius || 'Unknown'}°C
- Weather: ${aqiData?.weather_condition || 'Unknown'}
- Severity Level: ${severity || 'medium'}
- Health Concerns: ${conditions?.join(', ') || 'General health'}

Create a clear, actionable advisory:
1. Write in simple language for general public
2. Include BOTH English and Hindi versions
3. List specific precautions (5-7 items)
4. List symptoms to watch for
5. Identify who is most at risk
6. Include emergency contact recommendations

Make it practical and easy to understand.`,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          title_hindi: { type: "string" },
          content: { type: "string" },
          content_hindi: { type: "string" },
          advisory_type: { type: "string" },
          severity: { type: "string" },
          precautions: { type: "array", items: { type: "string" } },
          precautions_hindi: { type: "array", items: { type: "string" } },
          symptoms_to_watch: { type: "array", items: { type: "string" } },
          at_risk_groups: { type: "array", items: { type: "string" } },
          emergency_actions: { type: "array", items: { type: "string" } }
        }
      }
    });

    return {
      ...result,
      city: city,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      is_active: true,
      source: 'SurgeCast AI'
    };
  } catch (error) {
    console.error('Error generating advisory:', error);
    return null;
  }
}

// Save functions
export async function saveAQIData(data) {
  try {
    await base44.entities.AQIWeatherData.create(data);
    return true;
  } catch (error) {
    console.error('Error saving AQI data:', error);
    return false;
  }
}

export async function savePrediction(prediction, city) {
  try {
    const predictionData = {
      city: city,
      prediction_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      prediction_horizon_days: 7,
      predicted_cases: prediction.predictions?.[0]?.predicted_cases || 0,
      predicted_cases_lower: prediction.predictions?.[0]?.predicted_cases_lower || 0,
      predicted_cases_upper: prediction.predictions?.[0]?.predicted_cases_upper || 0,
      baseline_cases: BASE_DAILY_CASES[city] || 250,
      surge_factor: prediction.predictions?.[0]?.predicted_cases / (BASE_DAILY_CASES[city] || 250) || 1,
      risk_level: prediction.overall_risk || prediction.predictions?.[0]?.risk_level || 'medium',
      confidence_score: prediction.predictions?.[0]?.confidence_score || 0.75,
      contributing_factors: prediction.contributing_factors || [],
      likely_conditions: prediction.likely_conditions || [],
      model_version: 'SurgeCast-AI-v4.0'
    };
    
    await base44.entities.SurgePrediction.create(predictionData);
    return true;
  } catch (error) {
    console.error('Error saving prediction:', error);
    return false;
  }
}

export async function saveAdvisory(advisory) {
  try {
    await base44.entities.Advisory.create({
      title: advisory.title,
      content: advisory.content,
      content_hindi: advisory.content_hindi,
      advisory_type: advisory.advisory_type || 'health',
      target_audience: 'public',
      city: advisory.city,
      severity: advisory.severity || 'medium',
      valid_from: advisory.valid_from,
      valid_until: advisory.valid_until,
      precautions: advisory.precautions,
      symptoms_to_watch: advisory.symptoms_to_watch,
      is_active: true,
      source: advisory.source || 'SurgeCast AI'
    });
    return true;
  } catch (error) {
    console.error('Error saving advisory:', error);
    return false;
  }
}

export async function saveResourceRecommendation(recommendation, city) {
  try {
    await base44.entities.ResourceRecommendation.create({
      city: city,
      recommendation_date: new Date().toISOString().split('T')[0],
      valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: recommendation.priority || 'medium',
      staffing_recommendations: recommendation.staffing,
      supply_recommendations: recommendation.supplies?.map(s => ({
        item_name: s.item_name,
        current_stock: s.current_recommended,
        recommended_stock: s.surge_recommended,
        urgency: s.urgency
      })),
      bed_recommendations: recommendation.beds,
      estimated_cost: recommendation.estimated_cost_inr,
      status: 'pending',
      notes: recommendation.action_items?.join('. ')
    });
    return true;
  } catch (error) {
    console.error('Error saving recommendation:', error);
    return false;
  }
}

export async function createAlert(alertData) {
  try {
    await base44.entities.Alert.create({
      title: alertData.title,
      message: alertData.message,
      alert_type: alertData.alert_type,
      severity: alertData.severity,
      city: alertData.city,
      is_read: false,
      is_acknowledged: false,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error creating alert:', error);
    return false;
  }
}