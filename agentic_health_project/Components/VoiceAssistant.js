import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Mic, Globe, Loader2, StopCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function VoiceAssistant({ advisory, onClose }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getContent = () => {
    if (!advisory) return '';
    
    if (language === 'hi' && advisory.content_hindi) {
      return `${advisory.title}. ${advisory.content_hindi}. ${
        advisory.precautions?.length > 0 
          ? 'सावधानियां: ' + advisory.precautions.join('. ') 
          : ''
      }`;
    }
    
    return `${advisory.title}. ${advisory.content}. ${
      advisory.precautions?.length > 0 
        ? 'Precautions: ' + advisory.precautions.join('. ') 
        : ''
    }`;
  };

  const speak = () => {
    if (!window.speechSynthesis) {
      alert('Speech synthesis not supported in your browser');
      return;
    }

    window.speechSynthesis.cancel();
    setIsLoading(true);

    const text = getContent();
    const newUtterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    newUtterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    newUtterance.rate = 0.9;
    newUtterance.pitch = 1;
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => 
      language === 'hi' 
        ? v.lang.includes('hi') 
        : v.lang.includes('en')
    );
    if (targetVoice) {
      newUtterance.voice = targetVoice;
    }

    newUtterance.onstart = () => {
      setIsLoading(false);
      setIsSpeaking(true);
    };

    newUtterance.onend = () => {
      setIsSpeaking(false);
    };

    newUtterance.onerror = () => {
      setIsLoading(false);
      setIsSpeaking(false);
    };

    setUtterance(newUtterance);
    window.speechSynthesis.speak(newUtterance);
  };

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  if (!advisory) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Voice Assistant</h3>
            <p className="text-sm text-white/70">Listen to advisory in your language</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          onClick={onClose}
        >
          Close
        </Button>
      </div>

      <div className="bg-white/10 rounded-xl p-4 mb-4">
        <h4 className="font-medium mb-2">{advisory.title}</h4>
        <p className="text-sm text-white/80 line-clamp-3">
          {language === 'hi' && advisory.content_hindi ? advisory.content_hindi : advisory.content}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
            <Globe className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="hi">हिंदी</SelectItem>
          </SelectContent>
        </Select>

        {isSpeaking ? (
          <Button
            onClick={stop}
            className="flex-1 bg-red-500 hover:bg-red-600"
          >
            <StopCircle className="w-5 h-5 mr-2" />
            Stop
          </Button>
        ) : (
          <Button
            onClick={speak}
            disabled={isLoading}
            className="flex-1 bg-white text-indigo-700 hover:bg-white/90"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Volume2 className="w-5 h-5 mr-2" />
            )}
            {isLoading ? 'Loading...' : 'Play Advisory'}
          </Button>
        )}
      </div>

      {isSpeaking && (
        <div className="mt-4 flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: [8, 24, 8],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              className="w-1 bg-white/60 rounded-full"
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}