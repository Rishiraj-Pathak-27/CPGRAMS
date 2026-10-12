-- ============================================================
-- CPGRAMS MySQL Database Schema
-- Run this file to create all required tables
-- ============================================================

CREATE DATABASE IF NOT EXISTS cpgrams CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cpgrams;

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    full_name        VARCHAR(255)  NOT NULL,
    gender           VARCHAR(20)   DEFAULT NULL,
    email            VARCHAR(255)  NOT NULL UNIQUE,
    phone_number     VARCHAR(20)   DEFAULT NULL,
    role             ENUM('user','officer','lead_officer','admin') NOT NULL DEFAULT 'user',
    department       VARCHAR(255)  DEFAULT NULL,
    address          TEXT          DEFAULT NULL,
    city             VARCHAR(100)  DEFAULT NULL,
    state            VARCHAR(100)  DEFAULT NULL,
    district         VARCHAR(100)  DEFAULT NULL,
    pincode          VARCHAR(10)   DEFAULT NULL,
    password         VARCHAR(255)  NOT NULL,
    reset_otp        VARCHAR(10)   DEFAULT NULL,
    reset_otp_expires DATETIME     DEFAULT NULL,
    created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email  (email),
    INDEX idx_users_role   (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 2. USER PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    user_id             INT          NOT NULL UNIQUE,
    alternate_phone     VARCHAR(20)  DEFAULT NULL,
    nationality         VARCHAR(100) DEFAULT NULL,
    dob                 DATE         DEFAULT NULL,
    aadhaar             VARCHAR(20)  DEFAULT NULL,
    voter_id            VARCHAR(30)  DEFAULT NULL,
    pan                 VARCHAR(15)  DEFAULT NULL,
    profile_image       TEXT         DEFAULT NULL,
    aadhaar_card_url    TEXT         DEFAULT NULL,
    voter_id_card_url   TEXT         DEFAULT NULL,
    pan_card_url        TEXT         DEFAULT NULL,
    utility_bill_url    TEXT         DEFAULT NULL,
    bank_statement_url  TEXT         DEFAULT NULL,
    account_status      VARCHAR(50)  NOT NULL DEFAULT 'Active',
    registration_date   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 3. GRIEVANCES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS grievances (
    id                          INT AUTO_INCREMENT PRIMARY KEY,
    user_id                     INT          NOT NULL,
    status                      ENUM('Pending','In Progress','Resolved','Closed') NOT NULL DEFAULT 'Pending',
    unique_id                   VARCHAR(50)  NOT NULL UNIQUE,
    ministry_name               VARCHAR(255) NOT NULL,
    department_name             VARCHAR(255) NOT NULL,
    public_authority            VARCHAR(255) DEFAULT NULL,
    title                       VARCHAR(255) NOT NULL,
    category                    VARCHAR(100) DEFAULT NULL,
    location_of_issue           VARCHAR(255) DEFAULT NULL,
    date_of_incident            DATE         DEFAULT NULL,
    grievance_description       TEXT         NOT NULL,
    resolution                  TEXT         DEFAULT NULL,
    assigned_to                 INT          DEFAULT NULL,
    assigned_by                 INT          DEFAULT NULL,
    escalated_to_lead_officer   TINYINT(1)   NOT NULL DEFAULT 0,
    escalated_lead_officer      INT          DEFAULT NULL,
    feedback_given              TINYINT(1)   NOT NULL DEFAULT 0,
    is_closed                   TINYINT(1)   NOT NULL DEFAULT 0,
    created_at                  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_grievance_user         FOREIGN KEY (user_id)                REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_grievance_assigned_to  FOREIGN KEY (assigned_to)            REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_grievance_assigned_by  FOREIGN KEY (assigned_by)            REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_grievance_escalated    FOREIGN KEY (escalated_lead_officer) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_grievances_user_id  (user_id),
    INDEX idx_grievances_status   (status),
    INDEX idx_grievances_unique_id (unique_id),
    INDEX idx_grievances_assigned  (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 4. GRIEVANCE ATTACHMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS grievance_attachments (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    grievance_id INT          NOT NULL,
    public_id    VARCHAR(255) NOT NULL,
    url          TEXT         NOT NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachment_grievance FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
    INDEX idx_attachments_grievance (grievance_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 5. GRIEVANCE ACTIVITY LOG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS grievance_activity_log (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    grievance_id INT          NOT NULL,
    message      TEXT         NOT NULL,
    updated_by   INT          DEFAULT NULL,
    comment      TEXT         DEFAULT NULL,
    status       VARCHAR(50)  DEFAULT NULL,
    timestamp    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_grievance  FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
    CONSTRAINT fk_log_updatedby  FOREIGN KEY (updated_by)   REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_activity_log_grievance (grievance_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 6. FEEDBACKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS feedbacks (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    grievance_id INT          NOT NULL,
    satisfied    TINYINT(1)   NOT NULL,
    comments     TEXT         DEFAULT NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_grievance FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
    INDEX idx_feedbacks_grievance (grievance_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 7. NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    recipient_id INT          NOT NULL,
    title        VARCHAR(255) NOT NULL,
    message      TEXT         NOT NULL,
    is_read      TINYINT(1)   NOT NULL DEFAULT 0,
    link         VARCHAR(500) DEFAULT NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_recipient (recipient_id),
    INDEX idx_notifications_is_read   (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
