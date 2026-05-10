'use client';

import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: 'temp' | 'humidity' | 'wind' | 'pressure' | 'visibility' | 'condition';
  description?: string;
  alert?: boolean;
}

export function WeatherCard({ title, value, unit, icon, description, alert }: WeatherCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'temp':
        return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'humidity':
        return <Droplets className="w-8 h-8 text-blue-400" />;
      case 'wind':
        return <Wind className="w-8 h-8 text-cyan-400" />;
      case 'pressure':
        return <Gauge className="w-8 h-8 text-purple-400" />;
      case 'visibility':
        return <Eye className="w-8 h-8 text-indigo-400" />;
      case 'condition':
        return <CloudRain className="w-8 h-8 text-slate-400" />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`p-6 rounded-xl backdrop-blur-md border transition-all ${
        alert
          ? 'bg-red-500/10 border-red-500/30 shadow-lg shadow-red-500/20'
          : 'bg-slate-900/40 border-slate-700/50 hover:border-slate-600/50'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        </div>
        {getIcon()}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-100">{value}</span>
        {unit && <span className="text-sm text-slate-400">{unit}</span>}
      </div>
    </motion.div>
  );
}
