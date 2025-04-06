FROM node:22

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npx prisma generate
 
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:migrate:prod" ]