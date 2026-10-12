const { getPool } = require('../config/db');

class Feedback {
    constructor(data) {
        this._id = data._id;
        this.id = data.id;
        this.grievanceId = data.grievanceId;
        this.satisfied = data.satisfied;
        this.comments = data.comments;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    // ─── normalizeRow ────────────────────────────────────────────────────────

    static normalizeRow(row) {
        if (!row) return null;
        return {
            _id: String(row.id),
            id: String(row.id),
            grievanceId: row.grievance_id != null ? String(row.grievance_id) : null,
            satisfied: Boolean(row.satisfied),
            comments: row.comments,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }

    static fromRow(row) {
        const normalized = Feedback.normalizeRow(row);
        return normalized ? new Feedback(normalized) : null;
    }

    // ─── buildWhere ──────────────────────────────────────────────────────────

    static buildWhere(filter = {}) {
        const clauses = [];
        const params = [];

        if (filter.grievanceId !== undefined) {
            clauses.push('grievance_id = ?');
            params.push(Number(filter.grievanceId));
        }

        if (filter._id !== undefined) {
            clauses.push('id = ?');
            params.push(Number(filter._id));
        }

        if (filter.id !== undefined) {
            clauses.push('id = ?');
            params.push(Number(filter.id));
        }

        if (filter.satisfied !== undefined) {
            clauses.push('satisfied = ?');
            params.push(filter.satisfied ? 1 : 0);
        }

        const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
        return { whereSql, params };
    }

    // ─── Static CRUD ─────────────────────────────────────────────────────────

    static async findOne(filter = {}) {
        const pool = getPool();
        const { whereSql, params } = Feedback.buildWhere(filter);
        const [rows] = await pool.execute(
            `SELECT * FROM feedbacks ${whereSql} ORDER BY id DESC LIMIT 1`,
            params
        );
        return Feedback.fromRow(rows[0]);
    }

    static async findById(id) {
        const pool = getPool();
        const [rows] = await pool.execute(
            'SELECT * FROM feedbacks WHERE id = ? LIMIT 1',
            [Number(id)]
        );
        return Feedback.fromRow(rows[0]);
    }

    static async find(filter = {}) {
        const pool = getPool();
        const { whereSql, params } = Feedback.buildWhere(filter);
        const [rows] = await pool.execute(
            `SELECT * FROM feedbacks ${whereSql} ORDER BY id DESC`,
            params
        );
        return rows.map((row) => Feedback.fromRow(row));
    }

    static async create(data) {
        const pool = getPool();
        const [result] = await pool.execute(
            `INSERT INTO feedbacks (grievance_id, satisfied, comments)
             VALUES (?, ?, ?)`,
            [
                data.grievanceId != null ? Number(data.grievanceId) : null,
                data.satisfied ? 1 : 0,
                data.comments || null,
            ]
        );
        return Feedback.findById(result.insertId);
    }

    static async findByIdAndUpdate(id, updateData = {}, opts = {}) {
        const pool = getPool();
        const setClauses = [];
        const params = [];

        if (updateData.satisfied !== undefined) {
            setClauses.push('satisfied = ?');
            params.push(updateData.satisfied ? 1 : 0);
        }
        if (updateData.comments !== undefined) {
            setClauses.push('comments = ?');
            params.push(updateData.comments || null);
        }
        if (updateData.grievanceId !== undefined) {
            setClauses.push('grievance_id = ?');
            params.push(Number(updateData.grievanceId));
        }

        if (setClauses.length > 0) {
            params.push(Number(id));
            await pool.execute(
                `UPDATE feedbacks SET ${setClauses.join(', ')} WHERE id = ?`,
                params
            );
        }

        return Feedback.findById(id);
    }

    // ─── Instance save() ─────────────────────────────────────────────────────

    async save() {
        const pool = getPool();
        await pool.execute(
            `UPDATE feedbacks
             SET grievance_id = ?, satisfied = ?, comments = ?
             WHERE id = ?`,
            [
                this.grievanceId != null ? Number(this.grievanceId) : null,
                this.satisfied ? 1 : 0,
                this.comments || null,
                Number(this._id),
            ]
        );

        const latest = await Feedback.findById(this._id);
        Object.assign(this, latest);
        return this;
    }
}

module.exports = Feedback;