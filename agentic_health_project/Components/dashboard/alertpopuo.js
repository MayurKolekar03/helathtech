import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function AlertPopup({ alert, onDismiss }) {
  if (!alert) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, x: 50 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 z-50 max-w-sm"
      >
        <div className="bg-red-600 text-white rounded-xl shadow-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-500 rounded-lg flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold">{alert.title || 'Critical Alert'}</h4>
              <p className="text-sm text-red-100 mt-1 line-clamp-2">
                {alert.message?.substring(0, 100)}...
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-red-500 flex-shrink-0"
              onClick={() => onDismiss(alert)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}