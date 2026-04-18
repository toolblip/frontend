FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
