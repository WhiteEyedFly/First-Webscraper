const {normaliseURL} = require("./crawl.js")
const {test, expect} = require("@jest/globals")

test("normaliseURL", () => {
    const input = "https://blog.boot.dev/path/"
    const actual = normaliseURL(input)
    const expected = "blog.boot.dev/path"
    expect(actual).toEqual(expected)
})