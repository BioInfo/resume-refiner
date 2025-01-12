'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Demo user ID (from currentTask.md)
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

interface CompanyInfo {
  name?: string;
  benefits_offerings?: string[];
  work_model?: string;
  [key: string]: any; // Allow for additional fields
}

interface ExtractedDetails {
  id?: string;  // UUID from job_data table
  role_title: string;
  required_skills: string[];
  preferred_skills: string[];
  responsibilities: string[];
  qualifications: string[];
  company_info?: CompanyInfo;
}

interface RefinedResume {
  personal_info: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
  };
  work_experience: Array<{
    company: string;
    title: string;
    dates: string;
    accomplishments: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    field?: string;
    graduation: string;
  }>;
  skills: string[];
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

export default function RefinePage() {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedDetails, setExtractedDetails] = useState<ExtractedDetails | null>(null);
  const [refinedResume, setRefinedResume] = useState<RefinedResume | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/parse-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse job description');
      }

      // Store job details through API
      const storeResponse = await fetch('/api/store-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          extractedDetails: result.data
        }),
      });

      if (!storeResponse.ok) {
        const error = await storeResponse.json();
        throw new Error(error.message || 'Failed to store job details');
      }

      const jobData = await storeResponse.json();
      setExtractedDetails({ ...result.data, id: jobData.id });
    } catch (err) {
      console.error('Error parsing job description:', err);
      setError(err instanceof Error ? err.message : 'Failed to process job description');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineResume = async () => {
    setError(null);
    setIsRefining(true);

    try {
      if (!extractedDetails?.id) {
        throw new Error('No job details available. Please extract job details first.');
      }

      // Get the current resume data from API
      const resumeResponse = await fetch('/api/get-resume');
      
      if (!resumeResponse.ok) {
        const error = await resumeResponse.json();
        if (resumeResponse.status === 404) {
          throw new Error('Please upload a resume before attempting to refine.');
        }
        throw new Error(error.message || 'Failed to fetch resume data');
      }

      const resumeData = await resumeResponse.json();

      const response = await fetch('/api/refine-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: resumeData?.resume_json,
          jobDetails: {
            id: extractedDetails?.id,
            ...extractedDetails
          }
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to refine resume');
      }

      setRefinedResume(result.data);
    } catch (err) {
      console.error('Error refining resume:', err);
      setError(err instanceof Error ? err.message : 'Failed to refine resume');
    } finally {
      setIsRefining(false);
    }
  };

  const renderCompanyInfo = (info: CompanyInfo) => {
    return (
      <div className="space-y-2">
        {info.name && <p><strong>Company:</strong> {info.name}</p>}
        {info.work_model && <p><strong>Work Model:</strong> {info.work_model}</p>}
        {info.benefits_offerings && info.benefits_offerings.length > 0 && (
          <div>
            <strong>Benefits & Offerings:</strong>
            <ul className="list-disc pl-5 mt-1">
              {info.benefits_offerings.map((benefit, index) => (
                <li key={index} className="text-gray-700">{benefit}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Render any additional fields */}
        {Object.entries(info).map(([key, value]) => {
          if (!['name', 'work_model', 'benefits_offerings'].includes(key) && value) {
            return (
              <p key={key}>
                <strong>{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:</strong>
                {' '}
                {typeof value === 'string' ? value : JSON.stringify(value)}
              </p>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold mb-8">Refine Your Resume</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="jobDescription" 
            className="block text-sm font-medium mb-2"
          >
            Job Description
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Paste the job description here..."
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? 'Analyzing...' : 'Extract Job Details'}
        </Button>
      </form>

      {extractedDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-white rounded-lg shadow"
        >
          <h2 className="text-xl font-semibold mb-6">Extracted Requirements</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Role Title</h3>
              <p className="text-gray-700">{extractedDetails.role_title}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Required Skills</h3>
              <ul className="list-disc pl-5 space-y-1">
                {extractedDetails.required_skills.map((skill, index) => (
                  <li key={index} className="text-gray-700">{skill}</li>
                ))}
              </ul>
            </div>

            {extractedDetails.preferred_skills.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Preferred Skills</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {extractedDetails.preferred_skills.map((skill, index) => (
                    <li key={index} className="text-gray-700">{skill}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium mb-2">Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-1">
                {extractedDetails.responsibilities.map((resp, index) => (
                  <li key={index} className="text-gray-700">{resp}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Qualifications</h3>
              <ul className="list-disc pl-5 space-y-1">
                {extractedDetails.qualifications.map((qual, index) => (
                  <li key={index} className="text-gray-700">{qual}</li>
                ))}
              </ul>
            </div>

            {extractedDetails.company_info && (
              <div>
                <h3 className="text-lg font-medium mb-2">Company Information</h3>
                {renderCompanyInfo(extractedDetails.company_info)}
              </div>
            )}
          </div>

          <div className="mt-8">
            <Button
              onClick={handleRefineResume}
              disabled={isRefining}
              className="w-full sm:w-auto"
            >
              {isRefining ? 'Refining Resume...' : 'Refine Resume with These Requirements'}
            </Button>
          </div>
        </motion.div>
      )}

      {refinedResume && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-white rounded-lg shadow"
        >
          <h2 className="text-xl font-semibold mb-6">Refined Resume</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Personal Information</h3>
              <div className="text-gray-700">
                <p>{refinedResume.personal_info.name}</p>
                <p>{refinedResume.personal_info.email}</p>
                {refinedResume.personal_info.phone && (
                  <p>{refinedResume.personal_info.phone}</p>
                )}
                {refinedResume.personal_info.location && (
                  <p>{refinedResume.personal_info.location}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Work Experience</h3>
              <div className="space-y-4">
                {refinedResume.work_experience.map((exp, index) => (
                  <div key={index} className="text-gray-700">
                    <p className="font-medium">{exp.title} at {exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.dates}</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {exp.accomplishments.map((acc, i) => (
                        <li key={i}>{acc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Education</h3>
              <div className="space-y-2">
                {refinedResume.education.map((edu, index) => (
                  <div key={index} className="text-gray-700">
                    <p className="font-medium">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                    <p>{edu.school}</p>
                    <p className="text-sm text-gray-500">{edu.graduation}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {refinedResume.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {refinedResume.projects && refinedResume.projects.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Projects</h3>
                <div className="space-y-4">
                  {refinedResume.projects.map((project, index) => (
                    <div key={index} className="text-gray-700">
                      <p className="font-medium">{project.name}</p>
                      <p className="mt-1">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              onClick={() => {/* TODO: Implement PDF download */}}
              className="w-full sm:w-auto"
            >
              Download as PDF
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}