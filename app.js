const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

const PAGE_LOAD_TIMEOUT = 10000; 

// Initialize the browser outside of the route handler
let browserPromise = puppeteer.launch({
    headless: true
});

app.get('/', async (req, res) => 
{
    const url = req.headers?.url;

    let page = null;

    if (!url) 
    {
        res.statusCode = 422;
        res.send('');
    } 
    else 
    {
        try 
        {
            const browser = await browserPromise;
            page = await browser.newPage();

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: PAGE_LOAD_TIMEOUT });
            await page.waitForSelector('.dh-loader', { hidden: true, timeout: 2000 });

            const html = await page.content();

            await page.close();

            res.statusCode = 200;
            res.send(html);
        } 
        catch (error) 
        {
            if(page) 
            {
                await page.close();
            }

            res.statusCode = 422;
            const errorMessage = error.toString();
            console.log(errorMessage);
            res.send(errorMessage);
        }
    }
});

const server = app.listen(3000, () => {
    console.log('Server running on port 3000');
});

process.on('SIGTERM', async () => {
    console.log('Closing browser and server...');

    const browser = await browserPromise;
    await browser.close();

    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});
