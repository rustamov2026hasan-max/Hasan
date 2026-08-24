export type AnimalType = 'Cattle' | 'Sheep' | 'Goat' | 'Horse';
export type HealthStatus = 'Normal' | 'Warning' | 'Critical';
export type ActivityLevel = 'Resting' | 'Grazing' | 'Moving' | 'Highly Active';

export interface Location {
  lat: number;
  lng: number;
  timestamp: string;
}

export interface Animal {
  id: string;
  tagId: string;
  type: AnimalType;
  age: number;
  sex: 'M' | 'F';
  photoUrl?: string;
  
  deviceId: string;
  batteryLevel: number; // 0-100
  signalStrength: number; // 0-100
  temperature: number; // Celsius
  
  currentLocation: Location;
  isOnline: boolean;
  
  healthStatus: HealthStatus;
  activityLevel: ActivityLevel;
  healthScore: number; // 0-100
  
  history: Location[];
}

export type AlertType = 'Geofence Breach' | 'Low Battery' | 'Health Anomaly' | 'Signal Lost' | 'Safe';
export type AlertSeverity = 'Info' | 'Warning' | 'Critical' | 'Success';

export interface Alert {
  id: string;
  animalId: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  isResolved: boolean;
}

export interface FarmStats {
  totalAnimals: number;
  onlineCount: number;
  offlineCount: number;
  activeAlerts: number;
  lowBatteryCount: number;
  healthWarnings: number;
}
