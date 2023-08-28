# Divhunt Pre-render
Simple pre-rendering microservice.

## Required Libraries
System required libraries to be installed on system.

`
sudo apt install libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libgbm1 libasound2 libpangocairo-1.0-0 libxss1 libgtk-3-0
`

## Other Libraries
Pre-rendering utilizes node and puppeteer to open webpage and return HTML.

## Usage

`
npm install 
node app.js
`

Make GET request with header `URL=https://webpageurl.com.`
