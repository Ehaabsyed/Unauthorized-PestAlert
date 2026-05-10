'use client';

import { AlertTriangle, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface FarmingRecommendation {
  level: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
}

interface FarmingRecommendationsProps {
  temp: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  condition: string;
  precipitation: number;
}

export function FarmingRecommendations({
  temp,
  humidity,
  windSpeed,
  uvIndex,
  condition,
  precipitation,
}: FarmingRecommendationsProps) {
  const recommendations: FarmingRecommendation[] = [];

  // Temperature recommendations
  if (temp > 35) {
    recommendations.push({
      level: 'critical',
      title: 'High Temperature Alert',
      description: `Extreme heat (${temp}°C). Increase irrigation frequency and provide shade for sensitive crops.`,
    });
  } else if (temp < 0) {
    recommendations.push({
      level: 'critical',
      title: 'Frost Warning',
      description: `Freezing temperature (${temp}°C). Protect sensitive plants and consider frost protection measures.`,
    });
  } else if (temp < 5) {
    recommendations.push({
      level: 'warning',
      title: 'Cold Temperature',
      description: 'Reduced growth expected. Delay planting sensitive crops.',
    });
  }

  // Humidity recommendations
  if (humidity > 80) {
    recommendations.push({
      level: 'warning',
      title: 'High Humidity Risk',
      description: 'High humidity increases fungal disease risk. Ensure good air circulation and consider preventive spraying.',
    });
  } else if (humidity < 30) {
    recommendations.push({
      level: 'info',
      title: 'Low Humidity',
      description: 'Dry conditions may increase irrigation needs and risk of pest infestations.',
    });
  }

  // Wind recommendations
  if (windSpeed > 40) {
    recommendations.push({
      level: 'critical',
      title: 'Strong Wind Alert',
      description: 'High wind speeds may damage crops and drift pesticides. Avoid spraying.',
    });
  } else if (windSpeed > 25) {
    recommendations.push({
      level: 'warning',
      title: 'Moderate Wind',
      description: 'Wind may affect pesticide application. Use appropriate drift-reduction techniques.',
    });
  }

  // UV index recommendations
  if (uvIndex > 8) {
    recommendations.push({
      level: 'warning',
      title: 'High UV Index',
      description: 'Strong UV radiation. Provide shade for sensitive crops to prevent sun damage.',
    });
  }

  // Precipitation recommendations
  if (precipitation > 10) {
    recommendations.push({
      level: 'info',
      title: 'Heavy Rainfall Expected',
      description: 'Heavy rain expected. Postpone pesticide/fertilizer applications.',
    });
  }

  // Favorable conditions
  if (
    temp >= 15 &&
    temp <= 30 &&
    humidity >= 40 &&
    humidity <= 70 &&
    windSpeed <= 15 &&
    ['Clear', 'Clouds'].includes(condition)
  ) {
    recommendations.push({
      level: 'success',
      title: 'Optimal Growing Conditions',
      description: 'Excellent conditions for crop growth and field work. Good day for planting or spraying.',
    });
  }

  const getIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'info':
        return <Lightbulb className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBgColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'success':
        return 'bg-green-500/10 border-green-500/30';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30';
    }
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {recommendations.map((rec, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`p-4 rounded-lg border backdrop-blur-md ${getBgColor(rec.level)}`}
        >
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">{getIcon(rec.level)}</div>
            <div>
              <h4 className="font-medium text-slate-100">{rec.title}</h4>
              <p className="text-sm text-slate-300 mt-1">{rec.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
