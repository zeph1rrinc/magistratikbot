FROM node:16

WORKDIR app/

COPY src/package*.json ./

RUN npm ci --production

COPY src/* ./

CMD ["npm", "start"]