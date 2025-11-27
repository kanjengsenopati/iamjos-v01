# Open Journal System (OJS) - Next.js Implementation

A modern, full-stack implementation of an Open Journal System inspired by OJS 3.3, built with Next.js, TypeScript, and localStorage for prototyping (database-ready architecture).

## Features

### ✅ Completed Features

#### 1. **Core Architecture**
- Complete database schema design (PostgreSQL-ready)
- localStorage utilities for prototyping
- Type-safe TypeScript interfaces
- Database migration-ready structure

#### 2. **Dashboard & Overview**
- Real-time statistics (submissions, reviews, published articles)
- Recent submissions feed
- Workflow stage visualization
- Quick action shortcuts
- Activity timeline

#### 3. **Submission Management**
- Create new manuscript submissions
- Article metadata forms (title, abstract, keywords, contributors)
- Multi-stage workflow tracking
- Submission list with filtering (stage, status, search)
- Detailed submission view with tabs
- File upload interface (UI ready)

#### 4. **Workflow Stages**
- **Submission** - Initial manuscript intake
- **Review** - Peer review process
- **Copyediting** - Editorial improvements
- **Production** - Final preparation
- **Published** - Live publication

#### 5. **Review Management**
- Review assignment system
- Review dashboard with status tracking
- Complete review interface with:
  - Recommendation selection (Accept, Minor/Major Revisions, Reject)
  - Quality rating (1-5 scale)
  - Comments for author, editor, and general
  - Decline review option
- Due date tracking with overdue indicators

#### 6. **User Management**
- Multi-role system (Admin, Editor, Reviewer, Author, Reader)
- User directory with search and filtering
- Role-based badges and indicators
- User profiles with affiliation and contact info

#### 7. **Issues & Publications**
- Journal issue management
- Volume and issue organization
- Publication status tracking
- Issue metadata (title, description, cover image)

#### 8. **Settings & Configuration**
- Journal information management
- Email configuration
- Workflow settings (review deadlines, reviewer requirements)
- Appearance customization
- ISSN management

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI + Radix UI
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Storage**: localStorage (prototyping) → Database-ready

## Project Structure

```
src/
├── app/                          # Next.js app router pages
│   ├── page.tsx                 # Dashboard
│   ├── submissions/             # Submission management
│   │   ├── page.tsx            # Submissions list
│   │   ├── new/                # New submission form
│   │   └── [id]/               # Submission detail
│   ├── reviews/                 # Review management
│   │   ├── page.tsx            # Reviews list
│   │   └── [id]/complete/      # Complete review
│   ├── users/                   # User management
│   ├── issues/                  # Issue management
│   └── settings/                # Journal settings
├── components/
│   ├── ojs/                     # OJS-specific components
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── Header.tsx          # Page header
│   │   └── WorkflowStages.tsx  # Workflow visualization
│   └── ui/                      # Shadcn UI components
├── lib/
│   ├── types/
│   │   └── ojs.ts              # TypeScript interfaces & DB schema
│   └── storage/
│       └── localStorage.ts      # Storage utilities & queries
```

## Database Schema

The application includes a complete PostgreSQL schema with:

- **Users** - User accounts and authentication
- **User Roles** - Many-to-many role assignments
- **Journals** - Journal configuration and metadata
- **Submissions** - Manuscript submissions
- **Submission Files** - Uploaded documents
- **Reviews** - Peer review records
- **Decisions** - Editorial decisions
- **Issues** - Published journal issues
- **Sections** - Journal sections
- **Contributors** - Article authors and contributors

All schemas include proper indexes, foreign keys, and constraints for production use.

## Entity Types

### User Roles
- `admin` - System administrator
- `editor` - Journal editor
- `reviewer` - Peer reviewer
- `author` - Manuscript author
- `reader` - Public reader

### Workflow Stages
- `submission` - Initial submission
- `review` - Under peer review
- `copyediting` - Editorial review
- `production` - Final production
- `published` - Published article

### Submission Status
- `incomplete` - Draft submission
- `queued` - Awaiting assignment
- `review` - In peer review
- `editing` - In editorial review
- `published` - Published
- `declined` - Rejected

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Modern web browser

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Demo Data

The application automatically initializes with seed data:
- 3 demo users (Admin, Author, Reviewer)
- 1 journal (International Journal of Computer Science)
- 2 sections (Articles, Reviews)
- 1 sample submission with review

Click "Initialize Demo Data" on first load to populate the system.

## Migration to Production Database

To migrate from localStorage to a real database:

1. **Setup Database**:
   - Create PostgreSQL database
   - Run the schema from `src/lib/types/ojs.ts` (DATABASE_SCHEMA constant)

2. **Update Storage Layer**:
   - Replace `src/lib/storage/localStorage.ts` with database client
   - Use the same interface methods (getAll, getById, create, update, delete)
   - Keep the queries object structure for complex operations

3. **Add API Routes**:
   - Create `/api` routes for CRUD operations
   - Implement authentication middleware
   - Add server-side validation

4. **Update Components**:
   - Replace direct storage calls with API calls
   - Add loading states
   - Implement error handling

## Key Features Reference

### Storage Utilities
```typescript
// Get all items
usersStorage.getAll()
submissionsStorage.getAll()

// Get by ID
usersStorage.getById('user-1')

// Create new
submissionsStorage.create(newSubmission)

// Update
submissionsStorage.update('submission-1', updates)

// Complex queries
queries.getSubmissionsByJournal(journalId)
queries.getReviewsByReviewer(reviewerId)
queries.getDashboardStats(journalId)
```

### Role-Based Access
The current implementation uses role arrays on the User object. For production:
- Implement proper authentication (NextAuth, Clerk, etc.)
- Add role-based middleware for API routes
- Implement row-level security in database

## OJS 3.3 Reference

This implementation is inspired by:
- [OJS 3.3 Documentation](https://docs.pkp.sfu.ca/dev/documentation/3.3/en/)
- Workflow architecture from PKP (Public Knowledge Project)
- Editorial and review processes

## Future Enhancements

### Planned Features
- [ ] Authentication system (NextAuth.js)
- [ ] Real database integration (Prisma + PostgreSQL)
- [ ] File upload with cloud storage
- [ ] Email notifications
- [ ] DOI management
- [ ] ORCID integration
- [ ] Citation formatting
- [ ] Export functionality (PDF, XML, etc.)
- [ ] Advanced search
- [ ] Statistics and analytics
- [ ] Multi-language support
- [ ] Payment integration (for article processing charges)

### API Routes (Next Steps)
```
/api/submissions
  GET    - List submissions
  POST   - Create submission
  
/api/submissions/[id]
  GET    - Get submission
  PUT    - Update submission
  DELETE - Delete submission
  
/api/reviews
  GET    - List reviews
  POST   - Create review
  
/api/users
  GET    - List users
  POST   - Create user
  
/api/issues
  GET    - List issues
  POST   - Create issue
```

## Contributing

This is a prototype implementation. To contribute:
1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Submit a pull request

## License

MIT License - feel free to use this as a starting point for your journal management system.

## Support

For questions or issues, please refer to the OJS documentation or create an issue in the repository.

---

**Built with ❤️ using Next.js and modern web technologies**
