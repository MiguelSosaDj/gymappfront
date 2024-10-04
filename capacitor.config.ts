import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gymapp.app',
  appName: 'com.gymapp.app',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // Esto permite el tráfico HTTP en lugar de HTTPS en desarrollo
    url: 'http://192.168.1.3:8100/login', // La IP y puerto de tu servidor backend
    cleartext: true // Permite tráfico HTTP (solo para desarrollo)
  }
};

export default config;
