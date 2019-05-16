server {
        listen 80;
 	root /home/projects/sortvest-frontend/production/;
        index index.html index.htm;
	server_name sortvest.wohlig.co.in;
	try_files $uri $uri/ /index.html =404;
}
