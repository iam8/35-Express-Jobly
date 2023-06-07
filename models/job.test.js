// Ioana A Mititean
// Unit 35 - Express Jobly

/**
 * Tests for the job model.
 */

"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const { Job } = require("./job.js");

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


// CREATE -----------------------------------------------------------------------------------------

describe("Testing create() method", () => {

    test("Functions correctly with appropriate input", async () => {

    })

    test("Throws BadRequestError for duplicate job input", async () => {

    })

    test("Throws BadRequestError for a nonexistent company_handle", async () => {

    })

})

//-------------------------------------------------------------------------------------------------


// FIND ALL ---------------------------------------------------------------------------------------

describe("Testing findAll() method", () => {

    test("Functions correctly with no filters", async () => {

    })

    // TODO: tests for filters
})

//-------------------------------------------------------------------------------------------------


// GET --------------------------------------------------------------------------------------------

describe("Testing get() method", () => {

    test("Functions correctly with appropriate input", async () => {

    })

    test("Throws NotFoundError for a nonexistent job ID", async () => {

    })
})

//-------------------------------------------------------------------------------------------------


// UPDATE -----------------------------------------------------------------------------------------

describe("Testing update() method", () => {

    test("Throws BadRequestError when given no input data", async () => {

    })

    test("Works correctly for partial update", async () => {

    })

    test("Works correctly for full update", async () => {

    })

    test("Throws NotFoundError for a nonexistent job ID", async () => {

    })
})

//-------------------------------------------------------------------------------------------------


// REMOVE -----------------------------------------------------------------------------------------

describe("Testing remove() method", () => {

    test("Functions correctly with appropriate input", async () => {

    })

    test("Throws NotFoundError for a nonexistent job ID", async () => {

    })
})

//-------------------------------------------------------------------------------------------------
