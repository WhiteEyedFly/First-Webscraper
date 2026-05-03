const {JSDOM} = require('jsdom')

async function crawlPage(baseURL, currentURL, pages){
    // Ensuring we stay in the hostname
    const baseURLObj = new URL(baseURL)
    const currURLObj = new URL(currentURL)
    if (baseURLObj.hostname != currURLObj.hostname){
        return pages
    }
    
    // Checking if we have seen this page previously
    const normalisedCurrentURL = normaliseURL(currentURL)
    if (pages[normalisedCurrentURL] > 0){
        pages[normalisedCurrentURL] ++
        return pages
    }
    
    pages[normalisedCurrentURL] = 1

    console.log(`actively crawling: ${currentURL}`)

    try{
        const resp = await fetch(currentURL)

        // If page broken, return
        if(resp.status > 399){
            console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL}`)
            return pages
        }

        // If non-html, return
        const contentType = resp.headers.get("content-type")
        if (!contentType.includes("text/html")){
            console.log(`non-html response, content type: ${contentType} on page: ${currentURL}`)
            return pages
        }

        const htmlBody = await resp.text()
        const nextURLs = getURLsFromHTML(htmlBody, baseURL)

        for (const nextURL of nextURLs){
            pages = await crawlPage(baseURL, nextURL, pages)
        }
    } catch (err){console.log(err.message)}

    return pages
}

function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)

    // Returns an array of all the a tags in the doc
    const linkElements = dom.window.document.querySelectorAll("a")

    // Add links to the list
    for (const linkElement of linkElements){
        // Bind relative urls to the base
        if (linkElement.href.slice(0, 1) === "/"){
            // Relative
            try{
                const urlObj = new URL(`${baseURL}${linkElement.href}`)
                urls.push(urlObj.href)
            } catch(err){
                console.log(`error with relative url: ${err.message}`)
            }
            
        } else {
            // Absolute
            try{
                const urlObj = new URL(linkElement.href)
                urls.push(urlObj.href)
            } catch(err){
                console.log(`error with relative url: ${err.message}`)}
        }
    }

    return urls
}

function normaliseURL(urlString)
{
    // Ensures all input strings the lead to the same page are output as the same string
    const urlObj = new URL(urlString)

    // Remove https// & http//
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    
    // Remove trailing /'s
    if (hostPath.length > 0 && hostPath.slice(-1) === "/"){
        return hostPath.slice(0, -1)
    }
    else{
        return hostPath
    }
}

module.exports = {
    normaliseURL,
    getURLsFromHTML,
    crawlPage
}