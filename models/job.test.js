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


})

//-------------------------------------------------------------------------------------------------


// FIND ALL ---------------------------------------------------------------------------------------

describe("Testing findAll() method", () => {

})

//-------------------------------------------------------------------------------------------------


// GET --------------------------------------------------------------------------------------------

describe("Testing get() method", () => {

})

//-------------------------------------------------------------------------------------------------


// UPDATE -----------------------------------------------------------------------------------------

describe("Testing update() method", () => {

})

//-------------------------------------------------------------------------------------------------


// REMOVE -----------------------------------------------------------------------------------------

describe("Testing remove() method", () => {

})

//-------------------------------------------------------------------------------------------------
