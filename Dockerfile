FROM node:15.13.0
ENV NODE_ENV=production

WORKDIR = /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

CMD [ "node", "." ]

