const Grievance = require('../models/grievanceModel');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');
const generateUniqueID = require('../utils/generateUniqueID');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// ─── Create Grievance ─────────────────────────────────────────────────────────
exports.createGrievance = async (req, res, next) => {
    try {
        const {
            ministryName,
            grievanceDescription,
            departmentName,
            publicAuthority,
            title,
            locationOfIssue,
            dateOfIncident,
            category,
        } = req.body;

        const files = req.files || [];
        const attachments = [];

        for (const file of files) {
            const localFilePath = file.path;
            try {
                const result = await cloudinary.uploader.upload(localFilePath, {
                    folder: 'grievances_attachments',
                    resource_type: 'auto',
                });
                attachments.push({ public_id: result.public_id, url: result.secure_url });
                fs.unlinkSync(localFilePath);
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                fs.unlinkSync(localFilePath);
                return res.status(500).json({ success: false, message: 'Failed to upload attachment' });
            }
        }

        const grievance = await Grievance.create({
            user: req.user._id,
            ministryName,
            grievanceDescription,
            departmentName,
            publicAuthority,
            title,
            locationOfIssue,
            dateOfIncident,
            category,
            attachments,
            uniqueID: generateUniqueID(),
        });

        res.status(201).json({ message: 'Grievance created successfully', grievance });
    } catch (error) {
        console.error('Error creating grievance:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Grievance with this unique ID already exists' });
        }
        next(error);
    }
};

// ─── Get Grievance by UniqueID ────────────────────────────────────────────────
exports.getGrievancesByUniqueId = async (req, res, next) => {
    try {
        const grievance = await Grievance.findOne({ uniqueID: req.params.id, user: req.user._id });
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }
        res.status(200).json(grievance);
    } catch (error) {
        next(error);
    }
};

// ─── Get User Grievances ──────────────────────────────────────────────────────
exports.getUserGrievances = async (req, res, next) => {
    try {
        const grievances = await Grievance.find({ user: req.user._id });
        res.status(200).json(grievances);
    } catch (error) {
        next(error);
    }
};

// ─── Update Grievance Status ──────────────────────────────────────────────────
exports.updateGrievanceStatus = async (req, res, next) => {
    try {
        const { id: grievanceId } = req.params;
        const { status } = req.body;

        const grievance = await Grievance.findById(grievanceId);
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        grievance.status = status;
        grievance.activityLog.push({
            message: `Status updated to ${status}`,
            updatedBy: req.user._id,
            status,
        });

        await grievance.save();
        res.status(200).json({ message: 'Status updated', grievance });
    } catch (error) {
        next(error);
    }
};

// ─── Update Grievance (edit fields + re-upload attachments) ───────────────────
exports.updateGrievance = async (req, res, next) => {
    try {
        const { id: grievanceId } = req.params;
        const grievance = await Grievance.findById(grievanceId);
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        // Upload any new attachments
        const files = req.files || [];
        const newAttachments = [];
        for (const file of files) {
            try {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'grievances_attachments',
                    resource_type: 'auto',
                });
                newAttachments.push({ public_id: result.public_id, url: result.secure_url });
                fs.unlinkSync(file.path);
            } catch (err) {
                fs.unlinkSync(file.path);
                return res.status(500).json({ message: 'Failed to upload attachment' });
            }
        }

        // Merge fields
        const allowedFields = [
            'ministryName', 'grievanceDescription', 'departmentName',
            'publicAuthority', 'title', 'locationOfIssue', 'dateOfIncident', 'category',
        ];
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                grievance[field] = req.body[field];
            }
        }

        if (newAttachments.length) {
            grievance.attachments = [...(grievance.attachments || []), ...newAttachments];
        }

        await grievance.save();
        res.status(200).json({ message: 'Grievance updated successfully', grievance });
    } catch (error) {
        next(error);
    }
};

// ─── Add Progress Update ──────────────────────────────────────────────────────
exports.addProgressUpdate = async (req, res, next) => {
    try {
        const { id: grievanceId } = req.params;
        const { message } = req.body;

        const grievance = await Grievance.findById(grievanceId);
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }
        if (grievance.status !== 'In Progress') {
            return res.status(400).json({ message: 'Can only add progress updates when status is In Progress' });
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
