'use client'

import { motion } from 'framer-motion'
import { 
  Bug, 
  Droplets, 
  AlertTriangle, 
  Satellite, 
  LineChart, 
  Users,
  ArrowRight
} from 'lucide-react'

const features = [
  {
    icon: Bug,
    title: 'AI Pest Detection',
    description: 'Upload images and get instant AI-powered pest identification with treatment recommendations.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Droplets,
    title: 'Smart Irrigation',
    description: 'Optimize water usage with intelligent recommendations based on soil and weather data.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Alerts',
    description: 'Receive instant SMS notifications for pest outbreaks and weather emergencies.',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    icon: Satellite,
    title: 'Satellite Intelligence',
    description: 'Access satellite imagery for comprehensive field analysis and crop health monitoring.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: LineChart,
    title: 'Live Crop Monitoring',
    description: 'Track crop health metrics in real-time with beautiful analytics dashboards.',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    icon: Users,
    title: 'Farmer Community',
    description: 'Connect with fellow farmers, share insights, and get expert advice from the community.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Protect Your Farm
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Comprehensive tools powered by artificial intelligence to monitor, detect, and respond to agricultural threats.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
