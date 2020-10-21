import * as athena from '../athena';

(async () => {
    const queryString = 'SELECT * from mytest.test_table;'
    // const queryString = 'SELECT * from athena_tutorial_db.test_input;'
    const aa = await athena.query(queryString);

    console.log(aa);
})();
