FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm pkg delete scripts.prepare && npm ci --no-audit --unsafe-perm

RUN npm run build

CMD [ "npm", "run", "start" ]
