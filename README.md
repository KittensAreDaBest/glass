# Glass
The modern looking glass for modern companies

## Installation

### Dependencies
* docker (if using docker)
* docker-compose (if using docker)
* nodejs (if not using docker)
* yarn (if not using docker)
* npm (if not using docker)
* bird2 (if using BGP Route Dump on the looking glass)
* a reverse proxy (nginx, caddy)
* git

### Download Files
```
git clone https://github.com/KittensAreDaBest/glass
cd glass
```

### Installation
Copy the .env.example to .env
```
cp .env.example .env
```
Edit the values in the .env file to your liking

### Configure BIRD 2 (only if using BGP Route Dump)
no configuration guide will be provided at the moment. (maybe later)

### Configure locations.json
Copy the locations.json.example to locations.json
```
cd config
cp locations.json.example locations.json
```
Edit the values in the locations.json file to your liking (if only one location then only add that and it will not show the location dropdown)

### Docker (recommended)
If you are not using bird then edit docker-compose.yml and remove the sections where bird is refrenced

Build the docker container
```
docker compose build
```

Generate the test files (only if you have test files enabled. requires ~16GB storage)
```
bash files.sh
```

Start the docker container
```
docker compose up -d
```
The service will now lisen on port 3000 locally

### Host install (not recommended)
Install nodejs and npm (no guide will be provided for this. consult your distro's documentation)

Install yarn
```
npm i -g yarn
```

Install dependencies
```
yarn install
```

Build the looking glass
```
yarn build
```
Generate the test files (only if you have test files enabled. requires ~16GB storage)
```
bash files.sh
```

Start the looking glass
```
yarn start
```

### Reverse Proxy

#### Nginx
```
server {
    listen 80;
    listen [::]:80;
    server_name lg.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen [::]:443 ssl;
    listen 443 ssl;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log warn;

    ssl_certificate /etc/letsencrypt/live/lg.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lg.example.com/privkey.pem;

    server_name lg.example.com;

    location / {
        include proxy_params;
        proxy_pass http://127.0.0.1:3000;
    }
}
```

#### Caddy
```
lg.example.com {
    reverse_proxy localhost:3000
}
```
