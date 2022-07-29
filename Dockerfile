FROM node:16

WORKDIR app/

RUN mkdir -p /var/log/app

COPY package*.json ./

RUN npm ci --production

COPY src/ ./

CMD ["npm", "start"]