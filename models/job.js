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
     * Throws BadRequestError if job is already in database, or if the given company handle doesn't
     * exist.
     */
    static async create({title, salary, equity, company_handle}) {

        // Check for duplicate job
        const duplicateCheck = await db.query(`
            SELECT title FROM jobs
            WHERE title = $1`,
            [title]
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate job: '${title}'`);
        }

        // Check for presence of company handle in database
        const companyRes = await db.query(`
            SELECT name FROM companies
            WHERE handle = $1`,
            [company_handle]
        );

        if (companyRes.rows[0] === undefined) {
            throw new BadRequestError(`Company handle doesn't exist: '${company_handle}'`);
        }

        // Create and send final query
        const result = await db.query(`
            INSERT INTO jobs
                (title, salary, equity, company_handle)
            VALUES
                ($1, $2, $3, $4)
            RETURNING
                id, title, salary, equity, company_handle AS "companyHandle"`,
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
        if (!job) throw new NotFoundError(`Job not found: '${id}'`);

        return job;
    }

    /**
     * Update data of the job with the given ID using 'data'.
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
        const { setCols, values } = sqlForPartialUpdate(data, {companyHandle: "company_handle"});
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
        const result = await db.query(
            `DELETE
             FROM jobs
             WHERE id = $1
             RETURNING id`,
            [id]);

      const job = result.rows[0];

      if (!job) throw new NotFoundError(`No job found: ${id}`);
    }
}


module.exports = {
    Job
};
