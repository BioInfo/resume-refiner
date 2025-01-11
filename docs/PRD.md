# Resume Refiner (Demo) — Product Requirements Document (PRD)

Below is a comprehensive **Product Requirements Document (PRD)** for your **Resume Refiner** demo application. It is designed to be fed into the **Cline agent** (or to guide your own development), ensuring a well-scoped MVP with modern UI/UX (including **Framer Motion** animations), **Supabase** for storage, and **Vercel** deployment.

---

## 1. Overview

**Product Name**: Resume Refiner (Demo)

**Purpose**: Provide a simple, interactive web application for a single user to:
1. Upload a PDF resume.
2. Parse the resume into structured JSON.
3. Paste a job description.
4. Extract relevant info from the job posting.
5. Generate a refined, job-aligned resume using an LLM.

**Key Features**:
- PDF Resume Upload & Parsing
- Job Description Extraction
- LLM-powered Resume Generation
- Modern UI/UX with **Framer Motion**
- Data Storage in **Supabase**
- Deployable on **Vercel**

---

## 2. Objectives and Scope

### Objectives
- Demonstrate a minimal “ResumeFlow”-style pipeline in a Next.js environment.
- Provide a visually appealing front-end with transitions and animations via **Framer Motion**.
- Store parse results and refined resumes in **Supabase** (simple schema).
- Allow easy expansion to multi-user in the future (but current scope is single-user).

### In Scope (MVP)
- Single-user system
- Resume parsing (PDF → text → structured JSON)
- Job description extraction (text → structured JSON)
- Basic LLM calls (OpenAI GPT-4 or placeholders for future LLM integrations)
- One job-aligned resume output flow

### Out of Scope (Future)
- Robust multi-user auth beyond a single user demo
- Advanced styling or multiple templates
- Advanced evaluation dashboards
- Complex error handling, caching, or optimization

---

## 3. User Stories

1. **Upload Resume**  
   *As a user, I can upload my PDF resume and have it parsed into structured JSON.*
2. **Paste Job Description**  
   *As a user, I can paste a job description to extract the relevant requirements.*
3. **Generate Tailored Resume**  
   *As a user, I can refine my resume to match a specific job.*
4. **Download or View**  
   *As a user, I can see or download the refined resume.*

---

## 4. High-Level Architecture

### 4.1 Front-End
- **Next.js 13 (App Router)**
- **TypeScript** for type safety
- **React** functional components
- **Framer Motion** for animations
- **Modern CSS**/SCSS or Tailwind CSS for styling

### 4.2 Back-End & Data Layer
- **Supabase**:
  - Database to store user data, job descriptions, parsed resume JSON, and refined resume JSON
  - (Optional) Supabase Storage for PDFs
- **LLM**:
  - Default: **OpenAI GPT-4** (or GPT-3.5) with environment variables
  - Placeholder for future Gemini or other models

### 4.3 Deployment
- **Vercel** for hosting
- **Supabase** for the database and optional storage

---

## 5. Detailed Requirements

### 5.1 Data Flows

1. **Resume Upload & Parsing**  
   - **Input**: PDF file  
   - **Process**: 
     1. Convert PDF → text (Node library: `pdf-parse` or `pdf-lib`)
     2. LLM prompt to convert text → structured JSON
     3. Store JSON in Supabase (`resume_data` table)
   - **Output**: Structured JSON (returned to front-end + stored in DB)

2. **Job Description Extraction**  
   - **Input**: Plaintext job description (textarea)  
   - **Process**:
     1. Send text to LLM to extract relevant fields (keywords, responsibilities, etc.)
     2. Store extracted JSON in Supabase (`job_data` table)
   - **Output**: JSON of job details (returned + stored)

3. **Resume Refinement**  
   - **Input**: Parsed resume JSON + job details JSON  
   - **Process**:
     1. LLM call to tailor resume to the job
     2. Store refined JSON in Supabase (`refined_resume_data` table)
   - **Output**: Refined JSON (optionally converted to PDF)

### 5.2 Pages and Routes

1. **`/` (Landing Page)**
   - Minimal branding/description of the tool
   - CTA: “Upload Your Resume” → `/upload-resume`
   - **Framer Motion**: Fade in hero section, CTA button

2. **`/upload-resume`**
   - PDF upload input
   - Display upload progress/status
   - Show parsed resume JSON on success
   - **Framer Motion**: Animate a card or container for the upload step

3. **`/refine`**
   - Textarea for job description
   - Dropdown or toggle for LLM model choice (GPT-4 or “Other” placeholder)
   - Button: “Extract Job Details”
   - Display extracted job JSON in a card
   - Button: “Generate Tailored Resume” to finalize the refined resume
   - **Framer Motion**: Fade/scale in for job details card and refined resume preview

4. **`/preview`** *(Optional MVP)*
   - Display final refined resume (JSON or PDF)
   - Button to download PDF
   - **Framer Motion**: Animate transitions when opening this page

### 5.3 UI/UX Requirements

- **Consistency**: Unified color theme, subtle shadows, consistent spacing
- **Shading & Depth**: 
  - Slight box-shadow for cards
  - Hover states with minor darkening or scaling
- **Framer Motion**:
  - Use `spring` or `easeInOut` transitions between pages
  - Buttons slightly scale on hover
  - Elements fade or slide in to provide a polished look

### 5.4 Storage Schema (Supabase)

> For single-user, these tables can be linked to a single `user_id`.  

- **`users`** *(optional for demo, could hardcode)*  
  - `id` (UUID PK)  
  - `email`  
  - `created_at`  

- **`resume_data`**  
  - `id` (UUID PK)  
  - `user_id` (FK to `users.id`)  
  - `resume_text` (text)  
  - `resume_json` (jsonb)  
  - `created_at`  

- **`job_data`**  
  - `id` (UUID PK)  
  - `user_id` (FK to `users.id`)  
  - `job_description` (text)  
  - `extracted_details` (jsonb)  
  - `created_at`  

- **`refined_resume_data`**  
  - `id` (UUID PK)  
  - `user_id` (FK to `users.id`)  
  - `resume_json` (jsonb)  
  - `job_id` (FK to `job_data.id`)  
  - `refined_json` (jsonb)  
  - `created_at`  

*(Storing PDFs: Could use Supabase Storage or just parse in-memory.)*

---

## 6. Technical Requirements

1. **Next.js App Router (v13+)**
   - Separate folders under `app/` for pages and `route.ts` for APIs
2. **Supabase Integration**
   - Use official Supabase JS client
   - Environment variables for Supabase URL + anon/public key
3. **LLM Calls (OpenAI)**
   - Use `openai` npm package or REST endpoints
   - Store `OPENAI_API_KEY` in `.env`
4. **PDF Parsing**
   - Use `pdf-parse` or `pdf-lib` to read PDF content
   - Feed text to LLM with a structured prompt
5. **Framer Motion**
   - Add transitions to pages, buttons, cards
6. **PDF Generation** *(Optional for MVP)*
   - `pdfmake`, `pdf-lib`, or serverless LaTeX
   - Provide a “Download PDF” feature after generating refined JSON

---

## 7. Future Enhancements

- **Multi-user & Auth**: Use Supabase Auth for multiple users
- **Multi-step Wizard**: Step-by-step flow with progress tracking
- **Advanced Templates**: Multiple resume designs
- **Evaluation Dashboard**: Show alignment/hallucination metrics
- **Cover Letters**: Extend the same pipeline to generate custom cover letters
- **Caching & Rate Limiting**: Optimize performance and manage costs

---

## 8. Milestones & Timeline

1. **Week 1**
   - Set up Next.js + Supabase
   - Create initial DB schema
   - Implement PDF upload and parse route

2. **Week 2**
   - Job description extraction
   - LLM-based refinement
   - Supabase read/write integration

3. **Week 3**
   - Add Framer Motion animations
   - Provide final refined resume (JSON or PDF)
   - Deploy on Vercel

4. **Week 4** (Polish & Demo)
   - Refine UI design (colors, shading)
   - Document usage
   - Present MVP demo

---

## 9. Acceptance Criteria

1. **Upload & Parse**
   - Upload PDF → parse text → store JSON in Supabase
2. **Job Extraction**
   - Paste job description → extract fields → store in DB
3. **Tailored Resume**
   - Generate refined JSON → store in DB → display to user
4. **UI/UX**
   - Page transitions, button hover animations, shading
5. **Deployment**
   - Accessible on Vercel URL
6. **Data Persistence**
   - Data remains in Supabase upon refresh (for the single user)

---

## 10. Security & Compliance

- **API Keys**: Keep in Vercel Env Vars (never commit to Git)
- **Supabase**: For multi-user expansion, enable Row Level Security (RLS)
- **Uploads**: Validate PDF file types

---

# End of PRD

Use this **PRD** as the blueprint for the **Cline agent** or for your own development. It outlines the **ResumeFlow** pipeline with modern UI, storage in **Supabase**, and easy deployment on **Vercel** for a single-user demo MVP. Future expansions (multi-user auth, advanced dashboards, etc.) can be added once the core functionality is proven.
