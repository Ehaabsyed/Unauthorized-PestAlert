'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Maria Santos',
    role: 'Rice Farmer, Philippines',
    content: 'AgriTech Sentinel detected a pest outbreak 3 days before it would have devastated my crops. The AI accuracy is incredible.',
    rating: 5,
    initials: 'MS',
  },
  {
    name: 'John Okonkwo',
    role: 'Agricultural Director, Nigeria',
    content: 'We implemented this across 50 farms. Crop losses reduced by 40% in the first season. The real-time alerts are game-changing.',
    rating: 5,
    initials: 'JO',
  },
  {
    name: 'Priya Sharma',
    role: 'Organic Farm Owner, India',
    content: 'The weather integration and smart irrigation recommendations have cut our water usage by 30% while improving yield.',
    rating: 5,
    initials: 'PS',
  },
  {
    name: 'Carlos Rodriguez',
    role: 'Vineyard Manager, Spain',
    content: 'The community feature connected me with experts who helped identify a rare fungal disease. Saved my entire harvest.',
    rating: 5,
    initials: 'CR',
  },
  {
    name: 'Sarah Williams',
    role: 'Dairy Farmer, New Zealand',
    content: 'Simple to use, powerful results. The mobile app notifications keep me informed even when I am in the field.',
    rating: 5,
    initials: 'SW',
  },
  {
    name: 'Ahmed Hassan',
    role: 'Cotton Producer, Egypt',
    content: 'The satellite imagery feature helped us optimize our planting patterns. Best agricultural investment we have made.',
    rating: 5,
    initials: 'AH',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-background">
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
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Trusted by Farmers Worldwide
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Join thousands of farmers who have transformed their operations with AI-powered insights.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>
                  
                  {/* Content */}
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
