import { CheckCircle } from 'lucide-react';

export function About() {
  const highlights = [
    {
      emoji: "🎯",
      text: "Smart matching technology aligns your resume with specific job requirements"
    },
    {
      emoji: "🤖",
      text: "AI-powered suggestions enhance your professional narrative"
    },
    {
      emoji: "📊",
      text: "ATS optimization ensures your resume gets past automated screening"
    },
    {
      emoji: "⚡",
      text: "Real-time analysis and instant feedback"
    },
    {
      emoji: "🔒",
      text: "Secure document handling with enterprise-grade privacy"
    }
  ];

  return (
    <div className="py-12 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Resume Refiner is an innovative AI-powered platform that transforms the way job seekers optimize their resumes. 
            By leveraging advanced natural language processing and GPT-4 technology, it analyzes both resumes and job descriptions 
            to create perfectly tailored applications that stand out to hiring managers and ATS systems.
          </p>
          
          <div className="space-y-4">
            {highlights.map((highlight, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 bg-muted/50 p-4 rounded-lg"
              >
                <span className="text-2xl">{highlight.emoji}</span>
                <span className="text-sm">{highlight.text}</span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Created by J&S Group, LLC, Resume Refiner combines cutting-edge AI with proven resume optimization techniques 
            to give job seekers a competitive edge in today's dynamic job market.
          </p>
        </div>
      </div>
    </div>
  );
}