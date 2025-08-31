# --------- Etapa de build ---------
FROM node:22-alpine AS build
WORKDIR /app

# Instala deps (incluye devDependencies para compilar)
COPY package*.json ./
RUN npm ci

# Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copia fuentes y compila Nest a dist/
COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npm run build

# --------- Etapa de runtime (ligera) ---------
FROM node:22-alpine
WORKDIR /app

# Solo deps de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copiamos artefactos y prisma
COPY --from=build /app/dist ./dist
COPY prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000

# Aplica migraciones y arranca
CMD sh -c "npx prisma migrate deploy && node dist/src/main.js"
