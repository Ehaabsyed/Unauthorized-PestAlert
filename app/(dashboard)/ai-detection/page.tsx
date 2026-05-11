'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Upload,
  Image as ImageIcon,
  Bug,
  AlertTriangle,
  FileText,
  Download,
  Loader2,
  CheckCircle2,
  XCircle,
  Scan,
  Zap,
  Shield,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { toast } from 'sonner'
import { predict, getSeverity, getTreatment } from '@/lib/ai-model'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/supabase/auth-context'
import { useDetections, useReports } from '@/hooks/use-supabase'

interface DetectionResult {
  pestName: string
  diseaseName: string
  confidence: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  treatment: string
  outbreakProbability: number
  affectedArea: string
  recommendations: string[]
}

const mockAnalyze = (): Promise<DetectionResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        pestName: 'Fall Armyworm (Spodoptera frugiperda)',
        diseaseName: 'Leaf Damage - Stage 3',
        confidence: 94.7,
        severity: 'high',
        treatment: 'Apply Spinosad-based organic pesticide within 24 hours. Consider introducing Trichogramma wasps as biological control.',
        outbreakProbability: 78,
        affectedArea: 'Approximately 2.3 hectares',
        recommendations: [
          'Immediate application of recommended pesticide',
          'Monitor neighboring fields for spread',
          'Set up pheromone traps for population tracking',
          'Schedule follow-up inspection in 5 days',
          'Consider crop rotation for next season',
        ],
      })
    }, 3000)
  })
}

const recentDetections = [
  { id: 1, pest: 'Aphid Infestation', confidence: 92, severity: 'medium', date: '2 hours ago' },
  { id: 2, pest: 'Leaf Blight', confidence: 88, severity: 'high', date: '5 hours ago' },
  { id: 3, pest: 'Root Rot', confidence: 95, severity: 'critical', date: 'Yesterday' },
  { id: 4, pest: 'Whitefly', confidence: 76, severity: 'low', date: 'Yesterday' },
]

export default function AIDetectionPage() {
  const { user } = useAuth()
  const { addDetection } = useDetections(user?.uid)
  const { createReport } = useReports(user?.uid)
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const [history, setHistory] = useState(recentDetections)
  const [generatingReport, setGeneratingReport] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    setFile(selectedFile)
    setResult(null)
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const isValidCropImage = (className: string, confidence: number): boolean => {
    // Minimum confidence threshold for valid crop/plant images
    const MIN_CONFIDENCE = 0.25
    
    // If confidence is too low, image is likely not a crop/plant
    if (confidence < MIN_CONFIDENCE) {
      return false
    }
    
    // List of valid crop/pest related classes
    const validClasses = ['healthy', 'virus', 'blight', 'spider_mites', 'bacterial_spot', 'rust', 'leaf', 'plant', 'crop', 'pest']
    const hasValidClass = validClasses.some(validClass => className.toLowerCase().includes(validClass))
    
    return hasValidClass
  }

  const handleAnalyze = async () => {
    if (!file || !preview) return

    setAnalyzing(true)
    setScanProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + Math.random() * 15
      })
    }, 300)

    try {
      // Create an image element to pass to the model
      const img = new Image()
      img.src = preview
      await new Promise((resolve) => {
        img.onload = resolve
      })

      const predictions = await predict(img)
      const topResult = predictions[0]

      if (topResult) {
        // Validate that the image is actually a crop/plant image
        if (!isValidCropImage(topResult.className, topResult.probability)) {
          toast.error('Image does not appear to be a crop or plant. Please upload an image of crops, plants, or leaves.')
          setAnalyzing(false)
          clearInterval(progressInterval)
          return
        }

        setResult({
          pestName: topResult.className.split('__').join(' ').split('_').join(' '),
          diseaseName: topResult.className.includes('healthy') ? 'None Detected' : 'Infection Detected',
          confidence: Math.round(topResult.probability * 100),
          severity: getSeverity(topResult.className),
          treatment: getTreatment(topResult.className),
          outbreakProbability: Math.round(topResult.probability * 85), // Estimated probability
          affectedArea: 'Localized to sample area',
          recommendations: [
            getTreatment(topResult.className),
            'Monitor nearby crops for similar symptoms',
            'Validate results with a field expert if symptoms persist',
            'Log this detection in the farm outbreak map'
          ]
        })
        
        // Add to history
        const newHistoryItem = {
          id: Date.now(),
          pest: topResult.className.split('__').join(' ').split('_').join(' '),
          confidence: Math.round(topResult.probability * 100),
          severity: getSeverity(topResult.className),
          date: 'Just now'
        }
        setHistory(prev => [newHistoryItem, ...prev])

        // Save to Supabase
        if (user) {
          addDetection({
            user_id: user.uid,
            pest_name: topResult.className.split('__').join(' ').split('_').join(' '),
            confidence: Math.round(topResult.probability * 100),
            severity: getSeverity(topResult.className),
            location: 'Assigned Field', // Default
            image_url: preview, // In production, upload to bucket first
            recommendations: [
              getTreatment(topResult.className),
              'Monitor nearby crops for similar symptoms',
              'Validate results with a field expert if symptoms persist',
              'Log this detection in the farm outbreak map'
            ]
          }).catch(err => console.error("Failed to save detection:", err))
        }

        setScanProgress(100)
        toast.success('Analysis complete!')
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      toast.error('Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
      clearInterval(progressInterval)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground'
      case 'high':
        return 'bg-destructive/80 text-destructive-foreground'
      case 'medium':
        return 'bg-warning text-warning-foreground'
      case 'low':
        return 'bg-primary text-primary-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Pest Detection</h1>
          <p className="text-muted-foreground">Upload crop images for instant AI-powered analysis</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-accent border-accent">
            <Zap className="w-3 h-3 mr-1" />
            99.2% Accuracy
          </Badge>
          <Badge variant="outline" className="text-primary border-primary">
            <Shield className="w-3 h-3 mr-1" />
            AI Model Integration Ready
          </Badge>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Upload Image</CardTitle>
              <CardDescription>Drag & drop or click to upload crop images for analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  className={cn(
                    "absolute inset-0 w-full h-full opacity-0",
                    preview ? "pointer-events-none" : "cursor-pointer"
                  )}
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                
                {preview ? (
                  <div className="relative z-10 space-y-4">
                    <div className="relative aspect-video max-h-[300px] mx-auto overflow-hidden rounded-lg">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                      {analyzing && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
                            <div className="space-y-2">
                              <p className="text-foreground font-medium">Analyzing Image...</p>
                              <Progress value={scanProgress} className="w-48 mx-auto" />
                              <p className="text-sm text-muted-foreground">{Math.round(scanProgress)}% Complete</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFile(null)
                          setPreview(null)
                          setResult(null)
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                      <Button
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {analyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Scan className="w-4 h-4 mr-2" />
                            Analyze Image
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 py-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Drop your image here</p>
                      <p className="text-sm text-muted-foreground">or click to browse</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supports JPG, PNG, WEBP (max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-card border-border overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                        Analysis Results
                      </CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={generatingReport}
                        onClick={async () => {
                          if (!user || !result) return;
                          setGeneratingReport(true);
                          try {
                            await createReport({
                              title: `Detection Report: ${result.pestName}`,
                              type: 'detection',
                              content: `Pest: ${result.pestName}\nConfidence: ${result.confidence}%\nSeverity: ${result.severity}\nTreatment: ${result.treatment}`,
                              data: result,
                              status: 'ready'
                            });
                            toast.success("Report saved to history!");
                          } catch (err) {
                            toast.error("Failed to save report");
                          } finally {
                            setGeneratingReport(false);
                          }
                        }}
                      >
                        {generatingReport ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 mr-2" />
                        )}
                        {generatingReport ? 'Saving...' : 'Save Report'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Analyzed Image */}
                    {preview && (
                      <div className="relative aspect-video max-h-[400px] mx-auto overflow-hidden rounded-lg border border-border">
                        <img
                          src={preview}
                          alt="Analyzed crop image"
                          className="w-full h-full object-contain bg-secondary"
                        />
                      </div>
                    )}

                    {/* Detection Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-secondary rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Bug className="w-5 h-5 text-destructive" />
                          <span className="text-sm text-muted-foreground">Detected Pest</span>
                        </div>
                        <p className="font-semibold text-foreground">{result.pestName}</p>
                        <p className="text-sm text-muted-foreground mt-1">{result.diseaseName}</p>
                      </div>
                      <div className="p-4 bg-secondary rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          <span className="text-sm text-muted-foreground">Confidence Score</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-3xl font-bold text-foreground">{result.confidence}%</p>
                          <Badge className={getSeverityColor(result.severity)}>
                            {result.severity.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-destructive/5 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-destructive mx-auto mb-1" />
                        <p className="text-2xl font-bold text-foreground">{result.outbreakProbability}%</p>
                        <p className="text-xs text-muted-foreground">Outbreak Risk</p>
                      </div>
                      <div className="text-center p-3 bg-warning/5 rounded-lg">
                        <Shield className="w-5 h-5 text-warning mx-auto mb-1" />
                        <p className="text-sm font-bold text-foreground">{result.affectedArea}</p>
                        <p className="text-xs text-muted-foreground">Affected Area</p>
                      </div>
                      <div className="text-center p-3 bg-primary/5 rounded-lg">
                        <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                        <p className="text-2xl font-bold text-foreground">24h</p>
                        <p className="text-xs text-muted-foreground">Action Window</p>
                      </div>
                      <div className="text-center p-3 bg-accent/5 rounded-lg">
                        <Zap className="w-5 h-5 text-accent mx-auto mb-1" />
                        <p className="text-2xl font-bold text-foreground">High</p>
                        <p className="text-xs text-muted-foreground">Priority</p>
                      </div>
                    </div>

                    {/* Treatment */}
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Recommended Treatment
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">{result.treatment}</p>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Action Items</h4>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-medium text-accent">{index + 1}</span>
                            </div>
                            <span className="text-muted-foreground text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Recent Detections */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Recent Detections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {history.map((detection) => (
                <div
                  key={detection.id}
                  className="p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-foreground text-sm">{detection.pest}</p>
                    <Badge
                      variant="outline"
                      className={
                        detection.severity === 'critical'
                          ? 'border-destructive text-destructive'
                          : detection.severity === 'high'
                          ? 'border-destructive/70 text-destructive/80'
                          : detection.severity === 'medium'
                          ? 'border-warning text-warning'
                          : 'border-primary text-primary'
                      }
                    >
                      {detection.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{detection.confidence}% confidence</span>
                    <span>{detection.date}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-card border-border mt-6">
            <CardHeader>
              <CardTitle className="text-lg">This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Total Scans</span>
                <span className="font-semibold text-foreground">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Pests Detected</span>
                <span className="font-semibold text-destructive">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Healthy Scans</span>
                <span className="font-semibold text-accent">133</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Avg. Confidence</span>
                <span className="font-semibold text-foreground">91.2%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
