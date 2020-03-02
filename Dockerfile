FROM node:12
ADD . /code
WORKDIR /code
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8081
CMD npm run dev