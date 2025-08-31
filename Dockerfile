# --------- Etapa de build ---------
FROM node:22-alpine AS build
WORKDIR /app

# Instala dependencias (incluye dev para compilar)
COPY package*.json ./
RUN npm ci

# Genera el cliente de Prisma
COPY prisma ./prisma
RUN npx prisma generate

# Compila Nest a dist/
COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npm run build

# --------- Etapa de runtime (ligera) ---------
FROM node:22-alpine
WORKDIR /app

# Solo dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copiamos Prisma (schema) y artefactos compilados
COPY prisma ./prisma
COPY --from=build /app/dist ./dist

# 🔧 Copiamos el cliente de Prisma ya generado en la etapa de build
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma

ENV NODE_ENV=production
EXPOSE 3000

# Aplica migraciones y arranca
# (tu build genera dist/src/main.js)
CMD sh -c "npx prisma migrate deploy && node dist/src/main.js"
