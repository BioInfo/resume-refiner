# Resume Refiner

An AI-powered resume refinement tool that helps optimize resumes for specific job postings. Created by J&S Group, LLC.

## Features

- PDF resume upload and parsing
- AI-powered resume analysis
- Job description matching
- Modern UI with ShadcnUI components
- Data persistence with Supabase
- Dark mode support

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ and npm
- A Supabase account
- An OpenAI API key
- Git (for version control)

## Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/resume-refiner.git
cd resume-refiner

# Install dependencies
npm install
```

### 2. Supabase Setup

1. Create a new project at [Supabase](https://supabase.com)
2. Navigate to Project Settings > Database
3. Copy your project URL and anon/public key
4. Open the SQL Editor
5. Copy and paste the contents of `supabase/schema.sql`
6. Execute the SQL to create the database schema

### 3. OpenAI Setup

1. Create an account at [OpenAI Platform](https://platform.openai.com)
2. Navigate to API Keys in your account settings
3. Generate a new API key
4. Make sure billing is configured for API usage

### 4. Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI Configuration
OPENAI_API_KEY=your-openai-key
```

### 5. Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
resume-refiner/
├── src/
│   ├── app/                 # Next.js 13 app directory
│   │   ├── api/            # API routes
│   │   ├── upload-resume/  # Resume upload page
│   │   └── page.tsx        # Landing page
│   ├── components/         # React components
│   │   └── ui/            # Shared UI components
│   ├── lib/               # Utilities
│   └── types/             # TypeScript definitions
├── docs/                  # Documentation
└── supabase/             # Database schema
```

## Key Technologies

- **Frontend**: Next.js 13 (App Router), TypeScript, Tailwind CSS
- **UI Components**: ShadcnUI
- **Backend**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4
- **PDF Processing**: pdf-parse
- **Deployment**: Vercel

## Development Guidelines

1. **TypeScript**
   - Use strict type checking
   - Define interfaces for all data structures
   - Avoid using `any` type

2. **Components**
   - Use functional components
   - Implement proper error boundaries
   - Follow ShadcnUI patterns

3. **API Routes**
   - Handle errors gracefully
   - Validate input data
   - Use appropriate HTTP methods

4. **Database**
   - Follow schema definitions
   - Use proper error handling
   - Implement RLS policies

## Common Issues and Solutions

1. **PDF Parsing Errors**
   - Ensure PDF files are valid
   - Check file size limits
   - Verify file permissions

2. **OpenAI API Issues**
   - Check API key validity
   - Monitor rate limits
   - Handle timeout errors

3. **Supabase Connection**
   - Verify environment variables
   - Check RLS policies
   - Monitor connection pool

## Contributing

Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under a custom non-commercial license. See the [LICENSE](LICENSE) file for details. For commercial licensing opportunities, please contact J&S Group, LLC.

## Support

For support, please:
1. Check the documentation in the `docs/` directory
2. Review common issues above
3. Open an issue on GitHub

## Acknowledgments

- Created and maintained by J&S Group, LLC
- Built with Next.js and Supabase
- UI components from ShadcnUI
