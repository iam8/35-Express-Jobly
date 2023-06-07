const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
    await db.query("DELETE FROM jobs");
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM companies");
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM users");

    await db.query(`
        INSERT INTO companies(handle, name, num_employees, description, logo_url)
        VALUES ('c1', 'C1', 1, 'Desc1', 'http://c1.img'),
            ('c2', 'C2', 2, 'Desc2', 'http://c2.img'),
            ('c3', 'C3', 3, 'Desc3', 'http://c3.img')`);

    await db.query(`
        INSERT INTO users(username,
                        password,
                        first_name,
                        last_name,
                        email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
            ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
        [
            await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
            await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
        ]
    );

    await db.query(`
        INSERT INTO jobs
            (title, salary, equity, company_handle)
        VALUES
            ('job1', 100, 0.1, 'c1'),
            ('job2', 200, 0.2, 'c2'),
            ('job3', 300, 0.3, 'c3'),
            ('job4', 400, 0.4, 'c1')
        RETURNING id`
    );
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};