import { Animal, Alert, FarmStats, Location } from '../types';

// Base coordinates around a typical farm in Uzbekistan (e.g., near Jizzakh or Samarkand)
const BASE_LAT = 40.1158;
const BASE_LNG = 67.8422;

const generateHistory = (count: number, startLat: number, startLng: number): Location[] => {
  const history: Location[] = [];
  let currentLat = startLat;
  let currentLng = startLng;
  const now = new Date();

  for (let i = count; i >= 0; i--) {
    history.push({
      lat: currentLat,
      lng: currentLng,
      timestamp: new Date(now.getTime() - i * 5 * 60000).toISOString(), // Every 5 mins
    });
    // Random walk
    currentLat += (Math.random() - 0.5) * 0.005;
    currentLng += (Math.random() - 0.5) * 0.005;
  }
  return history;
};

export const MOCK_ANIMALS: Animal[] = [
  {
    id: 'A102',
    tagId: 'UZ-JIZ-102',
    type: 'Cattle',
    age: 3,
    sex: 'F',
    deviceId: 'DEV-C-8812',
    batteryLevel: 82,
    signalStrength: 95,
    temperature: 38.7,
    currentLocation: {
      lat: BASE_LAT + 0.001,
      lng: BASE_LNG - 0.002,
      timestamp: new Date().toISOString()
    },
    isOnline: true,
    healthStatus: 'Normal',
    activityLevel: 'Grazing',
    healthScore: 98,
    history: generateHistory(24, BASE_LAT, BASE_LNG)
  },
  {
    id: 'A105',
    tagId: 'UZ-JIZ-105',
    type: 'Cattle',
    age: 4,
    sex: 'M',
    deviceId: 'DEV-C-8815',
    batteryLevel: 15,
    signalStrength: 80,
    temperature: 39.1,
    currentLocation: {
      lat: BASE_LAT + 0.015,
      lng: BASE_LNG + 0.010,
      timestamp: new Date().toISOString()
    },
    isOnline: true,
    healthStatus: 'Warning',
    activityLevel: 'Moving',
    healthScore: 75,
    history: generateHistory(24, BASE_LAT + 0.01, BASE_LNG + 0.005)
  },
  {
    id: 'S042',
    tagId: 'UZ-SAM-042',
    type: 'Sheep',
    age: 2,
    sex: 'F',
    deviceId: 'DEV-S-4421',
    batteryLevel: 90,
    signalStrength: 0,
    temperature: 39.0,
    currentLocation: {
      lat: BASE_LAT - 0.020,
      lng: BASE_LNG - 0.015,
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    isOnline: false,
    healthStatus: 'Normal',
    activityLevel: 'Resting',
    healthScore: 92,
    history: generateHistory(10, BASE_LAT - 0.015, BASE_LNG - 0.010)
  },
  {
    id: 'H001',
    tagId: 'UZ-TASH-001',
    type: 'Horse',
    age: 5,
    sex: 'M',
    deviceId: 'DEV-H-1001',
    batteryLevel: 65,
    signalStrength: 100,
    temperature: 38.0,
    currentLocation: {
      lat: BASE_LAT + 0.030,
      lng: BASE_LNG - 0.025,
      timestamp: new Date().toISOString()
    },
    isOnline: true,
    healthStatus: 'Normal',
    activityLevel: 'Highly Active',
    healthScore: 100,
    history: generateHistory(24, BASE_LAT + 0.02, BASE_LNG - 0.02)
  }
];

// Add a few more random animals to make the map look populated
for(let i=0; i<15; i++) {
  const isOnline = Math.random() > 0.1;
  MOCK_ANIMALS.push({
    id: `R${300+i}`,
    tagId: `UZ-RND-${300+i}`,
    type: i % 2 === 0 ? 'Sheep' : (i % 3 === 0 ? 'Goat' : 'Cattle'),
    age: Math.floor(Math.random() * 5) + 1,
    sex: Math.random() > 0.5 ? 'M' : 'F',
    deviceId: `DEV-R-${4000+i}`,
    batteryLevel: Math.floor(Math.random() * 100),
    signalStrength: isOnline ? Math.floor(Math.random() * 50) + 50 : 0,
    temperature: 38 + (Math.random() * 1.5),
    currentLocation: {
      lat: BASE_LAT + (Math.random() - 0.5) * 0.05,
      lng: BASE_LNG + (Math.random() - 0.5) * 0.05,
      timestamp: isOnline ? new Date().toISOString() : new Date(Date.now() - 7200000).toISOString()
    },
    isOnline,
    healthStatus: Math.random() > 0.9 ? 'Warning' : 'Normal',
    activityLevel: ['Resting', 'Grazing', 'Moving'][Math.floor(Math.random() * 3)] as any,
    healthScore: Math.floor(Math.random() * 20) + 80,
    history: []
  });
}

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'AL-1',
    animalId: 'A105',
    type: 'Geofence Breach',
    severity: 'Critical',
    message: 'Animal has left the designated safe zone.',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    isResolved: false
  },
  {
    id: 'AL-2',
    animalId: 'A105',
    type: 'Low Battery',
    severity: 'Warning',
    message: 'Battery level is at 15%.',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    isResolved: false
  },
  {
    id: 'AL-3',
    animalId: 'S042',
    type: 'Signal Lost',
    severity: 'Warning',
    message: 'Device has been offline for over 1 hour.',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    isResolved: false
  },
  {
    id: 'AL-4',
    animalId: 'A102',
    type: 'Safe',
    severity: 'Success',
    message: 'Animal returned to safe zone.',
    timestamp: new Date(Date.now() - 3600 * 60000).toISOString(),
    isResolved: true
  }
];

export const MOCK_FARM_STATS: FarmStats = {
  totalAnimals: MOCK_ANIMALS.length,
  onlineCount: MOCK_ANIMALS.filter(a => a.isOnline).length,
  offlineCount: MOCK_ANIMALS.filter(a => !a.isOnline).length,
  activeAlerts: MOCK_ALERTS.filter(a => !a.isResolved).length,
  lowBatteryCount: MOCK_ANIMALS.filter(a => a.batteryLevel < 20).length,
  healthWarnings: MOCK_ANIMALS.filter(a => a.healthStatus !== 'Normal').length
};
