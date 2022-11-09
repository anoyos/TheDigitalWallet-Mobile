FROM node

RUN mkdir /var/www
ADD . /var/www
WORKDIR /var/www
RUN npm i

ENTRYPOINT ["node", "index.js"]
