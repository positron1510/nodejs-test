FROM node:12
ADD . /code
WORKDIR /code
RUN npm install
CMD npm run dev