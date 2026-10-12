const { getPool } = require('../config/db');

const VALID_STATUSES = ['Pending', 'In Progress', 'Resolved', 'Closed'];

class Grievance {
    constructor(data) {
        this._id = data._id;
        this.id = data.id;
        this.userId = data.userId;
        this.status = data.status;
        this.uniqueID = data.uniqueID;
        this.ministryName = data.ministryName;
        this.departmentName = data.departmentName;
        this.publicAuthority = data.publicAuthority;
        this.title = data.title;
        this.category = data.category;
        this.locationOfIssue = data.locationOfIssue;
        this.dateOfIncident = data.dateOfIncident;
        this.grievanceDescription = data.grievanceDescription;
        this.resolution = data.resolution;
        this.assignedTo = data.assignedTo;
        this.assignedBy = data.assignedBy;
        this.escalatedToLeadOfficer = data.escalatedToLeadOfficer;
        this.escalatedLeadOfficer = data.escalatedLeadOfficer;
        this.feedbackGiven = data.feedbackGiven;
        this.isClosed = data.isClosed;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        // Populated sub-documents
        this.attachments = Array.isArray(data.attachments) ? data.attachments : [];
        this.activityLog = Array.isArray(data.activityLog) ? data.activityLog : [];
        // Tracks new log entries to be flushed on save()
        this._pendingLogs = [];
        // Allow activityLog.push to also queue into _pendingLogs
        this._wrapActivityLog();
    }

    /**
     * Wraps this.activityLog so that .push() also queues in _pendingLogs,
     * mirroring the Mongoose pattern of grievance.activityLog.push(entry).
     */
    _wrapActivityLog() {
        const self = this;
        const arr = this.activityLog;
        arr.push = function (...entries) {
            Array.prototype.push.apply(arr, entries);
            self._pendingLogs.push(...entries);
            return arr.length;
        };
    }

    // ─── normalizeRow ────────────────────────────────────────────────────────

    static normalizeRow(row) {
        if (!row) return null;
        return {
            _id: String(row.id),
            id: String(row.id),
            userId: row.user_id != null ? String(row.user_id) : null,
            status: row.status,
            uniqueID: row.unique_id,
            ministryName: row.ministry_name,
            departmentName: row.department_name,
            publicAuthority: row.public_authority,
            title: row.title,
            category: row.category,
            locationOfIssue: row.location_of_issue,
            dateOfIncident: row.date_of_incident,
            grievanceDescription: row.grievance_description,
            resolution: row.resolution,
            assignedTo: row.assigned_to != null ? String(row.assigned_to) : null,
            assignedBy: row.assigned_by != null ? String(row.assigned_by) : null,
            escalatedToLeadOfficer: Boolean(row.escalated_to_lead_officer),
            escalatedLeadOfficer: row.escalated_lead_officer != null ? String(row.escalated_lead_officer) : null,
            feedbackGiven: Boolean(row.feedback_given),
            isClosed: Boolean(row.is_closed),
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            attachments: [],
            activityLog: [],
        };
    }

    static fromRow(row, attachments = [], activityLog = []) {
        const normalized = Grievance.normalizeRow(row);
        if (!normalized) return null;
        normalized.attachments = attachments;
        normalized.activityLog = activityLog;
        return new Grievance(normalized);
    }

    // ─── buildWhere ──────────────────────────────────────────────────────────

    static buildWhere(filter = {}) {
        const clauses = [];
        const params = [];

        if (filter.user !== undefined) {
            clauses.push('g.user_id = ?');
            params.push(Number(filter.user));
        }

        if (filter.uniqueID !== undefined) {
            clauses.push('g.unique_id = ?');
            params.push(filter.uniqueID);
        }

        if (filter.status !== undefined) {
            clauses.push('g.status = ?');
            params.push(filter.status);
        }

        if (filter.assignedTo !== undefined) {
            clauses.push('g.assigned_to = ?');
            params.push(Number(filter.assignedTo));
        }

        if (filter._id !== undefined) {
            clauses.push('g.id = ?');
            params.push(Number(filter._id));
        }

        if (filter.id !== undefined) {
            clauses.push('g.id = ?');
            params.push(Number(filter.id));
        }

        const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
        return { whereSql, params };
    }

    // ─── Static helpers for sub-tables ───────────────────────────────────────

    static async getAttachments(grievanceId) {
        const pool = getPool();
        const [rows] = await pool.execute(
            'SELECT * FROM grievance_attachments WHERE grievance_id = ?',
            [Number(grievanceId)]
        );
        return rows.map((r) => ({
            _id: String(r.id),
            id: String(r.id),
            grievanceId: String(r.grievance_id),
            publicId: r.public_id,
            url: r.url,
        }));
    }

    static async getActivityLog(grievanceId) {
        const pool = getPool();
        const [rows] = await pool.execute(
            `SELECT al.*, u.id AS u_id, u.full_name AS u_name, u.role AS u_role
             FROM grievance_activity_log al
             LEFT JOIN users u ON u.id = al.updated_by
             WHERE al.grievance_id = ?
             ORDER BY al.timestamp ASC`,
            [Number(grievanceId)]
        );
        return rows.map((r) => ({
            _id: String(r.id),
            id: String(r.id),
            grievanceId: String(r.grievance_id),
            message: r.message,
            updatedBy: r.u_id != null
                ? { _id: String(r.u_id), id: String(r.u_id), name: r.u_name, role: r.u_role }
                : null,
            comment: r.comment,
            status: r.status,
            timestamp: r.timestamp,
        }));
    }

    /**
     * Returns a fully-populated grievance: user info, assignedTo info,
     * assignedBy info, escalatedLeadOfficer info, attachments, activityLog.
     */
    static async fullPopulate(grievanceId) {
        const pool = getPool();
        const [rows] = await pool.execute(
            `SELECT
                g.*,
                u.id AS owner_id, u.full_name AS owner_name, u.email AS owner_email,
                    u.phone_number AS owner_phone, u.role AS owner_role,
                ao.id AS ao_id, ao.full_name AS ao_name, ao.email AS ao_email,
                    ao.role AS ao_role, ao.department AS ao_department,
                ab.id AS ab_id, ab.full_name AS ab_name, ab.role AS ab_role,
                el.id AS el_id, el.full_name AS el_name, el.role AS el_role
             FROM grievances g
             LEFT JOIN users u  ON u.id  = g.user_id
             LEFT JOIN users ao ON ao.id = g.assigned_to
             LEFT JOIN users ab ON ab.id = g.assigned_by
             LEFT JOIN users el ON el.id = g.escalated_lead_officer
             WHERE g.id = ?
             LIMIT 1`,
            [Number(grievanceId)]
        );

        if (!rows[0]) return null;

        const r = rows[0];
        const [attachments, activityLog] = await Promise.all([
            Grievance.getAttachments(grievanceId),
            Grievance.getActivityLog(grievanceId),
        ]);

        const grievance = Grievance.fromRow(r, attachments, activityLog);

        // Populate user object
        grievance.user = r.owner_id != null ? {
            _id: String(r.owner_id),
            id: String(r.owner_id),
            fullName: r.owner_name,
            email: r.owner_email,
            phoneNumber: r.owner_phone,
            role: r.owner_role,
        } : null;

        // Populate assignedTo object
        grievance.assignedTo = r.ao_id != null ? {
            _id: String(r.ao_id),
            id: String(r.ao_id),
            fullName: r.ao_name,
            email: r.ao_email,
            role: r.ao_role,
            department: r.ao_department,
        } : null;

        // Populate assignedBy object
        grievance.assignedBy = r.ab_id != null ? {
            _id: String(r.ab_id),
            id: String(r.ab_id),
            fullName: r.ab_name,
            role: r.ab_role,
        } : null;

        // Populate escalatedLeadOfficer object
        grievance.escalatedLeadOfficer = r.el_id != null ? {
            _id: String(r.el_id),
            id: String(r.el_id),
            fullName: r.el_name,
            role: r.el_role,
        } : null;

        return grievance;
    }

    // ─── Static CRUD ─────────────────────────────────────────────────────────

    static async findOne(filter = {}) {
        const pool = getPool();
        const { whereSql, params } = Grievance.buildWhere(filter);
        const [rows] = await pool.execute(
            `SELECT * FROM grievances g ${whereSql} ORDER BY g.id DESC LIMIT 1`,
            params
        );
        if (!rows[0]) return null;
        const id = rows[0].id;
        const [attachments, activityLog] = await Promise.all([
            Grievance.getAttachments(id),
            Grievance.getActivityLog(id),
        ]);
        return Grievance.fromRow(rows[0], attachments, activityLog);
    }

    static async findById(id) {
        const pool = getPool();
        const [rows] = await pool.execute(
            'SELECT * FROM grievances g WHERE g.id = ? LIMIT 1',
            [Number(id)]
        );
        if (!rows[0]) return null;
        const [attachments, activityLog] = await Promise.all([
            Grievance.getAttachments(id),
            Grievance.getActivityLog(id),
        ]);
        return Grievance.fromRow(rows[0], attachments, activityLog);
    }

    static async find(filter = {}) {
        const pool = getPool();
        const { whereSql, params } = Grievance.buildWhere(filter);
        const [rows] = await pool.execute(
            `SELECT * FROM grievances g ${whereSql} ORDER BY g.id DESC`,
            params
        );
        return Promise.all(
            rows.map(async (row) => {
                const [attachments, activityLog] = await Promise.all([
                    Grievance.getAttachments(row.id),
                    Grievance.getActivityLog(row.id),
                ]);
                return Grievance.fromRow(row, attachments, activityLog);
            })
        );
    }

    static async create(data) {
        const pool = getPool();
        const [result] = await pool.execute(
            `INSERT INTO grievances (
                user_id, status, unique_id, ministry_name, department_name,
                public_authority, title, category, location_of_issue,
                date_of_incident, grievance_description, resolution,
                assigned_to, assigned_by, escalated_to_lead_officer,
                escalated_lead_officer, feedback_given, is_closed
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.userId != null ? Number(data.userId) : null,
                VALID_STATUSES.includes(data.status) ? data.status : 'Pending',
                data.uniqueID,
                data.ministryName,
                data.departmentName,
                data.publicAuthority || null,
                data.title,
                data.category || null,
                data.locationOfIssue || null,
                data.dateOfIncident || null,
                data.grievanceDescription,
                data.resolution || null,
                data.assignedTo != null ? Number(data.assignedTo) : null,
                data.assignedBy != null ? Number(data.assignedBy) : null,
                data.escalatedToLeadOfficer ? 1 : 0,
                data.escalatedLeadOfficer != null ? Number(data.escalatedLeadOfficer) : null,
                data.feedbackGiven ? 1 : 0,
                data.isClosed ? 1 : 0,
            ]
        );

        const grievance = await Grievance.findById(result.insertId);

        // Insert any initial attachments supplied at creation time
        if (Array.isArray(data.attachments) && data.attachments.length) {
            for (const att of data.attachments) {
                await pool.execute(
                    'INSERT INTO grievance_attachments (grievance_id, public_id, url) VALUES (?, ?, ?)',
                    [result.insertId, att.publicId || null, att.url || null]
                );
            }
            grievance.attachments = await Grievance.getAttachments(result.insertId);
        }

        return grievance;
    }

    /**
     * Mirrors Mongoose findByIdAndUpdate.
     * opts.new (default true) — return updated document.
     * opts.populate — ignored (always returns populated via fullPopulate).
     */
    static async findByIdAndUpdate(id, updateData = {}, opts = {}) {
        const pool = getPool();
        const setClauses = [];
        const params = [];

        if (updateData.assignedTo !== undefined) {
            setClauses.push('assigned_to = ?');
            params.push(updateData.assignedTo != null ? Number(updateData.assignedTo) : null);
        }
        if (updateData.assignedBy !== undefined) {
            setClauses.push('assigned_by = ?');
            params.push(updateData.assignedBy != null ? Number(updateData.assignedBy) : null);
        }
        if (updateData.status !== undefined) {
            setClauses.push('status = ?');
            params.push(VALID_STATUSES.includes(updateData.status) ? updateData.status : 'Pending');
        }
        if (updateData.escalatedToLeadOfficer !== undefined) {
            setClauses.push('escalated_to_lead_officer = ?');
            params.push(updateData.escalatedToLeadOfficer ? 1 : 0);
        }
        if (updateData.escalatedLeadOfficer !== undefined) {
            setClauses.push('escalated_lead_officer = ?');
            params.push(updateData.escalatedLeadOfficer != null ? Number(updateData.escalatedLeadOfficer) : null);
        }
        if (updateData.isClosed !== undefined) {
            setClauses.push('is_closed = ?');
            params.push(updateData.isClosed ? 1 : 0);
        }
        if (updateData.feedbackGiven !== undefined) {
            setClauses.push('feedback_given = ?');
            params.push(updateData.feedbackGiven ? 1 : 0);
        }
        if (updateData.resolution !== undefined) {
            setClauses.push('resolution = ?');
            params.push(updateData.resolution || null);
        }

        if (setClauses.length > 0) {
            params.push(Number(id));
            await pool.execute(
                `UPDATE grievances SET ${setClauses.join(', ')} WHERE id = ?`,
                params
            );
        }

        return Grievance.fullPopulate(id);
    }

    /**
     * Inserts a single activity log entry into the DB.
     * logEntry: { message, updatedBy (user id), comment, status }
     */
    static async pushActivityLog(grievanceId, logEntry) {
        const pool = getPool();
        await pool.execute(
            `INSERT INTO grievance_activity_log (grievance_id, message, updated_by, comment, status)
             VALUES (?, ?, ?, ?, ?)`,
            [
                Number(grievanceId),
                logEntry.message || null,
                logEntry.updatedBy != null ? Number(logEntry.updatedBy) : null,
                logEntry.comment || null,
                logEntry.status || null,
            ]
        );
    }

    // ─── Instance save() ─────────────────────────────────────────────────────

    async save() {
        const pool = getPool();

        await pool.execute(
            `UPDATE grievances
             SET user_id = ?, status = ?, unique_id = ?, ministry_name = ?,
                 department_name = ?, public_authority = ?, title = ?, category = ?,
                 location_of_issue = ?, date_of_incident = ?, grievance_description = ?,
                 resolution = ?, assigned_to = ?, assigned_by = ?,
                 escalated_to_lead_officer = ?, escalated_lead_officer = ?,
                 feedback_given = ?, is_closed = ?
             WHERE id = ?`,
            [
                this.userId != null ? Number(this.userId) : null,
                VALID_STATUSES.includes(this.status) ? this.status : 'Pending',
                this.uniqueID,
                this.ministryName,
                this.departmentName,
                this.publicAuthority || null,
                this.title,
                this.category || null,
                this.locationOfIssue || null,
                this.dateOfIncident || null,
                this.grievanceDescription,
                this.resolution || null,
                this.assignedTo != null
                    ? (typeof this.assignedTo === 'object' ? Number(this.assignedTo.id) : Number(this.assignedTo))
                    : null,
                this.assignedBy != null
                    ? (typeof this.assignedBy === 'object' ? Number(this.assignedBy.id) : Number(this.assignedBy))
                    : null,
                this.escalatedToLeadOfficer ? 1 : 0,
                this.escalatedLeadOfficer != null
                    ? (typeof this.escalatedLeadOfficer === 'object' ? Number(this.escalatedLeadOfficer.id) : Number(this.escalatedLeadOfficer))
                    : null,
                this.feedbackGiven ? 1 : 0,
                this.isClosed ? 1 : 0,
                Number(this._id),
            ]
        );

        // Flush any pending activity log entries queued via activityLog.push()
        for (const entry of this._pendingLogs) {
            await Grievance.pushActivityLog(this._id, entry);
        }
        this._pendingLogs = [];

        const latest = await Grievance.findById(this._id);
        Object.assign(this, latest);
        this._wrapActivityLog();
        return this;
    }
}

module.exports = Grievance;