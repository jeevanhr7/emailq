# EmailQ

EmailQ is an open source email server compatible with Amazon SES APIs

Don't forgot to Join [slack for help](https://join.slack.com/t/emailq/shared_invite/enQtMzg4MDA0MDcyMDM2LTFhZTNhYzQwMzVkYWVmODRhYTdiMjI3YTc5ZWMxZDUyOWIxYmI3MDliMWQxMGZlMmQwNzk4Yjg4MmRmOGFjYTU):

**Available APIs**

- CreateTemplate
- SendEmail
- SendBulkTemplatedEmail
- SendTemplatedEmail
- SendRawEmail
- UpdateTemplate
- GetSendQuota - dummy
- SetIdentityNotificationTopic - dummy

**Important Features Pending**:

- Sending Statitstics
- Dedicated IPs
- Reputation Dashboard
- Bounce Handling
- List Unsubscribe Headers
- Return Path
- IP Warmup
- SNS & SQS Notification
- Render Failures
- ConfigurationSet (Click and Open Tracking, IP Pool)
- Feedback Loop
- Simplified Integration with Haraka SMTP (DKIM, SPF, DMARC)
- Email Verification
- Suppressions
- SMTP Settings
- Mailbox Simulator
- UI


**Other considerations**-

- First Test in Local Machine using maildev `npm install -g maildev && maildev`

https://github.com/manjeshpv/emailq/wiki/Development-Settings

Report issues: https://github.com/manjeshpv/emailq/issues

Support for Mail for Good - https://github.com/manjeshpv/emailq/wiki/Mail-for-Good-Support

##### EmailQ Server Installation

Step 1 : Switch user to root using `sudo -i`, Create `nano ~/.emailq` file and add the following
```sh
  AWSAccessKeyId="ABCD"
  AWSSecretKey="ABCD"
  AWSEndPoint=http://localhost:1587
  AWSRegion=us-west-2
  
  # AWS SES Domain Identity
  DOMAIN_IDENTITY=verified-domain.com
  
  ## AWS Email Identity
  EMAIL_IDENTITY=youremail@yourdomain.com
  
  # SMTP Settings to Delivery Email
  SMTP_HOST=smtp.gmail.com
  SMTP_SECURE=false
  SMTP_IGNORETLS=true
  SMTP_PORT=587
  # you can use SMTP_PORT=1025 for development with maildev `npm i -g maildev; maildev`
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
cd ~
git clone https://github.com/manjeshpv/emailq
```

Step 5: Install node packages in emailq project

```sh
cd emailq
npm install
npm start
```

Step 6: Run emailq on systemd

```sh
cd /etc/nginx/conf.d/
sudo nano ses.example.com.conf
```

Paste the following 

```sh
server {
 listen  80;
 server_name    ses.example.com;
 return         301 https://$server_name$request_uri;
}

server {
  listen 443 ssl;
  server_name ses.example.com;
  ssl on;
  ssl_certificate /etc/nginx/ssl/ssl-bundle.crt;
  ssl_certificate_key /etc/nginx/ssl/example.com-ssl.key;

    location / {
        # SendRawEmail with attachments limited to 10MB as per AWS SES Limits
        client_max_body_size 10M;
        proxy_pass http://127.0.0.1:1587;
    }
  }
```

```sh
# test nginx settings
sudo nginx -t
sudo systemctl restart nginx.
sudo systemctl status nginx.
```

Step 7: Create systemd unit: Systemd will keep emailq up and running

```sh
cd /etc/systemd/system
sudo nano emailq.service
```
Paste the following code

```sh
[Unit]
Description=EmailQ
After=syslog.target

[Service]
WorkingDirectory=/root/emailq
ExecStart=/usr/local/bin/node server/app
ExecReload=/usr/bin/kill -HUP $MAINPID
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=emailq
User=root
Group=root

[Install]
WantedBy=multi-user.target
```

```sh
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
