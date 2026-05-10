// Mock data for the application
export const mockCropsData = [
  { id: 1, name: 'Rice', field: 'North Field', area: 25, stage: 'Flowering', health: 85 },
  { id: 2, name: 'Wheat', field: 'South Field', area: 15, stage: 'Grain Filling', health: 92 },
  { id: 3, name: 'Corn', field: 'East Field', area: 20, stage: 'Tasseling', health: 78 },
  { id: 4, name: 'Soybean', field: 'West Field', area: 18, stage: 'Pod Development', health: 88 },
]

export const mockPestsData = [
  {
    id: 1,
    name: 'Fall Armyworm',
    severity: 'high',
    detected: '2024-05-08',
    fields: ['North Field', 'East Field'],
    recommendation: 'Apply neem oil spray, scout for larvae, deploy pheromone traps',
  },
  {
    id: 2,
    name: 'Leaf Spot Disease',
    severity: 'medium',
    detected: '2024-05-06',
    fields: ['South Field'],
    recommendation: 'Improve drainage, remove infected leaves, apply fungicide if needed',
  },
  {
    id: 3,
    name: 'Whitefly',
    severity: 'low',
    detected: '2024-05-04',
    fields: ['West Field'],
    recommendation: 'Monitor population, use sticky traps, introduce natural predators',
  },
]

export const mockWeatherData = {
  current: {
    temp: 28,
    humidity: 65,
    windSpeed: 12,
    rainChance: 45,
    condition: 'Partly Cloudy',
  },
  forecast: [
    { day: 'Today', high: 32, low: 22, condition: 'Sunny', rain: 10 },
    { day: 'Tomorrow', high: 30, low: 20, condition: 'Cloudy', rain: 45 },
    { day: 'Wed', high: 25, low: 18, condition: 'Rainy', rain: 85 },
    { day: 'Thu', high: 28, low: 20, condition: 'Partly Cloudy', rain: 30 },
    { day: 'Fri', high: 31, low: 22, condition: 'Sunny', rain: 5 },
  ],
}

export const mockOutbreakData = [
  { lat: 40.7128, lng: -74.006, severity: 'critical', pest: 'Fall Armyworm', reports: 15 },
  { lat: 40.758, lng: -73.9855, severity: 'high', pest: 'Leaf Spot', reports: 8 },
  { lat: 40.6892, lng: -74.0445, severity: 'medium', pest: 'Whitefly', reports: 5 },
  { lat: 40.7282, lng: -74.0076, severity: 'low', pest: 'Mites', reports: 2 },
]

export const mockReports = [
  {
    id: 1,
    title: 'Weekly Pest Monitoring Report',
    date: '2024-05-08',
    status: 'completed',
    sections: 3,
    crops: ['Rice', 'Wheat'],
  },
  {
    id: 2,
    title: 'Disease Outbreak Alert - North Region',
    date: '2024-05-07',
    status: 'critical',
    sections: 5,
    crops: ['All'],
  },
  {
    id: 3,
    title: 'Monthly Health Assessment',
    date: '2024-05-01',
    status: 'completed',
    sections: 8,
    crops: ['Rice', 'Corn', 'Soybean'],
  },
]

export const mockCommunityPosts = [
  {
    id: 1,
    author: 'Farmer Kumar',
    avatar: 'K',
    timestamp: '2 hours ago',
    title: 'Fall Armyworm in my North Field - Need Help!',
    content: 'Detected high infestation of fall armyworm. What treatment would you recommend?',
    likes: 24,
    replies: 8,
    region: 'North Region',
  },
  {
    id: 2,
    author: 'Agriculture Officer Singh',
    avatar: 'S',
    timestamp: '5 hours ago',
    title: 'New Integrated Pest Management Guidelines',
    content: 'Government has released updated IPM guidelines for 2024. All farmers should review.',
    likes: 45,
    replies: 12,
    region: 'State-wide',
  },
  {
    id: 3,
    author: 'Dr. Patel - Agronomist',
    avatar: 'P',
    timestamp: '1 day ago',
    title: 'Best Practices for Monsoon Season Preparation',
    content: 'Tips for preparing your fields before monsoon: drainage, crop selection, soil preparation.',
    likes: 67,
    replies: 19,
    region: 'South Region',
  },
]

export const mockEmergencyAlerts = [
  {
    id: 1,
    type: 'Disease Outbreak',
    title: 'Critical: Fall Armyworm Detected in North Region',
    description: 'High severity pest outbreak detected across 15 farms in North Region',
    time: '2024-05-08 14:30',
    region: 'North Region',
    status: 'active',
    affectedCrops: ['Rice', 'Corn', 'Maize'],
  },
  {
    id: 2,
    type: 'Weather Alert',
    title: 'Severe Thunderstorm Expected',
    description: 'Heavy rainfall and strong winds predicted for next 48 hours',
    time: '2024-05-08 10:15',
    region: 'East Region',
    status: 'active',
    affectedCrops: ['All'],
  },
  {
    id: 3,
    type: 'Resource Alert',
    title: 'Pesticide Supply Shortage - Make Orders Now',
    description: 'Regional shortage of commonly used pesticides expected next week',
    time: '2024-05-07 16:45',
    region: 'State-wide',
    status: 'active',
    affectedCrops: ['All'],
  },
]

export const mockDashboardStats = {
  totalCrops: 4,
  healthyFields: 3,
  alertsActive: 5,
  dataPoints: [25, 18, 22, 30, 28, 35, 32, 38, 42, 40, 45, 48],
}
