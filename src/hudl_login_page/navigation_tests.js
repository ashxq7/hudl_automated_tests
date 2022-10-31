var assert = require('assert');
var webdriver = require('selenium-webdriver')
var driver;

describe('Hudl Login Page', function() {
    this.timeout(5000)

    beforeEach(function(done) {
        driver = new webdriver.Builder().
            forBrowser("chrome").build();
        driver.get("https://www.hudl.com/login");
        done()
    })

    afterEach(function(done) {
        driver.quit()
        done()
    })

    it('Tests the back button', async () => {
        await driver.findElement(webdriver.By.css("a[class^='styles_backIconContainer']")).click();

        var URL = await driver.getCurrentUrl();
        assert.equal(URL, "https://www.hudl.com/" );
    })

    it('Tests the logo button', async () => {
        await driver.findElement(webdriver.By.xpath("//a[contains(@class,'styles_hudlLogoContainer')]")).click();

        var URL = await driver.getCurrentUrl();
        assert.equal(URL, "https://www.hudl.com/" );
    })

    it('Tests the sign up button', async () => {
        await driver.findElement(webdriver.By.xpath("//a[contains(@class,'styles_signUpLink')]")).click();

        var URL = await driver.getCurrentUrl();
        assert.equal(URL, "https://www.hudl.com/register/signup" );
    })

    it('Tests the need help button', async () => {
        await driver.findElement(webdriver.By.css("a[data-qa-id='need-help-link']")).click()
        await driver.findElement(webdriver.By.css("h2[data-qa-id='login-help-headline']"))

        var URL = await driver.getCurrentUrl()
        var helpText = await driver.findElement(webdriver.By.tagName("body")).getText()
        await driver.wait(async () => {
            helpText = await driver.findElement(webdriver.By.tagName("body")).getText()
            return helpText.includes('Login Help')
        })
        assert.equal(URL, "https://www.hudl.com/login/help#")
    })

    it('Tests the need help, back button', async () => {
        await driver.findElement(webdriver.By.css("a[data-qa-id='need-help-link']")).click()
        var helpText = await driver.findElement(webdriver.By.tagName("body")).getText()
        await driver.wait(async () => {
            helpText = await driver.findElement(webdriver.By.tagName("body")).getText()
            return helpText.includes('Login Help')
        })
        await driver.findElement(webdriver.By.css("a[class^='styles_backIconContainer']")).click();

        var URL = await driver.getCurrentUrl();
        assert.equal(URL, "https://www.hudl.com/login" );
    })
})
