## Key Components and Their Interactions
- **Frontend**: Next.js-powered UI for user interactions.
- **Backend**: Node.js APIs handle data parsing, analysis, and storage.
- **Database**: Supabase stores resumes, job descriptions, and refined data.

## Data Flow
1. User uploads a resume in PDF format.
2. Backend converts PDF to structured JSON using `pdf-parse`.
3. LLM tailors resume content based on job descriptions.
4. Refined data is stored in Supabase and presented in the UI.

## External Dependencies
- OpenAI for LLM-based analysis.
- Supabase for database and storage.
- Vercel for application hosting.

## Recent Significant Changes
- Integrated job description parsing logic.
- Established database schema in Supabase for structured data.

## User Feedback Integration and Its Impact on Development
- Early users suggested simplified resume refinement steps.
- Action: Improved UX design for upload and refinement flows.

## Additional Reference Documents
- [Workflow.md](./Workflow.md): Details the operational flow of the ResumeFlow pipeline.
- [PRD.md](./PRD.md): Comprehensive PRD outlining project goals and features.
- [sharedDB.md](./sharedDB.md): Comprehensive supabase shared database best practices.
- [design.md](./design.md): Design principles

