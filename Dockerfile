# Usa una imagen base de Node.js
FROM node:16

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiar todo el código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Exponer el puerto 3000 para la app
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
