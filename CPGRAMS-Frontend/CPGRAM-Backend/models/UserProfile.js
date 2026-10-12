const { getPool } = require('../config/db');

class UserProfile {
    constructor(data) {
        this._id = data._id;
        this.id = data.id;
        this.userId = data.userId;
        this.alternatePhone = data.alternatePhone;
        this.nationality = data.nationality;
        this.dob = data.dob;
        this.aadhaar = data.aadhaar;
        this.voterId = data.voterId;
        this.pan = data.pan;
        this.profileImage = data.profileImage;
        this.aadhaarCardUrl = data.aadhaarCardUrl;
        this.voterIdCardUrl = data.voterIdCardUrl;
        this.panCardUrl = data.panCardUrl;
        this.utilityBillUrl = data.utilityBillUrl;
        this.bankStatementUrl = data.bankStatementUrl;
        this.accountStatus = data.accountStatus;
        this.registrationDate = data.registrationDate;
        this.lastLogin = data.lastLogin;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    // ─── normalizeRow ────────────────────────────────────────────────────────

    static normalizeRow(row) {
        if (!row) return null;
        return {
            _id: String(row.id),
            id: String(row.id),
            userId: row.user_id != null ? String(row.user_id) : null,
            alternatePhone: row.alternate_phone,
            nationality: row.nationality,
            dob: row.dob,
            aadhaar: row.aadhaar,
            voterId: row.voter_id,
            pan: row.pan,
            profileImage: row.profile_image,
            aadhaarCardUrl: row.aadhaar_card_url,
            voterIdCardUrl: row.voter_id_card_url,
            panCardUrl: row.pan_card_url,
            utilityBillUrl: row.utility_bill_url,
            bankStatementUrl: row.bank_statement_url,
            accountStatus: row.account_status,
            registrationDate: row.registration_date,
            lastLogin: row.last_login,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }

    static fromRow(row) {
        const normalized = UserProfile.normalizeRow(row);
        return normalized ? new UserProfile(normalized) : null;
    }

    // ─── buildWhere ──────────────────────────────────────────────────────────

    static buildWhere(filter = {}) {
        const clauses = [];
        const params = [];

        if (filter.userId !== undefined) {
            clauses.push('user_id = ?');
            params.push(Number(filter.userId));
        }

        if (filter._id !== undefined) {
            clauses.push('id = ?');
            params.push(Number(filter._id));
        }

        if (filter.id !== undefined) {
            clauses.push('id = ?');
            params.push(Number(filter.id));
        }

        if (filter.accountStatus !== undefined) {
            clauses.push('account_status = ?');
            params.push(filter.accountStatus);
        }

        const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
        return { whereSql, params };
    }

    // ─── Static CRUD ─────────────────────────────────────────────────────────

    static async findOne(filter = {}) {
        const pool = getPool();
        const { whereSql, params } = UserProfile.buildWhere(filter);
        const [rows] = await pool.execute(
            `SELECT * FROM user_profiles ${whereSql} ORDER BY id DESC LIMIT 1`,
            params
        );
        return UserProfile.fromRow(rows[0]);
    }

    static async findById(id) {
        const pool = getPool();
        const [rows] = await pool.execute(
            'SELECT * FROM user_profiles WHERE id = ? LIMIT 1',
            [Number(id)]
        );
        return UserProfile.fromRow(rows[0]);
    }

    static async find(filter = {}) {
        const pool = getPool();
        const { whereSql, params } = UserProfile.buildWhere(filter);
        const [rows] = await pool.execute(
            `SELECT * FROM user_profiles ${whereSql} ORDER BY id DESC`,
            params
        );
        return rows.map((row) => UserProfile.fromRow(row));
    }

    static async create(data) {
        const pool = getPool();
        const [result] = await pool.execute(
            `INSERT INTO user_profiles (
                user_id, alternate_phone, nationality, dob, aadhaar, voter_id, pan,
                profile_image, aadhaar_card_url, voter_id_card_url, pan_card_url,
                utility_bill_url, bank_statement_url, account_status,
                registration_date, last_login
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.userId != null ? Number(data.userId) : null,
                data.alternatePhone || null,
                data.nationality || null,
                data.dob || null,
                data.aadhaar || null,
                data.voterId || null,
                data.pan || null,
                data.profileImage || null,
                data.aadhaarCardUrl || null,
                data.voterIdCardUrl || null,
                data.panCardUrl || null,
                data.utilityBillUrl || null,
                data.bankStatementUrl || null,
                data.accountStatus || 'Active',
                data.registrationDate || null,
                data.lastLogin || null,
            ]
        );
        return UserProfile.findById(result.insertId);
    }

    static async findByIdAndUpdate(id, updateData = {}, opts = {}) {
        const pool = getPool();
        const setClauses = [];
        const params = [];

        const fieldMap = {
            alternatePhone: 'alternate_phone',
            nationality: 'nationality',
            dob: 'dob',
            aadhaar: 'aadhaar',
            voterId: 'voter_id',
            pan: 'pan',
            profileImage: 'profile_image',
            aadhaarCardUrl: 'aadhaar_card_url',
            voterIdCardUrl: 'voter_id_card_url',
            panCardUrl: 'pan_card_url',
            utilityBillUrl: 'utility_bill_url',
            bankStatementUrl: 'bank_statement_url',
            accountStatus: 'account_status',
            lastLogin: 'last_login',
        };

        for (const [jsKey, dbCol] of Object.entries(fieldMap)) {
            if (updateData[jsKey] !== undefined) {
                setClauses.push(`${dbCol} = ?`);
                params.push(updateData[jsKey] != null ? updateData[jsKey] : null);
            }
        }

        if (setClauses.length > 0) {
            params.push(Number(id));
            await pool.execute(
                `UPDATE user_profiles SET ${setClauses.join(', ')} WHERE id = ?`,
                params
            );
        }

        return UserProfile.findById(id);
    }

    // ─── Instance save() ─────────────────────────────────────────────────────

    async save() {
        const pool = getPool();
        await pool.execute(
            `UPDATE user_profiles
             SET user_id = ?, alternate_phone = ?, nationality = ?, dob = ?,
                 aadhaar = ?, voter_id = ?, pan = ?, profile_image = ?,
                 aadhaar_card_url = ?, voter_id_card_url = ?, pan_card_url = ?,
                 utility_bill_url = ?, bank_statement_url = ?, account_status = ?,
                 registration_date = ?, last_login = ?
             WHERE id = ?`,
            [
                this.userId != null ? Number(this.userId) : null,
                this.alternatePhone || null,
                this.nationality || null,
                this.dob || null,
                this.aadhaar || null,
                this.voterId || null,
                this.pan || null,
                this.profileImage || null,
                this.aadhaarCardUrl || null,
                this.voterIdCardUrl || null,
                this.panCardUrl || null,
                this.utilityBillUrl || null,
                this.bankStatementUrl || null,
                this.accountStatus || 'Active',
                this.registrationDate || null,
                this.lastLogin || null,
                Number(this._id),
            ]
        );

        const latest = await UserProfile.findById(this._id);
        Object.assign(this, latest);
        return this;
    }
}

module.exports = UserProfile;
