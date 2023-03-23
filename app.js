const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/', (req, res) =>
{
    const url = req.headers?.url;

    if(!url)
    {
        res.send('');
    }

    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });
        const html = await page.content();
        await browser.close();
        res.send(html);
    })();
});

app.listen(3000, () =>
{
    console.log('Server running on port 3000');
});
