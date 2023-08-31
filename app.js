const express = require('express');
const puppeteer = require('puppeteer');
const cache = require('memory-cache');
const rateLimit = require('express-rate-limit');

const app = express();
const cacheDuration = 15 * 60 * 1000; // 15 minute in milliseconds
const PAGE_LOAD_TIMEOUT = 10000; // 10 seconds

// Initialize the browser outside of the route handler
let browserPromise = puppeteer.launch({
    headless: true
});

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.get('/', async (req, res) => {
    const url = req.headers?.url;
    let page = null;

    if (!url) {
        res.statusCode = 422;
        res.send('');
    } else {
        const cachedHtml = cache.get(url);
        if (cachedHtml) {
            console.log('Serving cached content');
            res.statusCode = 200;
            res.send(cachedHtml);
            return;
        }

        try {
            const browser = await browserPromise;
            
            page = await browser.newPage();

            await page.goto(url, { timeout: PAGE_LOAD_TIMEOUT });

            const html = await page.content();
            await page.close();

            // Cache the HTML content for 1 minute
            cache.put(url, html, cacheDuration);

            res.statusCode = 200;
            res.send(html);
        } catch (error) {
            if(page) {
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
})
