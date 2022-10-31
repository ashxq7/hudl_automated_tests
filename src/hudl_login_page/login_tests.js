var assert = require('assert');
var webdriver = require('selenium-webdriver')
var { email, pass } = require("./hudl_creds.json");
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

    it('Tests the sign in with organization button', async () => {
        await driver.findElement(webdriver.By.css("button[data-qa-id='log-in-with-organization-btn']")).click()
        await driver.wait(async () => {
            pageText = await driver.findElement(webdriver.By.tagName("body")).getText()
            return pageText.includes('Log into Hudl with your Organization')
        })

        var URL = await driver.getCurrentUrl();
        assert.equal(URL, "https://www.hudl.com/app/auth/login/organization" );
    })

    it('Tests the sign in with email button', async () => {
        await driver.findElement(webdriver.By.css("button[data-qa-id='log-in-with-organization-btn']")).click()
        await driver.wait(async () => {
            pageText = await driver.findElement(webdriver.By.tagName("body")).getText()
            return pageText.includes('Log In with Email and Password')
        })
        await driver.findElement(webdriver.By.css("button[data-qa-id='log-in-with-email-and-password']")).click()
        await driver.wait(async () => {
            pageText = await driver.findElement(webdriver.By.tagName("body")).getText()
            return pageText.includes('Log In with an Organization')
        })

        var pageText = await driver.findElement(webdriver.By.tagName("body")).getText()
        assert(pageText.includes('Need help'))
    })

    it('Tests login attempt with blank email and password', async () => {
        await driver.findElement(webdriver.By.css("button[data-qa-id='login-btn']")).click()
        await driver.wait(async () => {
            pageText = await driver.findElement(webdriver.By.tagName("body")).getText()
            return pageText.includes('We didn\'t recognize that email and/or password.')
        })

        assert(pageText.includes('We didn\'t recognize that email and/or password.'))
    })

    it('Tests login attempt with email and blank password', async () => {
        await driver.findElement(webdriver.By.css("input[data-qa-id='email-input']")).sendKeys(email)
        await driver.findElement(webdriver.By.css("button[data-qa-id='login-btn']")).click()
        await driver.wait(async () => {
            pageText = await driver.findElement(webdriver.By.tagName("body")).getText()
            return pageText.includes('We didn\'t recognize that email and/or password.')
        })

        assert(pageText.includes('We didn\'t recognize that email and/or password.'))
    })

    it('Tests login attempt with wrong password and blank email', async () => {
        await driver.findElement(webdriver.By.css("input[data-qa-id='password-input']")).sendKeys("wrongpassword")
        await driver.findElement(webdriver.By.css("button[data-qa-id='login-btn']")).click()
        await driver.wait(async () => {
            pageText = await driver.findElement(webdriver.By.tagName("body")).getText()
            return pageText.includes('We didn\'t recognize that email and/or password.')
        })

        assert(pageText.includes('We didn\'t recognize that email and/or password.'))
    })

    it('Tests login attempt with email and wrong password', async () => {
        await driver.findElement(webdriver.By.css("input[data-qa-id='email-input']")).sendKeys(email)
        await driver.findElement(webdriver.By.css("input[data-qa-id='password-input']")).sendKeys("wrongpassword")
        await driver.findElement(webdriver.By.css("button[data-qa-id='login-btn']")).click()
        await driver.wait(async () => {
            pageText = await driver.findElement(webdriver.By.tagName("body")).getText()
            return pageText.includes('We didn\'t recognize that email and/or password.')
        })

        assert(pageText.includes('We didn\'t recognize that email and/or password.'))
    })

    it('Tests login attempt with correct email and password', async () => {
        await driver.findElement(webdriver.By.css("input[data-qa-id='email-input']")).sendKeys(email)
        await driver.findElement(webdriver.By.css("input[data-qa-id='password-input']")).sendKeys(pass)
        await driver.findElement(webdriver.By.css("button[data-qa-id='login-btn']")).click()
        await driver.wait(async () => {
            pageText = await driver.findElement(webdriver.By.tagName("body")).getText()
            return !pageText.includes('Log In')
        })

        var URL = await driver.getCurrentUrl();
        assert.equal(URL, "https://www.hudl.com/home" );
    })

    it('Tests login attempt with incorrect organization email', async () => {
        await driver.findElement(webdriver.By.css("button[data-qa-id='log-in-with-organization-btn']")).click()
        await driver.wait(async () => {
            pageText = await driver.findElement(webdriver.By.tagName("body")).getText()
            return pageText.includes('Log In with Email and Password')
        })
        await driver.findElement(webdriver.By.id("uniId_1")).sendKeys(email)
        await driver.findElement(webdriver.By.css("button[data-qa-id='log-in-with-sso']")).click()
        await driver.wait(async () => {
            pageText = await driver.findElement(webdriver.By.tagName("body")).getText()
            return pageText.includes('This account can\'t log in with an organization yet.')
        })

        assert(pageText.includes('This account can\'t log in with an organization yet.'))
    })
})
