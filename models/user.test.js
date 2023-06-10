"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


// HELPERS FOR TESTS ------------------------------------------------------------------------------

/**
 * Get the ID of the job with the given title from the database.
 *
 * Returns: job ID (integer)
 */
async function getId(jobTitle) {
    const idRes = await db.query(`
        SELECT id FROM jobs
        WHERE title = $1`,
        [jobTitle]
    );

    return idRes.rows[0].id;
}

//-------------------------------------------------------------------------------------------------


/************************************** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      isAdmin: false,
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("c1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** register */

describe("register", function () {
  const newUser = {
    username: "new",
    firstName: "Test",
    lastName: "Tester",
    email: "test@test.com",
    isAdmin: false,
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("works: adds admin", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
      isAdmin: true,
    });
    expect(user).toEqual({ ...newUser, isAdmin: true });
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(true);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        isAdmin: false,
      },
      {
        username: "u2",
        firstName: "U2F",
        lastName: "U2L",
        email: "u2@email.com",
        isAdmin: false,
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {

    test("Works for user with job applications", async function () {

        // Get job IDs from database
        const jobId1 = await getId("job1");
        const jobId2 = await getId("job2");
        const jobId3 = await getId("job3");

        let user = await User.get("u1");

        expect(user).toEqual({
            username: "u1",
            firstName: "U1F",
            lastName: "U1L",
            email: "u1@email.com",
            isAdmin: false,
            jobs: [jobId1, jobId2, jobId3]
        });
    });

    test("Works for user with no job applications", async () => {

        let user = await User.get("u2");

        expect(user).toEqual({
            username: "u2",
            firstName: "U2F",
            lastName: "U2L",
            email: "u2@email.com",
            isAdmin: false,
            jobs: []
        })
    })

    test("not found if no such user", async function () {
        try {
            await User.get("nope");
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    firstName: "NewF",
    lastName: "NewF",
    email: "new@email.com",
    isAdmin: true,
  };

  test("works", async function () {
    let job = await User.update("u1", updateData);
    expect(job).toEqual({
      username: "u1",
      ...updateData,
    });
  });

  test("works: set password", async function () {
    let job = await User.update("u1", {
      password: "new",
    });
    expect(job).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      isAdmin: false,
    });
    const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("not found if no such user", async function () {
    try {
      await User.update("nope", {
        firstName: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await User.remove("u1");
    const res = await db.query(
        "SELECT * FROM users WHERE username='u1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


// APPLY FOR JOB ----------------------------------------------------------------------------------

describe("Applying for a job", () => {

    test("Works for appropriate inputs", async () => {

        // Grab ID of job5 from database
        const jobId = await getId("job5");

        const application = await User.applyForJob("u1", jobId);

        // Check return value
        expect(application).toEqual({
            username: "u1",
            jobId
        });

        // Check that database is updated accordingly
        const appRes = await db.query(`
            SELECT username, job_id FROM applications
            WHERE username = $1 AND job_id = $2`,
            ["u1", jobId]
        );

        expect(appRes.rows.length).toEqual(1);
    })

    test("Returns error (status 404) for a nonexistent username", async () => {

        // Grab ID of job1 from database
        const jobId = await getId("job5");

        try {
            await User.applyForJob("nonexistent", jobId);
        } catch(err) {
            expect(err).toEqual(new NotFoundError("No user found: 'nonexistent'"));
        }
    })

    test("Returns error (status 404) for a nonexistent job ID", async () => {

        try {
            await User.applyForJob("u1", 0);
        } catch(err) {
            expect(err).toEqual(new NotFoundError("No job found: '0'"));
        }
    })
})

//-------------------------------------------------------------------------------------------------
