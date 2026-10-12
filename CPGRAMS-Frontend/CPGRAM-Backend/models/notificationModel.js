const { getPool } = require('../config/db');

class Notification {
    constructor(data) {
        this._id = data._id;
        this.id = data.id;
        this.recipientId = data.recipientId;
        this.title = data.title;
        this.message = data.message;
        this.isRead = data.isRead;
        this.link = data.link;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    // ─── normalizeRow ────────────────────────────────────────────────────────

    static normalizeRow(row) {
        if (!row) return null;
        return {
            _id: String(row.id),
            id: String(row.id),
            recipientId: row.recipient_id != null ? String(row.recipient_id) : null,
            title: row.title,
            message: row.message,
            isRead: Boolean(row.is_read),
            link: row.link,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }

    static fromRow(row) {
        const normalized = Notification.normalizeRow(row);
        return normalized ? new Notification(normalized) : null;
    }

    // ─── buildWhere ──────────────────────────────────────────────────────────

    static buildWhere(filter = {}) {
        const clauses = [];
        const params = [];

        if (filter.recipientId !== undefined) {
            clauses.push('recipient_id = ?');
            params.push(Number(filter.recipientId));
        }

        if (filter.isRead !== undefined) {
            clauses.push('is_read = ?');
            params.push(filter.isRead ? 1 : 0);
        }

        if (filter._id !== undefined) {
            clauses.push('id = ?');
            params.push(Number(filter._id));
        }

        if (filter.id !== undefined) {
            clauses.push('id = ?');
            params.push(Number(filter.id));
        }

        const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
        return { whereSql, params };
    }

    // ─── Static CRUD ─────────────────────────────────────────────────────────

    static async findOne(filter = {}) {
        const pool = getPool();
        const { whereSql, params } = Notification.buildWhere(filter);
        const [rows] = await pool.execute(
            `SELECT * FROM notifications ${whereSql} ORDER BY id DESC LIMIT 1`,
            params
        );
        return Notification.fromRow(rows[0]);
    }

    static async findById(id) {
        const pool = getPool();
        const [rows] = await pool.execute(
            'SELECT * FROM notifications WHERE id = ? LIMIT 1',
            [Number(id)]
        );
        return Notification.fromRow(rows[0]);
    }

    static async find(filter = {}) {
        const pool = getPool();
        const { whereSql, params } = Notification.buildWhere(filter);
        const [rows] = await pool.execute(
            `SELECT * FROM notifications ${whereSql} ORDER BY id DESC`,
            params
        );
        return rows.map((row) => Notification.fromRow(row));
    }

    static async create(data) {
        const pool = getPool();
        const [result] = await pool.execute(
            `INSERT INTO notifications (recipient_id, title, message, is_read, link)
             VALUES (?, ?, ?, ?, ?)`,
            [
                data.recipientId != null ? Number(data.recipientId) : null,
                data.title,
                data.message,
                data.isRead ? 1 : 0,
                data.link || null,
            ]
        );
        return Notification.findById(result.insertId);
    }

    static async findByIdAndUpdate(id, updateData = {}, opts = {}) {
        const pool = getPool();
        const setClauses = [];
        const params = [];

        if (updateData.title !== undefined) {
            setClauses.push('title = ?');
            params.push(updateData.title);
        }
        if (updateData.message !== undefined) {
            setClauses.push('message = ?');
            params.push(updateData.message);
        }
        if (updateData.isRead !== undefined) {
            setClauses.push('is_read = ?');
            params.push(updateData.isRead ? 1 : 0);
        }
        if (updateData.link !== undefined) {
            setClauses.push('link = ?');
            params.push(updateData.link || null);
        }
        if (updateData.recipientId !== undefined) {
            setClauses.push('recipient_id = ?');
            params.push(Number(updateData.recipientId));
        }

        if (setClauses.length > 0) {
            params.push(Number(id));
            await pool.execute(
                `UPDATE notifications SET ${setClauses.join(', ')} WHERE id = ?`,
                params
            );
        }

        return Notification.findById(id);
    }

    /**
     * Mark all notifications for a recipient as read.
     * Equivalent to: Notification.updateMany({ recipientId }, { isRead: true })
     */
    static async markAllReadForRecipient(recipientId) {
        const pool = getPool();
        await pool.execute(
            'UPDATE notifications SET is_read = 1 WHERE recipient_id = ?',
            [Number(recipientId)]
        );
    }

    // ─── Instance save() ─────────────────────────────────────────────────────

    async save() {
        const pool = getPool();
        await pool.execute(
            `UPDATE notifications
             SET recipient_id = ?, title = ?, message = ?, is_read = ?, link = ?
             WHERE id = ?`,
            [
                this.recipientId != null ? Number(this.recipientId) : null,
                this.title,
                this.message,
                this.isRead ? 1 : 0,
                this.link || null,
                Number(this._id),
            ]
        );

        const latest = await Notification.findById(this._id);
        Object.assign(this, latest);
        return this;
    }
}

module.exports = Notification;