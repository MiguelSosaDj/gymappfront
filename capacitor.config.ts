import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'gymapp',
  webDir: 'dist',
  server: {
    // Esto permite el tráfico HTTP en lugar de HTTPS en desarrollo
    url: '192.168.1.77:8100/login', // La IP y puerto de tu servidor backend
    cleartext: true // Permite tráfico HTTP (solo para desarrollo)
  }
};

export default config;
