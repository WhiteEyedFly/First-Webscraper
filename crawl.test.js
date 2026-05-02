const {normaliseURL, getURLsFromHTML} = require("./crawl.js")
const {test, expect} = require("@jest/globals")

test("normaliseURL", () => {
    const input = "https://blog.boot.dev/path/"
    const actual = normaliseURL(input)
    const expected = "blog.boot.dev/path"
    expect(actual).toEqual(expected)
})

test("getURLsFromHTML", () => {
    const inputHTMLBody = `
<html>
    <body>
        <a href="https://blog.boot.dev/">
            Boot.dev Blog
        </a>
    </body>
</html>
`

    const inputBaseURL = "https://blog.boot.dev/"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://blog.boot.dev/"]
    expect(actual).toEqual(expected)
})