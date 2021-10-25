let axios = require('axios');
let cheerio = require('cheerio');
let express = require('express');
let puppeteer = require('puppeteer');

async function getcrypto(){
    try{
        let siteurl = 'https://coinmarketcap.com/';

        let {data} = await axios({
            method: "GET",
            url: siteurl
        })

        let $ = cheerio.load(data)
        let ElementSelector = '#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr'

        let keys = [
            'Rank',
            'Name',
            'Price',
            '24 hour',
            '7 day',
            'MarketCap',
            'Volume',
            'Circulating supply'
        ]
        let coinArr = []
        $(ElementSelector).each((parentidx, parentelem) => {
            let keyidx = 0
            let coinobj = {}
            if(parentidx <= 9){
                $(parentelem).children().each((childidx, childelem) => {
                    let tdvalue = $(childelem).text()

                    if(keyidx === 1 || keyidx === 6){
                        tdvalue = $('p:first-child', childelem).html()
                    }

                    if(tdvalue){
                        coinobj[keys[keyidx]] = tdvalue

                        keyidx++
                    }
                })

                coinArr.push(coinobj)
            }
        })

        return coinArr

    }catch(err){
        console.log(err)
    }
}

let app = express()

app.get('/api/getmecryptoprices', async(req, res) => {
    try{
        let crypto = await getcrypto()

        return res.status(200).json({
            result: crypto,
        })
    } catch(err) {
        return res.status(500).json({
            err: err.toString(),
        })
    }
})

app.listen(3000, () => {
    console.log("running on port 3000")
})