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
    u2Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


// POST /jobs -------------------------------------------------------------------------------------

describe("POST /jobs", () => {

})

//-------------------------------------------------------------------------------------------------


// GET /jobs --------------------------------------------------------------------------------------

describe("GET /jobs", () => {

})

//-------------------------------------------------------------------------------------------------


// GET /jobs/:id ----------------------------------------------------------------------------------

describe("GET /jobs/:id", () => {

})

//-------------------------------------------------------------------------------------------------


// PATCH /jobs/:id --------------------------------------------------------------------------------

describe("PATCH /jobs/:id", () => {

})

//-------------------------------------------------------------------------------------------------


// DELETE /jobs/:id -------------------------------------------------------------------------------

describe("DELETE /jobs/:id", () => {

})

//-------------------------------------------------------------------------------------------------
