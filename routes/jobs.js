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
