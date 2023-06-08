// Ioana A Mititean
// Unit 35 - Express Jobly

/**
 * Routes for jobs.
 */

"use strict";

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const { Job } = require("../models/job");

const router = new express.Router();


/** POST / { job } =>  { job }
 *
 * Job input should be { title, salary, equity, companyHandle }.
 *
 * Returns { title, salary, equity, companyHandle }.
 *
 * Authorization required: login, admin
 */
router.post("/", ensureAdmin, async (req, res, next) => {

})


/** GET /  => { jobs: [{ id, title, salary, equity, companyHandle }, ...] }
 *
 * Can filter on the following search filters:
 * - title: by job title (case insensitive, partial matches)
 * - minSalary: jobs with at least that salary
 * - hasEquity:
 *      - If true, filter to jobs that provide a non-zero amount of equity
 *      - If false or not included in the filtering, list all jobs regardless of equity
 *
 * Throw error with status code 400 if minSalary < 0 or if a query param is provided
 * that is not in the above filter list.
 *
 * Authorization required: none
 */
router.get("/", async (req, res, next) => {

})


/** GET /[id]  =>  { job }
 *
 * Returned job format: { id, title, salary, equity, companyHandle }.
 *
 * Throw error 404 if job not found.
 *
 * Authorization required: none
 */
router.get("/:id", async (req, res, next) => {

})


/** PATCH /[id] { fld1, fld2, ... } => { job }
 *
 * Patches data for the job with the given ID.
 *
 * Field inputs include any or all of: { title, salary, equity }.
 *
 * Throw error (status 400) if attempting to modify any fields other than the above.
 * Throw error 404 if job not found.
 *
 * Returns { id, title, salary, equity, companyHandle } of the patched job.
 *
 * Authorization required: login, admin
 */
router.patch("/:id", ensureAdmin, async (req, res, next) => {

})


/** DELETE /[id]  =>  { deleted: id }
 *
 * Throw error 404 if job not found.
 *
 * Authorization: login, admin
 */
router.delete("/:id", ensureAdmin, async (req, res, next) => {

})



module.exports = {
    router
};
