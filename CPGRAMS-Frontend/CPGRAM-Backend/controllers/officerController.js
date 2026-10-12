const Grievance = require('../models/grievanceModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) =>
    jwt.sign({ id: String(id) }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─── Get Grievance by Token (public) ─────────────────────────────────────────
exports.getGrievanceByToken = async (req, res, next) => {
    try {
        const { uniqueId } = req.params;
        const grievance = await Grievance.findOne({ uniqueID: uniqueId });
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }
        res.status(200).json(grievance);
    } catch (error) {
        next(error);
    }
};

// ─── Assign Grievance ─────────────────────────────────────────────────────────
exports.assignGrievance = async (req, res, next) => {
    try {
        const { grievanceId, officerId } = req.body;

        const grievance = await Grievance.findById(grievanceId);
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        grievance.assignedTo = officerId;
        grievance.assignedBy = req.user._id;
        grievance.activityLog.push({
            message: `Grievance assigned to officer ${officerId}`,
            updatedBy: req.user._id,
            status: 'Assigned',
        });

        await grievance.save();

        // Return full populated result
        const populated = await Grievance.fullPopulate(grievance._id);
        res.status(200).json(populated || grievance);
    } catch (error) {
        next(error);
    }
};

// ─── Update Status ────────────────────────────────────────────────────────────
exports.updateStatus = async (req, res, next) => {
    try {
        const { grievanceId } = req.params;
        const { status, comment } = req.body;

        const grievance = await Grievance.findById(grievanceId);
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        grievance.status = status;

        if (status === 'Resolved') {
            grievance.feedbackGiven = true;
        }

        grievance.activityLog.push({
            message: `Status updated to ${status}`,
            updatedBy: req.user._id,
            comment: comment || '',
            status,
        });

        await grievance.save();

        res.json({ message: `Grievance status marked as ${status}`, grievance });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// ─── Escalate Grievance ───────────────────────────────────────────────────────
exports.escalateGrievance = async (req, res, next) => {
    try {
        const { grievanceId } = req.params;
        const { officerId } = req.body;

        const leadOfficer = await User.findById(officerId);
        if (!leadOfficer || leadOfficer.role !== 'lead_officer') {
            return res.status(404).json({ message: 'Lead Officer not found or invalid role' });
        }

        const grievance = await Grievance.findById(grievanceId);
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        grievance.escalatedToLeadOfficer = true;
        grievance.escalatedLeadOfficer = officerId;
        grievance.assignedTo = null;
        grievance.activityLog.push({
            message: `Grievance escalated to Lead Officer ${leadOfficer.fullName}`,
            updatedBy: req.user._id,
            status: 'Escalated',
        });

        await grievance.save();
        res.status(200).json({ message: 'Grievance escalated to Lead Officer successfully', grievance });
    } catch (error) {
        next(error);
    }
};

// ─── Close Grievance ──────────────────────────────────────────────────────────
exports.closeGrievance = async (req, res, next) => {
    try {
        const { grievanceId } = req.params;
        const { finalComment } = req.body;

        const grievance = await Grievance.findById(grievanceId);
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        grievance.status = 'Closed';
        grievance.isClosed = true;
        grievance.activityLog.push({
            message: `Grievance closed with comment: ${finalComment}`,
            updatedBy: req.user._id,
            status: 'Closed',
        });

        await grievance.save();
        res.status(200).json({ message: 'Grievance closed successfully', grievance });
    } catch (error) {
        next(error);
    }
};

// ─── Add Progress Message ─────────────────────────────────────────────────────
exports.addProgressMessage = async (req, res, next) => {
    try {
        const { grievanceId } = req.params;
        const { message } = req.body;

        const grievance = await Grievance.findById(grievanceId);
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }
        if (grievance.status !== 'In Progress') {
            return res.status(400).json({ message: 'Can only send progress messages when status is In Progress' });
        }

        grievance.activityLog.push({
            message,
            updatedBy: req.user._id,
            status: 'In Progress',
        });

        await grievance.save();
        res.status(200).json({ message: 'Progress update added', grievance });
    } catch (error) {
        next(error);
    }
};