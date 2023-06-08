// Ioana A Mititean
// Unit 35 - Express Jobly

/**
 * Tests for job routes.
 */

"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");
const { BadRequestError } = require("../expressError");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token  // Admin token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

const basicAuth = `Bearer ${u1Token}`;
const adminAuth = `Bearer ${u2Token}`;


// POST /jobs -------------------------------------------------------------------------------------

describe("POST /jobs", () => {

    const newJob = {
        title: "New Job 1",
        salary: 999,
        equity: 0.999,
        companyHandle: "c1"
    };

    test("Works for admins", async () => {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", adminAuth);

        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            job: {
                id: expect.any(Number),
                title: "New Job 1",
                salary: 999,
                equity: "0.999",
                companyHandle: "c1"
            }
        });
    })

    test("Returns error with status 401 for a user that isn't logged in", async () => {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob);

        expect(resp.statusCode).toEqual(401);
        expect(resp.body).toEqual({
            error: {
                status: 401,
                message: "Unauthorized"
            }
        });
    })

    test("Returns error with status 401 for a logged-in, non-admin user", async () => {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", basicAuth);

        expect(resp.statusCode).toEqual(401);
        expect(resp.body).toEqual({
            error: {
                status: 401,
                message: "Unauthorized"
            }
        });
    })

    // TODO: JSONSCHEMA
    // test("Returns error with status 400 for request with missing data", async () => {

    // })

    // TODO: JSONSCHEMA
    // test("Returns error with status 400 for request with invalid data", async () => {

    // })
})

//-------------------------------------------------------------------------------------------------


// GET /jobs --------------------------------------------------------------------------------------

describe("GET /jobs", () => {

    const noFiltersRes = {
        jobs: [
            {
                id: expect.any(Number),
                title: "job1",
                salary: 100,
                equity: "0.1",
                companyHandle: "c1"
            },
            {
                id: expect.any(Number),
                title: "job2",
                salary: 200,
                equity: "0.2",
                companyHandle: "c3"
            },
            {
                id: expect.any(Number),
                title: "job3",
                salary: 300,
                equity: "0.3",
                companyHandle: "c3"
            },
            {
                id: expect.any(Number),
                title: "job4",
                salary: 400,
                equity: "0.4",
                companyHandle: "c1"
            }
        ]
    }

    test("Works for a user that isn't logged in", async () => {
        const resp = await request(app).get("/jobs");

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual(noFiltersRes);
    })

    test("Works for a logged-in, non-admin user", async () => {
        const resp = await request(app)
            .get("/jobs")
            .set("authorization", basicAuth);

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual(noFiltersRes);
    })

    test("Works for admins", async () => {
        const resp = await request(app)
            .get("/jobs")
            .set("authorization", adminAuth);

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual(noFiltersRes);
    })

    // test("Responds with status 200 and correctly-structured body for some filters used",
    //     async () => {

    // })

    // test("Responds with status 200 and correctly-structured body for all filters used",
    //     async () => {

    // })

    test("Returns error with status 400 if minSalary < 0", async () => {
        const resp = await request(app).get("/jobs/?minSalary=-3");

        expect(resp.statusCode).toEqual(400);
        expect(resp.body).toEqual({
            error: {
                status: 400,
                message: "minSalary must be >= 0"
            }
        });
    })

    test("Returns error with status 400 if non-allowed filters are used", async () => {
        const resp = await request(app).get("/jobs/?notAllowed=blah");

        expect(resp.statusCode).toEqual(400);
        expect(resp.body).toEqual({
            error: {
                status: 400,
                message: "Filter not allowed: notAllowed"
            }
        });
    })
})

//-------------------------------------------------------------------------------------------------


// GET /jobs/:id ----------------------------------------------------------------------------------

describe("GET /jobs/:id", () => {

    // test("Works for a user that isn't logged in", async () => {

    // })

    // test("Works for a logged-in, non-admin user", async () => {

    // })

    // test("Works for admins", async () => {

    // })

    // test("Returns error with status 404 if job not found", async () => {

    // })
})

//-------------------------------------------------------------------------------------------------


// PATCH /jobs/:id --------------------------------------------------------------------------------

describe("PATCH /jobs/:id", () => {

    // test("Works for admins - full update", async () => {

    // })

    // test("Works for admins - partial update", async () => {

    // })

    // test("Returns error with status 401 for a user that isn't logged in", async () => {

    // })

    // test("Returns error with status 401 for a logged-in, non-admin user", async () => {

    // })

    // test("Returns error with status 400 for request with invalid data", async () => {

    // })

    // test("Returns error with status 400 for non-allowed field input", async () => {

    // })

    // test("Returns error with status 404 if job not found", async () => {

    // })
})

//-------------------------------------------------------------------------------------------------


// DELETE /jobs/:id -------------------------------------------------------------------------------

describe("DELETE /jobs/:id", () => {

    // test("Works for admins", async () => {

    // })

    // test("Returns error with status 401 for a user that isn't logged in", async () => {

    // })

    // test("Returns error with status 401 for a logged-in, non-admin user", async () => {

    // })

    // test("Returns error with status 404 if job not found", async () => {

    // })
})

//-------------------------------------------------------------------------------------------------
