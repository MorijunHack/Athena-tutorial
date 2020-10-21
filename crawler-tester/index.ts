import * as glue from '../glue';

(async() => {
    await glue.startCrawler();

    console.log(await glue.waitForCrawler());
})();