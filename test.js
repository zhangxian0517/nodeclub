/**
 * 注册、登录、发布话题、上传图片、链接、回帖、编辑回帖、删除回帖
 */
describe('注册、登录、发布话题和回帖等功能', function () {
    var assert = require('assert');
    require('chromedriver');
    var webdriver = require('selenium-webdriver');
    var driver = new webdriver.Builder().forBrowser('chrome').build();
    var fs = require('fs');
    var MongoClient = require('mongodb').MongoClient;
    const url = 'mongodb://192.168.161.129:3000';
    this.timeout(60000)
    before(function () {
        driver.manage().window().maximize();
    });

    after(function () {
        driver.close();
    });

    beforeEach(function () {
        // runs before each test in this block

    });

    afterEach(async function () {
        await driver.takeScreenshot().then(function (imagedata) {
            var day = new Date().valueOf();
            fs.writeFileSync('test/image/' + day + '.png', imagedata, 'base64')
        })
    });
    describe('注册功能',  function () {
        it('打开首页', async () => {
            await driver.get('http://192.168.161.129:3000/');
        });
        it('点击注册按钮', async () => {
            await driver.findElement({ linkText: '注册' }).click();
        });
        it('输入注册信息，修改数据库', async () => {
            let user = Date.now();
            await driver.findElement({ id: 'loginname' }).sendKeys(user);
            await driver.findElement({ id: 'pass' }).sendKeys('123456');
            await driver.findElement({ id: 're_pass' }).sendKeys('123456');
            await driver.findElement({ id: 'email' }).sendKeys(`${user}@domain.com`);
            await driver.findElement({ className: 'span-primary' }).submit().then(() => {
                MongoClient.connect(url, function (err, db) {
                    assert.equal(null, err);
                    console.log("Connected correctly to server");
                    let collection = db.collection("users")
                    collection.findOne({ name: `${user}` }, function (err, docs) {
                        console.log(docs.name)
                        assert.equal(err, null)
                        assert.equal(`${user}`, docs.name)
                    })
                    collection.updateOne({ name: `${user}` }, { $set: { "active": true } }, function (err, docs) {
                        assert.equal(null, err);
                        // console.log(docs)
                    })
                    db.close();
                });
            })
        });
    })

    describe('登录功能', function () {
        it('打开首页', async () => {
            await driver.get('http://192.168.75.107:3000/');
        });
        it('点击登录按钮', async () => {
            await driver.findElement({ linkText: '登录' }).click();
        });
        it('输入用户名和密码', async () => {
            await driver.findElement({ id: 'name' }).sendKeys('abcduxiaolei');
            await driver.findElement({ id: 'pass' }).sendKeys('abc4862556');
        });
        it('点击登录', async () => {
            await driver.findElement({ css: '.span-primary' }).submit();
        });
        it('assert', async () => {
            driver.findElement({ linkText: 'abcduxiaolei' }).getText().then((as) => {
                console.log(as);
                assert.deepEqual('abcduxiaolei', as);
            })
        });
    })

    describe('发布话题', function () {
        it('点击发布话题', async () => {
            await driver.findElement({ className: 'span-success' }).click();
        });
        it('选择分享下拉列表，输入标题', async () => {
            await driver.findElement({ id: 'tab-value' }).click();
            await driver.findElement({ css: '#tab-value>option:nth-child(2)' }).click();
            await driver.findElement({ id: 'title' }).sendKeys('今天是星期六');
        });
        it('添加图片', async () => {
            await driver.findElement({ css: '.eicon-image' }).click();
            await driver.findElement({ name: 'file' }).sendKeys('E://01.png');
        });
        it('点击链接', async () => {
            await driver.sleep(2000);
            await driver.findElement({ css: '.eicon-link' }).click();
            await driver.sleep(2000);
            await driver.findElement({ xpath: '/html/body/div[4]/div[2]/form/div[1]/div/input' }).click()
            await driver.findElement({ xpath: '/html/body/div[4]/div[2]/form/div[1]/div/input' }).sendKeys('打开百度首页');
            await driver.findElement({ xpath: '/html/body/div[4]/div[2]/form/div[2]/div/input' }).clear()
            await driver.findElement({ xpath: '/html/body/div[4]/div[2]/form/div[2]/div/input' }).sendKeys('https://www.baidu.com/');

        it('删除回复', async () => {
            await driver.findElement({ css: '.delete_reply_btn' }).click();
            await driver.switchTo().alert().then((alert) => {
                return alert.accept();
            })
        });
    })
})
})
