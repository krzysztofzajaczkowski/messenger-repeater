FROM node:18.16.0-alpine3.17
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY src/package.json .
COPY src/package-lock.json .
RUN npm install
COPY src/ .
CMD [ "npm", "start"]