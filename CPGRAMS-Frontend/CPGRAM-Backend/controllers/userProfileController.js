const User = require('../models/userModel');
const UserProfile = require('../models/UserProfile');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

// ─── Create User Profile ─────────────────────────────────────────────────────
const createUserProfile = async (req, res) => {
    try {
        const { userId, ...profileData } = req.body;
        console.log('FILES RECEIVED:', req.files);

        const userExists = await User.findById(userId);
        if (!userExists) return res.status(404).json({ message: 'User not found' });

        const existingProfile = await UserProfile.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({ message: 'Profile already exists for this user' });
        }

        const files = req.files || {};
        const uploads = {};

        for (const key in files) {
            const file = files[key][0];
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'user-profiles',
            });
            fs.unlinkSync(file.path);
            uploads[key] = result.secure_url;
        }

        const fullProfileData = {
            ...profileData,
            profileImage:      uploads.profileImage      || null,
            aadhaarCardUrl:    uploads.aadhaarCardUrl    || null,
            voterIdCardUrl:    uploads.voterIdCardUrl    || null,
            panCardUrl:        uploads.panCardUrl        || null,
            utilityBillUrl:    uploads.utilityBillUrl    || null,
            bankStatementUrl:  uploads.bankStatementUrl  || null,
        };

        const profile = new UserProfile({ userId, ...fullProfileData });
        await profile.save();

        res.status(201).json({ message: 'User profile created', profile });
    } catch (err) {
        console.error('Create profile error:', err);
        res.status(400).json({ error: err.message });
    }
};

// ─── Get All Profiles ─────────────────────────────────────────────────────────
const getAllProfiles = async (req, res) => {
    try {
        const profiles = await UserProfile.findWithUser();

        if (!profiles || profiles.length === 0) {
            return res.status(404).json({ message: 'No user profiles found' });
        }

        res.status(200).json({ total: profiles.length, profiles });
    } catch (err) {
        console.error('Error fetching user profiles:', err);
        res.status(500).json({ error: 'Server error while fetching user profiles' });
    }
};

// ─── Get Profile by ID ────────────────────────────────────────────────────────
const getProfileById = async (req, res) => {
    try {
        const profile = await UserProfile.findByIdWithUser(req.params.id);

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json(profile);
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: 'Server error while fetching profile' });
    }
};

// ─── Update Profile ───────────────────────────────────────────────────────────
const updateUserProfile = async (req, res) => {
    try {
        const profileId = req.params.id;

        // Handle profile image upload
        if (req.files?.profileImage?.[0]) {
            const localImagePath = req.files.profileImage[0].path;

            const resultCloud = await cloudinary.uploader.upload(localImagePath, {
                folder: 'user-profiles',
            });

            fs.unlinkSync(localImagePath);
            req.body.profileImage = resultCloud.secure_url;
        }

        const updatedProfile = await UserProfile.findByIdAndUpdate(
            profileId,
            req.body,
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({ message: 'Profile updated', profile: updatedProfile });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(400).json({ error: err.message });
    }
};

// ─── Delete Profile ───────────────────────────────────────────────────────────
const deleteUserProfile = async (req, res) => {
    try {
        const deleted = await UserProfile.deleteById(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (err) {
        console.error('Error deleting profile:', err);
        res.status(500).json({ error: 'Server error while deleting profile' });
    }
};

module.exports = {
    createUserProfile,
    getAllProfiles,
    getProfileById,
    updateUserProfile,
    deleteUserProfile,
};
