# EmailQ

EmailQ is an open source email server compatible with Amazon SES APIs

# Emailq Server Installation

Step 1 : Create  .emailq file and add the following
```sh 
  ## Postal SMTP
  SMTP_HOST=smtp.gmail.com
  SMTP_SECURE=false
  SMTP_IGNORETLS=true
  SMTP_PORT=587
  SMTP_AUTH_USER='majeshpv@gmail.com'
  SMTP_AUTH_PASS='screat'
```

Step 2 : Install node version 8.1.11 or greater
```sh
yum install nodejs
npm install -g n
n lts

```

Step 4 : Install emailq.
```sh
npm install -g emailq
```

Step 5: Run emailq manually

```sh
emailq
```

Step 6: Run emailq on systemd

```sh
cd /etc/nginx/conf.d/
sudo nano ses.example.com.conf

Paste the following 

server {
 listen  80;
 server_name    ses.example.com;
 return         301 https://$server_name$request_uri;
}

server {
  listen 443 ssl;
  #include /etc/nginx/statsd;
  server_name ses.example.com;
  ssl on;
  ssl_certificate /etc/nginx/ssl/ssl-bundle.crt;
  ssl_certificate_key /etc/nginx/ssl/example.com-ssl.key;

    location / {
        proxy_pass http://127.0.0.1:1587;
    }
  }

# test nginx settings
sudo nginx -t
sudo systemctl restart nginx.
sudo systemctl status nginx.
```

Step 7: Create systemd unit: Systemd will keep emailq up and running

```sh
cd /etc/systemd/system
sudo nano emailq.service

Paste the following code

[Unit]
Description=EmailQ
After=syslog.target

[Service]
WorkingDirectory=/home/mail.google.com
ExecStart=/usr/local/bin/node node_modules/emailq/bin/emailq
ExecReload=/usr/bin/kill -HUP $MAINPID
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=emailq
User=
Group=gloryque

[Install]
WantedBy=multi-user.target

# to check unit status
sudo systemctl status emailq

# start emailq on startup
sudo systemctl enable emailq

# start emailq now
sudo systemctl start emailq

# check emailq running status
sudo systemctl status emailq

## to check fo error
journalctl -u emailq -f
journalctl -u emailq -l
```
