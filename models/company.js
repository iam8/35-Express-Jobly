// Ioana A Mititean
// Unit 35 - Jobly

/**
 * Company model.
 */

"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for companies. */
class Company {

    /** Create a company (from data), update db, return new company data.
     *
     * data should be { handle, name, description, numEmployees, logoUrl }
     *
     * Returns { handle, name, description, numEmployees, logoUrl }
     *
     * Throws BadRequestError if company already in database.
     */
    static async create({ handle, name, description, numEmployees, logoUrl }) {
        const duplicateCheck = await db.query(
            `SELECT handle
            FROM companies
            WHERE handle = $1`,
            [handle]);

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate company: ${handle}`);
        }

        const result = await db.query(
            `INSERT INTO companies
            (handle, name, description, num_employees, logo_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"`,
            [
            handle,
            name,
            description,
            numEmployees,
            logoUrl,
            ],
        );

        const company = result.rows[0];
        return company;
    }

    /** Find all companies.
     *
     * Can filter result by passing in an object with any or all of the following properties:
     *    - nameLike (string)
     *    - minEmployees (integer)
     *    - maxEmployees (integer)
     *
     * Returns [{ handle, name, description, numEmployees, logoUrl }, ...]
     */
    static async findAll(filters) {

        let {nameLike, minEmployees, maxEmployees} = filters;

        // Build list of filter statements, if they exist
        let filterStmtList = [];

        if (nameLike !== undefined) {
            filterStmtList.push(`name ILIKE '${nameLike}'`);
        }

        if (minEmployees !== undefined) {
            filterStmtList.push(`num_employees >= ${minEmployees}`);
        }

        if (maxEmployees !== undefined) {
            filterStmtList.push(`num_employees <= ${maxEmployees}`);
        }

        // Build final filter statement
        let filterStmt = "";
        if (filterStmtList.length > 0) {
            filterStmt = `WHERE ${filterStmtList.join(" AND ")}`;
        }

        const companiesRes = await db.query(
            `SELECT handle,
                name,
                description,
                num_employees AS "numEmployees",
                logo_url AS "logoUrl"
            FROM companies
            ${filterStmt}
            ORDER BY name`);

        return companiesRes.rows;
    }

    /** Given a company handle, return data about company.
     *
     * Returns { handle, name, description, numEmployees, logoUrl, jobs }
     *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
     *
     * Throws NotFoundError if not found.
     */
    static async get(handle) {
        const companyRes = await db.query(
            `SELECT handle,
                    name,
                    description,
                    num_employees AS "numEmployees",
                    logo_url AS "logoUrl",
                    id,
                    title,
                    salary,
                    equity,
                    company_handle AS "companyHandle"
            FROM companies
            LEFT JOIN jobs
                    ON companies.handle = jobs.company_handle
            WHERE handle = $1`,
            [handle]
        );

        if (companyRes.rows.length === 0) throw new NotFoundError(`No company: ${handle}`);

        const {handle: compHandle, name, description, numEmployees, logoUrl} = companyRes.rows[0];
        const id = companyRes.rows[0].id;

        // Handle cases: company with vs without associated jobs
        let jobData = [];
        if (id !== null) {
            jobData = companyRes.rows.map((row) => {
                return {
                    id: row.id,
                    title: row.title,
                    salary: row.salary,
                    equity: row.equity,
                    companyHandle: row.companyHandle
                };
            });
        }

        return {handle: compHandle, name, description, numEmployees, logoUrl, jobs: jobData};
    }

    /** Update company data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain all the
     * fields; this only changes provided ones.
     *
     * Data can include: {name, description, numEmployees, logoUrl}
     *
     * Returns {handle, name, description, numEmployees, logoUrl}
     *
     * Throws NotFoundError if not found.
     */

    static async update(handle, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
            numEmployees: "num_employees",
            logoUrl: "logo_url",
            });

        const handleVarIdx = "$" + (values.length + 1);
        const querySql = `UPDATE companies
                        SET ${setCols}
                        WHERE handle = ${handleVarIdx}
                        RETURNING handle,
                                    name,
                                    description,
                                    num_employees AS "numEmployees",
                                    logo_url AS "logoUrl"`;
        const result = await db.query(querySql, [...values, handle]);
        const company = result.rows[0];

        if (!company) throw new NotFoundError(`No company: ${handle}`);

        return company;
    }

    /** Delete given company from database; returns undefined.
     *
     * Throws NotFoundError if company not found.
     **/
    static async remove(handle) {
        const result = await db.query(
            `DELETE
            FROM companies
            WHERE handle = $1
            RETURNING handle`,
            [handle]);
        const company = result.rows[0];

        if (!company) throw new NotFoundError(`No company: ${handle}`);
    }
}


module.exports = Company;
