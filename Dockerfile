FROM node:18-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
RUN npm install pm2 -g
COPY . .
EXPOSE 3000
CMD ["pm2-runtime", "ecosystem.config.js"]