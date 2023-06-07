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
     * Create a new job from given data, update database, and return the new job data.
     *
     * Data format: {title, salary, equity, company_handle}
     *
     * Returns: {id, title, salary, equity, company_handle}
     *
     * Throws BadRequestError if job is already in database.
     */
    static async create({title, salary, equity, company_handle}) {

    }

    /**
     * Find all jobs.
     *
     * TODO: filtering.
     *
     * Returns: [{id, title, salary, equity, company_handle}, ...]
     */
    static async findAll(filters) {

    }

    /**
     * Given a job ID, return data about that job.
     *
     * Returns {id, title, salary, equity, company_handle}
     *
     * Throws NotFoundError if job not found.
     */
    static async get(id) {

    }

    /**
     * Update job data with 'data'.
     *
     * This is a "partial update" --- it's fine if data doesn't contain all the fields; this only
     * changes provided ones.
     *
     * Data can include: {title, salary, equity}
     *
     * Returns {id, title, salary, equity, company_handle}
     *
     * Throws NotFoundError if job not found.
     */
    static async update(id, data) {

    }

    /**
     * Delete a job (by ID).
     *
     * Returns undefined.
     *
     * Throws NotFoundError if job not found.
     */
    static async remove(id) {

    }
}


module.exports = {
    Job
};
