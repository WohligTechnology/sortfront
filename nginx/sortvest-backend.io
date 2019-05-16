server {
        listen 80;
 	root /home/projects/sortvest-backend/production/;
        index index.html index.htm;
	server_name sortvestbackend.wohlig.co.in;
	try_files $uri $uri/ /index.html =404;
}
