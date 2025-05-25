# Prajwals's modal deploy steps

#!/bin/bash
# Update and install Apache web server
yum update -y
yum install -y httpd

# Start Apache and enable it to start on boot
systemctl start httpd
systemctl enable httpd

# Write "Hello, World!" to the index page
echo "<h1>Hello, World!</h1>" > /var/www/html/index.html

#!/bin/bash

# Update the system
sudo dnf update -y || yum update -y

# Install required packages
sudo dnf install -y python3 git || yum install -y python3 git

# Optional: install pip if not present
sudo python3 -m ensurepip --upgrade

# Clone your Flask app from GitHub
git clone https://github.com/nameisprajwal/inventory_forecast_api flask-app

# Change to the repo directory
cd flask-app

# Install Python dependencies (assumes you have requirements.txt)
pip3 install -r requirements.txt

pip3 install marshmallow==3.20.1

export FLASK_APP=app.main
export FLASK_ENV=development

flask run --host=0.0.0.0 --port=8000

# React App/apps

# Update packages
sudo dnf update -y

# Install Node.js (LTS) from NodeSource
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs git

# Verify installation
node -v
npm -v

# Install serve globally to serve the React app
sudo npm install -g serve

# Optional: install pm2 to run serve in the background
sudo npm install -g pm2