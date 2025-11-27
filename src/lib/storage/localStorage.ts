// localStorage utilities for OJS prototype
// Designed to mirror database operations for easy migration

import {
  User,
  Journal,
  Submission,
  Review,
  Issue,
  Section,
  Decision,
} from '@/lib/types/ojs';

const STORAGE_KEYS = {
  USERS: 'ojs_users',
  JOURNALS: 'ojs_journals',
  SUBMISSIONS: 'ojs_submissions',
  REVIEWS: 'ojs_reviews',
  ISSUES: 'ojs_issues',
  SECTIONS: 'ojs_sections',
  DECISIONS: 'ojs_decisions',
  CURRENT_USER: 'ojs_current_user',
} as const;

// Generic localStorage operations
class LocalStorage<T extends { id: string }> {
  constructor(private key: string) {}

  getAll(): T[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  getById(id: string): T | null {
    const items = this.getAll();
    return items.find((item) => item.id === id) || null;
  }

  getByField<K extends keyof T>(field: K, value: T[K]): T[] {
    const items = this.getAll();
    return items.filter((item) => item[field] === value);
  }

  create(item: T): T {
    const items = this.getAll();
    items.push(item);
    this.saveAll(items);
    return item;
  }

  update(id: string, updates: Partial<T>): T | null {
    const items = this.getAll();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    this.saveAll(items);
    return items[index];
  }

  delete(id: string): boolean {
    const items = this.getAll();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;
    this.saveAll(filtered);
    return true;
  }

  private saveAll(items: T[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.key);
  }
}

// Entity-specific storage instances
export const usersStorage = new LocalStorage<User>(STORAGE_KEYS.USERS);
export const journalsStorage = new LocalStorage<Journal>(STORAGE_KEYS.JOURNALS);
export const submissionsStorage = new LocalStorage<Submission>(STORAGE_KEYS.SUBMISSIONS);
export const reviewsStorage = new LocalStorage<Review>(STORAGE_KEYS.REVIEWS);
export const issuesStorage = new LocalStorage<Issue>(STORAGE_KEYS.ISSUES);
export const sectionsStorage = new LocalStorage<Section>(STORAGE_KEYS.SECTIONS);
export const decisionsStorage = new LocalStorage<Decision>(STORAGE_KEYS.DECISIONS);

// Auth utilities
export const authStorage = {
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },
};

// Complex queries (similar to database joins/filters)
export const queries = {
  // Get submissions by journal
  getSubmissionsByJournal(journalId: string): Submission[] {
    return submissionsStorage.getByField('journalId', journalId);
  },

  // Get submissions by author
  getSubmissionsByAuthor(authorId: string): Submission[] {
    return submissionsStorage.getByField('authorId', authorId);
  },

  // Get submissions by stage
  getSubmissionsByStage(journalId: string, stage: string): Submission[] {
    return submissionsStorage
      .getAll()
      .filter((s) => s.journalId === journalId && s.stage === stage);
  },

  // Get reviews for submission
  getReviewsForSubmission(submissionId: string): Review[] {
    return reviewsStorage.getByField('submissionId', submissionId);
  },

  // Get reviews by reviewer
  getReviewsByReviewer(reviewerId: string): Review[] {
    return reviewsStorage.getByField('reviewerId', reviewerId);
  },

  // Get active reviews for reviewer
  getActiveReviewsForReviewer(reviewerId: string): Review[] {
    return reviewsStorage
      .getAll()
      .filter(
        (r) =>
          r.reviewerId === reviewerId &&
          !r.completedDate &&
          !r.declined
      );
  },

  // Get issues by journal
  getIssuesByJournal(journalId: string): Issue[] {
    return issuesStorage.getByField('journalId', journalId);
  },

  // Get published issues
  getPublishedIssues(journalId: string): Issue[] {
    return issuesStorage
      .getAll()
      .filter((i) => i.journalId === journalId && i.published);
  },

  // Get sections by journal
  getSectionsByJournal(journalId: string): Section[] {
    return sectionsStorage.getByField('journalId', journalId);
  },

  // Get decisions for submission
  getDecisionsForSubmission(submissionId: string): Decision[] {
    return decisionsStorage.getByField('submissionId', submissionId);
  },

  // Dashboard statistics
  getDashboardStats(journalId: string) {
    const submissions = this.getSubmissionsByJournal(journalId);
    return {
      totalSubmissions: submissions.length,
      inReview: submissions.filter((s) => s.stage === 'review').length,
      inEditing: submissions.filter((s) => s.stage === 'copyediting' || s.stage === 'production').length,
      published: submissions.filter((s) => s.status === 'published').length,
    };
  },
};

// Initialize with seed data
export const initializeSeedData = () => {
  if (typeof window === 'undefined') return;

  // Check if already initialized
  if (journalsStorage.getAll().length > 0) return;

  // Seed users
  const adminUser: User = {
    id: 'user-1',
    email: 'admin@journal.com',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    affiliation: 'Journal Editorial Office',
    country: 'US',
    roles: ['admin', 'editor'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const authorUser: User = {
    id: 'user-2',
    email: 'author@university.edu',
    username: 'jsmith',
    firstName: 'John',
    lastName: 'Smith',
    affiliation: 'University of Science',
    country: 'US',
    roles: ['author'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const reviewerUser: User = {
    id: 'user-3',
    email: 'reviewer@university.edu',
    username: 'mjones',
    firstName: 'Mary',
    lastName: 'Jones',
    affiliation: 'Institute of Technology',
    country: 'UK',
    roles: ['reviewer'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  usersStorage.create(adminUser);
  usersStorage.create(authorUser);
  usersStorage.create(reviewerUser);

  // Set admin as current user
  authStorage.setCurrentUser(adminUser);

  // Seed journal
  const journal: Journal = {
    id: 'journal-1',
    name: 'International Journal of Computer Science',
    initials: 'IJCS',
    description: 'A leading journal in computer science research and innovation',
    publisher: 'Academic Press',
    issn: '1234-5678',
    eissn: '1234-5679',
    onlineIssn: '1234-5679',
    path: 'ijcs',
    enabled: true,
    primaryLocale: 'en_US',
    supportedLocales: ['en_US', 'fr_FR'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  journalsStorage.create(journal);

  // Seed sections
  const sections: Section[] = [
    {
      id: 'section-1',
      journalId: 'journal-1',
      title: 'Articles',
      abbrev: 'ART',
      policy: 'Original research articles',
      isInactive: false,
      abstractWordCount: 250,
      sequence: 1,
    },
    {
      id: 'section-2',
      journalId: 'journal-1',
      title: 'Reviews',
      abbrev: 'REV',
      policy: 'Literature reviews and systematic reviews',
      isInactive: false,
      abstractWordCount: 300,
      sequence: 2,
    },
  ];

  sections.forEach((s) => sectionsStorage.create(s));

  // Seed sample submissions
  const submission: Submission = {
    id: 'submission-1',
    journalId: 'journal-1',
    authorId: 'user-2',
    title: 'Machine Learning Approaches for Natural Language Processing',
    abstract:
      'This paper presents novel machine learning approaches for improving natural language processing tasks. We demonstrate significant improvements in accuracy and performance across multiple benchmarks.',
    keywords: ['machine learning', 'NLP', 'deep learning', 'transformers'],
    language: 'en',
    stage: 'review',
    status: 'review',
    submittedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastModified: new Date().toISOString(),
    sectionId: 'section-1',
    editorId: 'user-1',
    reviewRound: 1,
    files: [],
    metadata: {
      contributors: [
        {
          id: 'contrib-1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'author@university.edu',
          affiliation: 'University of Science',
          country: 'US',
          role: 'author',
          isPrimary: true,
          sequence: 1,
        },
      ],
    },
  };

  submissionsStorage.create(submission);

  // Seed a review
  const review: Review = {
    id: 'review-1',
    submissionId: 'submission-1',
    reviewerId: 'user-3',
    reviewRound: 1,
    assignedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    declined: false,
    comments: '',
    reviewMethod: 'doubleBlind',
    files: [],
  };

  reviewsStorage.create(review);

  console.log('OJS seed data initialized');
};
