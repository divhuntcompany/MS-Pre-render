const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

// Define your routes
app.get('/', (req, res) =>
{
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://divhunt.com', { waitUntil: 'networkidle0' });
        const html = await page.content();
        await browser.close();
        res.send(html);
    })();
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
