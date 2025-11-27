// OJS Entity Types - Designed for both localStorage and future database migration

export type UserRole = 'admin' | 'editor' | 'reviewer' | 'author' | 'reader';

export type WorkflowStage = 'submission' | 'review' | 'copyediting' | 'production' | 'published';

export type SubmissionStatus = 'incomplete' | 'queued' | 'review' | 'editing' | 'published' | 'declined';

export type ReviewRecommendation = 'accept' | 'revisions' | 'resubmit' | 'decline';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  affiliation?: string;
  country?: string;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}

export interface Journal {
  id: string;
  name: string;
  initials: string;
  description: string;
  publisher: string;
  issn?: string;
  eissn?: string;
  onlineIssn?: string;
  path: string; // URL path
  enabled: boolean;
  primaryLocale: string;
  supportedLocales: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  journalId: string;
  authorId: string;
  title: string;
  abstract: string;
  prefix?: string; // e.g., "The"
  subtitle?: string;
  keywords: string[];
  language: string;
  stage: WorkflowStage;
  status: SubmissionStatus;
  submittedDate: string;
  lastModified: string;
  sectionId?: string;
  editorId?: string;
  reviewRound: number;
  files: SubmissionFile[];
  metadata: SubmissionMetadata;
}

export interface SubmissionFile {
  id: string;
  submissionId: string;
  fileStage: 'submission' | 'review' | 'copyedit' | 'proof' | 'production';
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedDate: string;
  label?: string;
  // For prototype: store as base64 or URL, for production: store file path/S3 key
  fileUrl?: string;
}

export interface SubmissionMetadata {
  contributors: Contributor[];
  citations?: string[];
  coverage?: string;
  rights?: string;
  source?: string;
  subjects?: string[];
  type?: string;
  discipline?: string;
  agencies?: string[];
}

export interface Contributor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  affiliation?: string;
  country?: string;
  orcid?: string;
  role: 'author' | 'translator' | 'editor';
  isPrimary: boolean;
  sequence: number;
}

export interface Review {
  id: string;
  submissionId: string;
  reviewerId: string;
  reviewRound: number;
  assignedDate: string;
  dueDate: string;
  completedDate?: string;
  declined: boolean;
  recommendation?: ReviewRecommendation;
  comments: string;
  commentsForAuthor?: string;
  commentsForEditor?: string;
  rating?: number; // 1-5
  reviewMethod: 'doubleBlind' | 'singleBlind' | 'open';
  files: ReviewFile[];
}

export interface ReviewFile {
  id: string;
  reviewId: string;
  fileName: string;
  fileType: string;
  uploadedDate: string;
  fileUrl?: string;
}

export interface Issue {
  id: string;
  journalId: string;
  volume?: number;
  number?: string;
  year: number;
  title?: string;
  description?: string;
  published: boolean;
  datePublished?: string;
  dateNotified?: string;
  lastModified: string;
  accessStatus: 'open' | 'subscription';
  coverImageUrl?: string;
  submissions: string[]; // submission IDs
}

export interface Section {
  id: string;
  journalId: string;
  title: string;
  abbrev: string;
  policy?: string;
  isInactive: boolean;
  abstractWordCount?: number;
  reviewFormId?: string;
  sequence: number;
}

export interface Decision {
  id: string;
  submissionId: string;
  editorId: string;
  stage: WorkflowStage;
  decision: 'accept' | 'decline' | 'requestRevisions' | 'resubmit' | 'sendToProduction';
  dateDecided: string;
  comments: string;
  reviewRound: number;
}

// Database Schema Design (for future migration)
export const DATABASE_SCHEMA = `
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  affiliation VARCHAR(255),
  country VARCHAR(2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Roles Table (Many-to-Many)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  journal_id UUID REFERENCES journals(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Journals Table
CREATE TABLE journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  initials VARCHAR(10) NOT NULL,
  description TEXT,
  publisher VARCHAR(255),
  issn VARCHAR(20),
  eissn VARCHAR(20),
  online_issn VARCHAR(20),
  path VARCHAR(100) UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT true,
  primary_locale VARCHAR(10) DEFAULT 'en_US',
  supported_locales TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Submissions Table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_id UUID REFERENCES journals(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  prefix VARCHAR(50),
  subtitle TEXT,
  keywords TEXT[],
  language VARCHAR(10) DEFAULT 'en',
  stage VARCHAR(20) DEFAULT 'submission',
  status VARCHAR(20) DEFAULT 'queued',
  submitted_date TIMESTAMP DEFAULT NOW(),
  last_modified TIMESTAMP DEFAULT NOW(),
  section_id UUID REFERENCES sections(id),
  editor_id UUID REFERENCES users(id),
  review_round INTEGER DEFAULT 0
);

-- Submission Files Table
CREATE TABLE submission_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  file_stage VARCHAR(20) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  file_path VARCHAR(500) NOT NULL,
  uploaded_by UUID REFERENCES users(id),
  uploaded_date TIMESTAMP DEFAULT NOW(),
  label VARCHAR(255)
);

-- Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  review_round INTEGER DEFAULT 1,
  assigned_date TIMESTAMP DEFAULT NOW(),
  due_date TIMESTAMP NOT NULL,
  completed_date TIMESTAMP,
  declined BOOLEAN DEFAULT false,
  recommendation VARCHAR(20),
  comments TEXT,
  comments_for_author TEXT,
  comments_for_editor TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_method VARCHAR(20) DEFAULT 'doubleBlind'
);

-- Issues Table
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_id UUID REFERENCES journals(id) ON DELETE CASCADE,
  volume INTEGER,
  number VARCHAR(20),
  year INTEGER NOT NULL,
  title VARCHAR(255),
  description TEXT,
  published BOOLEAN DEFAULT false,
  date_published TIMESTAMP,
  date_notified TIMESTAMP,
  last_modified TIMESTAMP DEFAULT NOW(),
  access_status VARCHAR(20) DEFAULT 'open',
  cover_image_url VARCHAR(500)
);

-- Sections Table
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_id UUID REFERENCES journals(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  abbrev VARCHAR(50),
  policy TEXT,
  is_inactive BOOLEAN DEFAULT false,
  abstract_word_count INTEGER,
  sequence INTEGER DEFAULT 0
);

-- Decisions Table
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  editor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  stage VARCHAR(20) NOT NULL,
  decision VARCHAR(50) NOT NULL,
  date_decided TIMESTAMP DEFAULT NOW(),
  comments TEXT,
  review_round INTEGER
);

-- Contributors Table
CREATE TABLE contributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  affiliation VARCHAR(255),
  country VARCHAR(2),
  orcid VARCHAR(50),
  role VARCHAR(20) DEFAULT 'author',
  is_primary BOOLEAN DEFAULT false,
  sequence INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX idx_submissions_journal ON submissions(journal_id);
CREATE INDEX idx_submissions_author ON submissions(author_id);
CREATE INDEX idx_submissions_stage ON submissions(stage);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_reviews_submission ON reviews(submission_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_journal ON user_roles(journal_id);
`;
