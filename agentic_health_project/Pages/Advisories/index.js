import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Search,
  Globe,
  Loader2,
  Volume2,
  VolumeX,
  Filter,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateHealthAdvisory, saveAdvisory } from '../components/api/RealTimeDataService';
import { toast } from "sonner";

const CITIES = ['All', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'];
const TYPES = ['all', 'health', 'pollution', 'weather', 'epidemic', 'festival'];

const SEVERITY_COLORS = {
  low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  medium: 'bg-amber-100 text-amber-800 border-amber-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

const TYPE_ICONS = {
  health: '🏥',
  pollution: '🌫️',
  weather: '🌡️',
  epidemic: '🦠',
  festival: '🎉',
  general: '📢'
};

export default function Advisories() {
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const { data: advisories = [], isLoading } = useQuery({
    queryKey: ['advisories'],
    queryFn: () => base44.entities.Advisory.filter({ is_active: true }, '-created_date', 50)
  });

  const filteredAdvisories = advisories.filter(adv => {
    const matchesCity = selectedCity === 'All' || adv.city === selectedCity;
    const matchesType = selectedType === 'all' || adv.advisory_type === selectedType;
    const matchesSearch = !searchTerm || 
      adv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adv.content?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCity && matchesType && matchesSearch;
  });

  const criticalAdvisories = filteredAdvisories.filter(a => a.severity === 'critical' || a.severity === 'high');
  const otherAdvisories = filteredAdvisories.filter(a => a.severity !== 'critical' && a.severity !== 'high');

  const speakAdvisory = (advisory) => {
    if (speakingId === advisory.id) {
      window.speechSynthesis?.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis?.cancel();
    const text = language === 'hi' && advisory.content_hindi 
      ? `${advisory.title}. ${advisory.content_hindi}`
      : `${advisory.title}. ${advisory.content}`;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    
    utterance.onstart = () => setSpeakingId(advisory.id);
    utterance.onend = () => setSpeakingId(null);
    
    window.speechSynthesis.speak(utterance);
  };

  const generateNewAdvisory = async () => {
    if (selectedCity === 'All') {
      toast.error('Please select a specific city');
      return;
    }
    
    setIsGenerating(true);
    toast.info('Generating advisory with AI...');
    
    try {
      const advisory = await generateHealthAdvisory(selectedCity, null, 'medium', ['General Health']);
      if (advisory) {
        await saveAdvisory(advisory);
        queryClient.invalidateQueries(['advisories']);
        toast.success('New advisory generated!');
      }
    } catch (error) {
      toast.error('Failed to generate advisory');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="w-8 h-8 text-emerald-600" />
              Health Advisories
            </h1>
            <p className="text-gray-500 mt-1">Multilingual health alerts with voice support</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-28">
                <Globe className="w-4 h-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={generateNewAdvisory}
              disabled={isGenerating || selectedCity === 'All'}
              className="bg-gradient-to-r from-emerald-600 to-teal-600"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search advisories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-36">
              <Filter className="w-4 h-4 mr-1" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map(type => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type === 'all' ? 'All Types' : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <>
            {/* Critical Advisories */}
            {criticalAdvisories.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  Critical Advisories
                </h2>
                <div className="space-y-3">
                  {criticalAdvisories.map((advisory) => (
                    <AdvisoryCard
                      key={advisory.id}
                      advisory={advisory}
                      language={language}
                      expanded={expandedId === advisory.id}
                      speaking={speakingId === advisory.id}
                      onToggle={() => setExpandedId(expandedId === advisory.id ? null : advisory.id)}
                      onSpeak={() => speakAdvisory(advisory)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Advisories */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                {criticalAdvisories.length > 0 ? 'Other Advisories' : 'All Advisories'}
              </h2>
              <div className="space-y-3">
                {otherAdvisories.map((advisory) => (
                  <AdvisoryCard
                    key={advisory.id}
                    advisory={advisory}
                    language={language}
                    expanded={expandedId === advisory.id}
                    speaking={speakingId === advisory.id}
                    onToggle={() => setExpandedId(expandedId === advisory.id ? null : advisory.id)}
                    onSpeak={() => speakAdvisory(advisory)}
                  />
                ))}
              </div>
            </div>

            {filteredAdvisories.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No advisories found</p>
                <p className="text-sm mt-1">Try adjusting filters or generate a new advisory</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AdvisoryCard({ advisory, language, expanded, speaking, onToggle, onSpeak }) {
  const content = language === 'hi' && advisory.content_hindi ? advisory.content_hindi : advisory.content;
  const precautions = language === 'hi' && advisory.precautions_hindi?.length 
    ? advisory.precautions_hindi 
    : advisory.precautions;

  return (
    <motion.div layout>
      <Card className={`overflow-hidden ${advisory.severity === 'critical' ? 'border-red-200 bg-red-50/50' : ''}`}>
        <CardHeader className="pb-2 cursor-pointer" onClick={onToggle}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{TYPE_ICONS[advisory.advisory_type] || TYPE_ICONS.general}</span>
              <div>
                <CardTitle className="text-lg">{advisory.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  {advisory.city && (
                    <Badge variant="outline" className="text-xs">{advisory.city}</Badge>
                  )}
                  <Badge className={SEVERITY_COLORS[advisory.severity] || SEVERITY_COLORS.medium}>
                    {advisory.severity?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => { e.stopPropagation(); onSpeak(); }}
              >
                {speaking ? (
                  <VolumeX className="w-4 h-4 text-red-500" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <CardContent className="pt-0">
                <p className="text-gray-700 mb-4">{content}</p>
                
                {precautions?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">
                      {language === 'hi' ? 'सावधानियां:' : 'Precautions:'}
                    </h4>
                    <ul className="space-y-1">
                      {precautions.map((p, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-emerald-500">•</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {advisory.symptoms_to_watch?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">
                      {language === 'hi' ? 'देखने योग्य लक्षण:' : 'Symptoms to Watch:'}
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {advisory.symptoms_to_watch.map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-4 mt-4 pt-4 border-t text-xs text-gray-500">
                  {advisory.valid_from && <span>From: {advisory.valid_from}</span>}
                  {advisory.valid_until && <span>Until: {advisory.valid_until}</span>}
                  {advisory.source && <span>Source: {advisory.source}</span>}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}