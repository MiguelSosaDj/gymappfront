"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    appId: 'com.gymapp.id',
    appName: 'gymapp',
    webDir: 'www',
    bundledWebRuntime: false,
    server: {
        // Esto permite el tráfico HTTP en lugar de HTTPS en desarrollo
        url: '10.0.2.2:8000/login', // La IP y puerto de tu servidor backend
        cleartext: true // Permite tráfico HTTP (solo para desarrollo)
    }
};
exports.default = config;
