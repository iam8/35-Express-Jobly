// Ioana A Mititean
// Unit 35 - Express Jobly

/**
 * Model for jobs.
 */

"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");


/**
 * Related functions for jobs.
 */
class Job {

    /**
     * Create a new job.
     */
    static async create({}) {

    }

    /**
     * Find all jobs.
     */
    static async findAll(filters) {

    }

    /**
     * Given a job title, return info about that job.
     */
    static async get(title) {

    }

    /**
     * Update job with 'data'.
     */
    static async update(title, data) {

    }

    /**
     * Delete a job.
     */
    static async remove(title) {

    }
}


module.exports = {
    Job
};
