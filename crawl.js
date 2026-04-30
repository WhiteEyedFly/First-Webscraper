function normaliseURL(urlString)
{
    // Ensures all input strings the lead to the same page are output as the same string
    const urlObj = new URL(urlString)

    // Remove https/http
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
    normaliseURL
}