FROM node:16
WORKDIR /usr/src/app
RUN npm install -g pm2
COPY package*.json ./
RUN npm install
COPY . .
COPY ecosystem.config.js ./
EXPOSE 3000
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]