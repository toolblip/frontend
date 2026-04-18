FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build
CMD ["npm", "start"]
