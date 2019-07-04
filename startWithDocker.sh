docker stop ppui
docker rm ppui

docker run -d --name ppui -p 8099:80 \
-v /data/app/ppui/nginx/default:/etc/nginx/conf.d/default.conf \
-v /data/app/ppui/dist:/usr/share/nginx/html nginx
