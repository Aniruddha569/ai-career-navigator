-- ============================================================
-- AI Career Navigator — MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS ai_career_navigator;
USE ai_career_navigator;

-- ------------------------------------------------------------
-- 1. USERS
-- Stores registered users. Password is bcrypt-hashed, never plain text.
-- ------------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,        -- bcrypt hash
    college VARCHAR(150) DEFAULT NULL,
    branch VARCHAR(100) DEFAULT NULL,
    graduation_year INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 2. RESUMES
-- Each upload creates a row. A user can upload multiple resumes over time.
-- ------------------------------------------------------------
CREATE TABLE resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,        -- stored filename on disk
    original_name VARCHAR(255) NOT NULL,    -- original uploaded filename
    file_path VARCHAR(500) NOT NULL,
    extracted_text MEDIUMTEXT,              -- raw text from pdf-parse
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 3. RESUME_ANALYSIS
-- Stores the Gemini AI output for a given resume (1 resume -> many analyses
-- allowed, since a user might re-run analysis after editing their resume).
-- ------------------------------------------------------------
CREATE TABLE resume_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    user_id INT NOT NULL,
    resume_score INT NOT NULL,              -- out of 100
    ats_score INT NOT NULL,                 -- out of 100
    sap_readiness_score INT DEFAULT NULL,   -- out of 100
    strengths JSON,                         -- array of strings
    weaknesses JSON,                        -- array of strings
    missing_skills JSON,                    -- array of strings
    improvement_suggestions JSON,           -- array of strings
    raw_ai_response JSON,                   -- full Gemini response for audit/debug
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 4. SKILL_GAP_ANALYSIS
-- One row per (resume, target company) comparison.
-- ------------------------------------------------------------
CREATE TABLE skill_gap_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    user_id INT NOT NULL,
    target_company VARCHAR(100) NOT NULL,   -- e.g. 'SAP Labs', 'Amazon'
    matched_skills JSON,                    -- skills user already has
    missing_skills JSON,                    -- skills user lacks
    learning_roadmap JSON,                  -- ordered array of steps/resources
    match_percentage INT DEFAULT NULL,      -- overall fit %
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 5. INTERVIEW_QUESTIONS
-- Generated question sets, grouped by a generation "batch" so the
-- frontend can show them together under one company/date heading.
-- ------------------------------------------------------------
CREATE TABLE interview_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    resume_id INT DEFAULT NULL,             -- nullable: questions can be generic
    target_company VARCHAR(100) NOT NULL,
    technical_questions JSON,
    hr_questions JSON,
    dsa_questions JSON,
    project_questions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 6. ACTIVITY_LOG  (powers the Dashboard "recent activity" feed)
-- ------------------------------------------------------------
CREATE TABLE activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity_type VARCHAR(50) NOT NULL,     -- 'RESUME_UPLOAD' | 'ANALYSIS' | 'SKILL_GAP' | 'INTERVIEW_PREP'
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Helpful indexes for common lookups
-- ------------------------------------------------------------
CREATE INDEX idx_resumes_user ON resumes(user_id);
CREATE INDEX idx_analysis_user ON resume_analysis(user_id);
CREATE INDEX idx_skillgap_user_company ON skill_gap_analysis(user_id, target_company);
CREATE INDEX idx_interview_user_company ON interview_questions(user_id, target_company);
CREATE INDEX idx_activity_user ON activity_log(user_id);