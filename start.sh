docker run -p 8080:80 --rm --name ppui  -v /opt/app/ppui/dist:/usr/share/nginx/html:ro -d nginx
