import * as tmImage from '@teachablemachine/image';

const MODEL_URL = typeof window !== 'undefined' 
  ? window.location.origin + '/models/' 
  : '/models/';

export interface PredictionResult {
  className: string;
  probability: number;
}

export interface ModelMetadata {
  labels: string[];
}

let model: tmImage.CustomMobileNet | null = null;
let metadata: ModelMetadata | null = null;

export async function loadModel() {
  if (model) return model;

  const modelURL = MODEL_URL + 'model.json';
  const metadataURL = MODEL_URL + 'metadata.json';

  try {
    model = await tmImage.load(modelURL, metadataURL);
    return model;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw error;
  }
}

export async function predict(imageElement: HTMLImageElement | HTMLCanvasElement): Promise<PredictionResult[]> {
  const loadedModel = await loadModel();
  const predictions = await loadedModel.predict(imageElement);
  
  // Sort by probability descending
  return predictions.sort((a, b) => b.probability - a.probability);
}

export function getSeverity(className: string): 'low' | 'medium' | 'high' | 'critical' {
  if (className.toLowerCase().includes('healthy')) return 'low';
  if (className.toLowerCase().includes('virus') || className.toLowerCase().includes('blight')) return 'high';
  return 'medium';
}

export function getTreatment(className: string): string {
  if (className.toLowerCase().includes('healthy')) return 'No treatment needed. Continue regular monitoring.';
  if (className.toLowerCase().includes('virus')) return 'Remove infected plants immediately to prevent spread. Practice crop rotation and control whiteflies.';
  if (className.toLowerCase().includes('blight')) return 'Apply copper-based fungicides. Improve air circulation and avoid overhead watering.';
  if (className.toLowerCase().includes('spider_mites')) return 'Use insecticidal soap or neem oil. Increase humidity around plants.';
  if (className.toLowerCase().includes('bacterial_spot')) return 'Remove plant debris. Use bactericides containing copper. Avoid working in wet fields.';
  return 'Consult with a plant pathologist for specific treatment recommendations.';
}
