FROM node:16 AS builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

#FROM node:alpine as build
#WORKDIR /app
#ENV PATH /app/node_modules/.bin:$PATH
#COPY ./package.json /app/
#RUN yarn
#COPY . /app
#RUN yarn build
#
#FROM nginx:alpine as expose
#COPY --from=build /app/build /usr/share/nginx/html
#RUN rm /etc/nginx/conf.d/default.conf
#COPY nginx.conf /etc/nginx/conf.d
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]