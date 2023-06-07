// Ioana A Mititean
// Unit 35 - Express Jobly

/**
 * Model for jobs.
 */

"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


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
     *
     * TODO: should throw a BadRequestError if company_handle doesn't exist
     */
    static async create({title, salary, equity, company_handle}) {
        const duplicateCheck = await db.query(`
            SELECT title FROM jobs
            WHERE title = $1`,
            [title]
        );

        if (duplicateCheck.rows[0])
            throw new BadRequestError(`Duplicate job: '${title}'`);

        const result = await db.query(`
            INSERT INTO jobs
                (title, salary, equity, company_handle)
            VALUES
                ($1, $2, $3, $4)
            RETURNING
                (id, title, salary, equity, company_handle AS "companyHandle")`,
            [title, salary, equity, company_handle]
        );

        const job = result.rows[0];
        return job;
    }

    /**
     * Find all jobs.
     *
     * TODO: filtering.
     *
     * Returns: [{id, title, salary, equity, company_handle}, ...]
     */
    static async findAll(filters) {
        const jobs = await db.query(`
            SELECT id, title, salary, equity, company_handle AS "companyHandle"
            FROM jobs
            ORDER BY title`
        );

        return jobs.rows;
    }

    /**
     * Given a job ID, return data about that job.
     *
     * Returns {id, title, salary, equity, company_handle}
     *
     * Throws NotFoundError if job not found.
     */
    static async get(id) {
        const jobRes = await db.query(`
            SELECT id, title, salary, equity, company_handle AS "companyHandle"
            FROM jobs
            WHERE id = $1`,
            [id]
        );

        const job = jobRes.rows[0];
        if (!job) throw new NotFoundError(`Job not found: "${id}"`);

        return job;
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
        const { setCols, values } = sqlForPartialUpdate(data, {});
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE jobs
                          SET ${setCols}
                          WHERE id = ${idVarIdx}
                          RETURNING id,
                                    title,
                                    salary,
                                    equity,
                                    company_handle AS "companyHandle"`;

        const result = await db.query(querySql, [...values, id]);
        const job = result.rows[0];

        if (!job) throw new NotFoundError(`No job found: ${id}`);

        return job;
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
