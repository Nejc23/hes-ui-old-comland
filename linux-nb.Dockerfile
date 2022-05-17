FROM nginx:1.21

COPY  ./dist/ePointHES/ /usr/share/nginx/html/
RUN chmod -R 775 /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY int.enerdat.ca.crt /usr/local/share/ca-certificates/
COPY int.semax.ca.crt /usr/local/share/ca-certificates/
COPY metricsx.ca.crt /usr/local/share/ca-certificates/

RUN update-ca-certificates