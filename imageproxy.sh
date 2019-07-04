docker run -d -p 8090:8080 -env IMAGEPROXY_CACHE="/tmp/imageproxy" --name imageproxy --rm willnorris/imageproxy -addr 0.0.0.0:8080

