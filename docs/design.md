## Design System

### Color Palette

typescript

Copy

`// tailwind.config.js module.exports = {   theme: {    extend: {      colors: {        primary: {          50: '#f0f9ff',          100: '#e0f2fe',          500: '#0ea5e9',          900: '#0c4a6e',        },        accent: {          50: '#fdf4ff',          100: '#fae8ff',          500: '#d946ef',          900: '#701a75',        }      }    }  } }`

### Typography

typescript

Copy

`// Font configuration import { Inter } from 'next/font/google' const inter = Inter({   subsets: ['latin'],  display: 'swap', })`

## Component Architecture

### Resume Builder

typescript

Copy

`// Resume builder component structure interface ResumeSection {   id: string  title: string  content: string  order: number } interface ResumeTemplate {   id: string  name: string  sections: ResumeSection[] } const ResumeBuilder: React.FC = () => {   return (    <div className="max-w-4xl mx-auto p-6">      <TemplatePicker />      <SectionEditor />      <PreviewPane />    </div>  ) }`

## Animation Strategy

### Page Transitions

typescript

Copy

`// Framer Motion page transition const pageVariants = {   initial: { opacity: 0, y: 20 },  animate: { opacity: 1, y: 0 },  exit: { opacity: 0, y: -20 } } const PageWrapper = ({ children }) => {   return (    <motion.div      variants={pageVariants}      initial="initial"      animate="animate"      exit="exit"      transition={{ duration: 0.3 }}    >      {children}    </motion.div>  ) }`

### Micro-interactions

typescript

Copy

`// Button hover animation const buttonVariants = {   hover: {    scale: 1.02,    transition: {      duration: 0.2,      ease: "easeInOut"    }  },  tap: {    scale: 0.98  } }`

## Performance Considerations

### Image Optimization

typescript

Copy

`// Next.js Image component usage import Image from 'next/image' const ProfileImage = () => {   return (    <Image      src="/profile.jpg"      alt="Profile"      width={200}      height={200}      placeholder="blur"      className="rounded-full"    />  ) }`