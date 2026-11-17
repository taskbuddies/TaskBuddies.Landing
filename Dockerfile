FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html open.html style.css robots.txt sitemap.xml /usr/share/nginx/html/
COPY en /usr/share/nginx/html/en
COPY assets /usr/share/nginx/html/assets
COPY .well-known /usr/share/nginx/html/.well-known
EXPOSE 80
