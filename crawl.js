const {JSDOM} = require('jsdom')

async function crawlPage(currentURL){
    try{
        const resp = await fetch(currentURL)

        // If page broken, return
        if(resp.status > 399){
            console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL}`)
            return
        }

        const contentType = resp.headers.get("content-type")
        if (!contentType.includes("text/html")){
            console.log(`non-html response, content type: ${contentType} on page: ${currentURL}`)
            return
        }

        console.log(await resp.text())
    } catch (err){console.log(err.message)}
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