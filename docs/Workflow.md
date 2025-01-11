# ResumeFlow: Auto Resume Building LLM Pipeline

Below is a step‐by‐step interpretation of the diagram, describing the algorithmic workflow for how the app transforms user/job inputs into a final tailored resume PDF.

---

## 1. Inputs

1. **User Master Data**  
   - The user provides their background information: personal details, work experience, education, projects, skills, etc.

2. **Job Description**  
   - A target job posting or description containing role requirements, desired skills, and responsibilities.

---

## 2. User Data Extractor

1. **System Prompt: Convert User Data to JSON**  
   - A system or “meta” prompt instructs the LLM to take the user’s master data (unstructured or semi‐structured) and convert it into a standardized JSON format.
   - **Example**: The system prompt may request a JSON object with keys like `personal_info`, `work_experience`, `education`, `projects`, `skills`, etc.

2. **LLM Processes User Master Data**  
   - The Large Language Model ingests both the user data and the system prompt, then outputs a JSON representation (the “Master JSON Data”).

3. **Master JSON Data**  
   - The structured output of the user’s data might look like:
     ```json
     {
       "personal_info": { ... },
       "work_experience": [ ... ],
       "education": [ ... ],
       "projects": [ ... ],
       "skills": [ ... ],
       ...
     }
     ```

---

## 3. Job Detail Extractor

1. **System Prompt & Task Instructions**  
   - A separate system prompt (plus additional instructions) is provided to the LLM to parse the job description.
   - **Goal**: Identify key details—skills, responsibilities, qualifications, desired experiences—within the job posting.

2. **LLM Processes Job Description**  
   - The LLM uses the prompt logic to produce a structured JSON object summarizing the job requirements.

3. **Job Detail JSON**  
   - The final structured representation of the job posting might be:
     ```json
     {
       "role_title": "...",
       "required_skills": [ ... ],
       "responsibilities": [ ... ],
       "qualifications": [ ... ],
       ...
     }
     ```

---

## 4. Resume Generator

### 4.1 User Section (Raw Data)

- The system organizes the user’s data into major resume sections (Work, Education, Projects, Skills, etc.) as found in the “Master JSON Data.”

### 4.2 Section‐Specific System Prompt

1. **Purpose**  
   - For each resume section (Work, Education, Projects, Skills, etc.), a specialized prompt is created to tailor that section to the job.

2. **Input**  
   - **Extracted User Data** for that section (from the `Master JSON Data`).  
   - **Extracted Job Details** (from the `Job Detail JSON`).

3. **LLM Tailoring**  
   - The LLM merges user data and job requirements.  
   - It reorganizes or rewrites the user’s content to emphasize relevant skills and experiences for the role.

4. **Output**  
   - Text or bullet points that showcase how the user’s background aligns with the job description.

### 4.3 Putting It All Together

1. **Compile All Sections**  
   - Once all sections (Work, Education, Projects, Skills, etc.) are tailored, the system merges them into a single document.

2. **LaTeX to PDF**  
   - The combined document is transformed into a LaTeX file, which is then compiled into a PDF.  
   - This ensures standardized styling, formatting, and layout.

3. **Personalized Resume PDF**  
   - The user receives a polished PDF that highlights the user’s most relevant skills and experiences for the target job.

---

## 5. Output

- **Personalized Resume PDF**  
  The finished deliverable is a professional resume tailored to the target job, emphasizing the user’s most pertinent qualifications.

---

## Summary of the Workflow

1. **Gather Inputs**: Collect user master data and job description.  
2. **Convert User Data to JSON**: Use an LLM to standardize the user’s data.  
3. **Extract Job Details**: Use a second LLM prompt to parse and structure the job requirements.  
4. **Tailor Each Resume Section**: Combine user data and job details section by section, focusing on relevance.  
5. **Generate PDF**: Convert the combined text to LaTeX, then compile to produce the final, formatted PDF.
