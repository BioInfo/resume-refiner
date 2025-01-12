import { 
  FileText, 
  Brain,
  Target,
  Zap,
  Shield,
  Database
} from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "PDF Resume Upload",
      description: "Seamless parsing and processing of PDF resumes"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Analysis",
      description: "Advanced natural language processing with GPT-4 technology"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Smart Matching",
      description: "Precise alignment with job requirements and descriptions"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Feedback",
      description: "Instant analysis and optimization suggestions"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Secure document handling with privacy protection"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Data Persistence",
      description: "Reliable storage with Supabase integration"
    },
  ];

  return (
    <div className="py-12 bg-muted/50">
      <div className="container">
        <h2 className="text-2xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 bg-background rounded-lg shadow-sm border border-border/40 hover:border-border/80 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}