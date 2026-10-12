const { getPool } = require('../config/db');

const ALLOWED_ROLES = ['user', 'officer', 'lead_officer', 'admin'];

class User {
    constructor(data) {
        this._id = data._id;
        this.id = data.id;
        this.fullName = data.fullName;
        this.gender = data.gender;
        this.email = data.email;
        this.phoneNumber = data.phoneNumber;
        this.role = data.role;
        this.department = data.department;
        this.address = data.address;
        this.city = data.city;
        this.state = data.state;
        this.district = data.district;
        this.pincode = data.pincode;
        this.password = data.password;
        this.resetOtp = data.resetOtp;
        this.resetOtpExpires = data.resetOtpExpires;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    static normalizeRow(row) {
        if (!row) {
            return null;
        }

        return {
            _id: String(row.id),
            id: String(row.id),
            fullName: row.full_name,
            gender: row.gender,
            email: row.email,
            phoneNumber: row.phone_number,
            role: row.role,
            department: row.department,
            address: row.address,
            city: row.city,
            state: row.state,
            district: row.district,
            pincode: row.pincode,
            password: row.password,
            resetOtp: row.reset_otp,
            resetOtpExpires: row.reset_otp_expires,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }

    static fromRow(row) {
        const normalized = User.normalizeRow(row);
        return normalized ? new User(normalized) : null;
    }

    static buildWhere(filter = {}) {
        const clauses = [];
        const params = [];

        if (filter.email !== undefined) {
            clauses.push('email = ?');
            params.push(filter.email);
        }

        if (filter.role !== undefined) {
            if (typeof filter.role === 'object' && Array.isArray(filter.role.$in)) {
                const roles = filter.role.$in.filter((role) => ALLOWED_ROLES.includes(role));
                if (roles.length === 0) {
                    clauses.push('1 = 0');
                } else {
                    clauses.push(`role IN (${roles.map(() => '?').join(',')})`);
                    params.push(...roles);
                }
            } else {
                clauses.push('role = ?');
                params.push(filter.role);
            }
        }

        if (filter.resetOtp !== undefined) {
            clauses.push('reset_otp = ?');
            params.push(filter.resetOtp);
        }

        if (filter.resetOtpExpires !== undefined) {
            if (filter.resetOtpExpires.$gt) {
                clauses.push('reset_otp_expires > ?');
                params.push(filter.resetOtpExpires.$gt);
            }
        }

        if (filter.id !== undefined) {
            clauses.push('id = ?');
            params.push(Number(filter.id));
        }

        if (filter._id !== undefined) {
            clauses.push('id = ?');
            params.push(Number(filter._id));
        }

        const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
        return { whereSql, params };
    }

    static async findOne(filter = {}) {
        const pool = getPool();
        const { whereSql, params } = User.buildWhere(filter);
        const [rows] = await pool.execute(
            `SELECT * FROM users ${whereSql} ORDER BY id DESC LIMIT 1`,
            params
        );
        return User.fromRow(rows[0]);
    }

    static async findById(id) {
        const pool = getPool();
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [Number(id)]);
        return User.fromRow(rows[0]);
    }

    static async find(filter = {}) {
        const pool = getPool();
        const { whereSql, params } = User.buildWhere(filter);
        const [rows] = await pool.execute(`SELECT * FROM users ${whereSql} ORDER BY id DESC`, params);
        return rows.map((row) => User.fromRow(row));
    }

    static async create(data) {
        const pool = getPool();
        const [result] = await pool.execute(
            `INSERT INTO users (
                full_name, gender, email, phone_number, role, department,
                address, city, state, district, pincode, password, reset_otp, reset_otp_expires
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.fullName,
                data.gender || null,
                data.email,
                data.phoneNumber || null,
                ALLOWED_ROLES.includes(data.role) ? data.role : 'user',
                data.department || null,
                data.address || null,
                data.city || null,
                data.state || null,
                data.district || null,
                data.pincode || null,
                data.password,
                data.resetOtp || null,
                data.resetOtpExpires || null,
            ]
        );

        return User.findById(result.insertId);
    }

    async save() {
        const pool = getPool();
        await pool.execute(
            `UPDATE users
             SET full_name = ?, gender = ?, email = ?, phone_number = ?, role = ?, department = ?,
                     address = ?, city = ?, state = ?, district = ?, pincode = ?, password = ?,
                     reset_otp = ?, reset_otp_expires = ?
             WHERE id = ?`,
            [
                this.fullName,
                this.gender || null,
                this.email,
                this.phoneNumber || null,
                ALLOWED_ROLES.includes(this.role) ? this.role : 'user',
                this.department || null,
                this.address || null,
                this.city || null,
                this.state || null,
                this.district || null,
                this.pincode || null,
                this.password,
                this.resetOtp || null,
                this.resetOtpExpires || null,
                Number(this._id),
            ]
        );

        const latest = await User.findById(this._id);
        Object.assign(this, latest);
        return this;
    }

    select(selection) {
        if (selection === '-password') {
            const plain = { ...this };
            delete plain.password;
            return plain;
        }
        return this;
    }
}

module.exports = User;