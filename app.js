const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

let browser = null;

app.get('/', (req, res) =>
{
    const url = req.headers?.url;

    if(!url)
    {
        res.send('');
    }
    else 
    {
        (async () => 
        {
            let html = '';

    	    if(!browser)
    	    {
    	    	browser = await puppeteer.launch({
        		    headless: 'new'
          		});
    	    }

            const page = await browser.newPage();

            try 
            {
                await page.goto(url);
                html = await page.content();

		        page.close();

                res.statusCode = 200;
            } 
            catch (error) 
            {
                res.statusCode = 422;
                html = error;
                console.log(error);
            }
            
            res.send(html);
        })();
    } 
});

app.listen(3000, () =>
{
    console.log('Server running on port 3000');
});
