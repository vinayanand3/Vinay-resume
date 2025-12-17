import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { Github, Linkedin, Twitter, Mail, ExternalLink, ArrowRight, FileText } from 'lucide-react';
import { RESUME_DATA } from './constants';
import { SocialLink, Project, Experience, Education } from './types';

// -- Sub Components --

// Helper: extract the most relevant year for sorting period strings (use end-year; treat "Present" as current year).
function getSortYear(period: string): number {
  if (period.includes('Present')) {
    const years = period.match(/\d{4}/g);
    return years && years.length > 0 ? parseInt(years[years.length - 1], 10) : new Date().getFullYear();
  }
  const years = period.match(/\d{4}/g);
  return years && years.length > 0 ? parseInt(years[years.length - 1], 10) : 0;
}

const IconMap = {
  Github,
  Linkedin,
  Twitter,
  Mail,
  FileText
};

const LazyTimeline = React.lazy(() => import('./components/Timeline'));

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    setMatches(mql.matches);
    return () => {
      mql.removeEventListener('change', onChange);
    };
  }, [query]);

  return matches;
}

const SocialButton: React.FC<{ link: SocialLink }> = ({ link }) => {
  const Icon = IconMap[link.iconName as keyof typeof IconMap] || ExternalLink;
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-all duration-200 group"
      aria-label={link.platform}
    >
      <Icon size={20} className="group-hover:scale-110 transition-transform" />
    </a>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-8">
    {title}
  </h2>
);

const ExperienceCard: React.FC<{ job: Experience }> = ({ job }) => (
  <div className="group relative grid grid-cols-1 md:grid-cols-8 gap-4 mb-12 transition-all">
    <div className="md:col-span-2 text-xs text-zinc-500 font-medium uppercase tracking-wide mt-1">
      {job.period}
    </div>
    <div className="md:col-span-6">
      <h3 className="font-medium text-zinc-100 text-lg group-hover:text-accent transition-colors flex items-center gap-2">
        {job.role}
        <span className="text-zinc-500 font-normal text-base"> — {job.company}</span>
      </h3>
      <p className="mt-2 text-zinc-400 leading-relaxed text-sm">
        {job.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {job.technologies.map(tech => (
          <span key={tech} className="px-2.5 py-1 text-xs rounded-full bg-zinc-800/50 text-accent border border-zinc-800/50">
            {tech}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const EducationCard: React.FC<{ education: Education }> = ({ education }) => (
  <div className="group relative grid grid-cols-1 md:grid-cols-8 gap-4 mb-12 transition-all">
    <div className="md:col-span-2 text-xs text-zinc-500 font-medium uppercase tracking-wide mt-1">
      {education.period}
    </div>
    <div className="md:col-span-6">
      <h3 className="font-medium text-zinc-100 text-lg group-hover:text-emerald-400 transition-colors flex items-center gap-2">
        {education.degree}
        <span className="text-zinc-500 font-normal text-base"> — {education.institution}</span>
      </h3>
    </div>
  </div>
);

const ProjectCard: React.FC<{ project: Project; onSelect: (project: Project) => void }> = ({ project, onSelect }) => {
  const [imageSrc, setImageSrc] = useState(project.image || '');
  const [imageError, setImageError] = useState(false);
  const [triedAltImage, setTriedAltImage] = useState(false);

  useEffect(() => {
    setImageSrc(project.image || '');
    setImageError(false);
    setTriedAltImage(false);
  }, [project.image]);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(project);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group block w-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
    >
      <div className="relative grid grid-cols-1 md:grid-cols-8 gap-4 mb-12 hover:bg-zinc-900/40 p-0 md:-mx-4 md:p-4 rounded-lg transition-all border border-transparent hover:border-zinc-800/50">
      <div className="md:col-span-2 mt-1">
        <div className="rounded border border-zinc-800 bg-zinc-900 overflow-hidden h-20 w-32 md:w-full md:h-24 relative">
          {/* Placeholder for image - using a subtle gradient if image fails or just as style */}
          {!imageSrc || imageError ? (
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
          ) : (
            <img
              src={imageSrc}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
              onError={() => {
                // If the cached bundle is still pointing at the old filename, try the *_1 variant once.
                if (!triedAltImage && !imageSrc.includes('_1.')) {
                  setTriedAltImage(true);
                  setImageSrc(imageSrc.replace(/(\.[a-zA-Z0-9]+)$/, '_1$1'));
                  return;
                }
                setImageError(true);
              }}
            />
          )}
        </div>
      </div>
      <div className="md:col-span-6">
        <h3 className="font-medium text-zinc-100 text-lg group-hover:text-accent transition-colors flex items-center gap-2">
          {project.title}
          <ArrowRight size={16} className="-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-accent" />
        </h3>
        <p className="mt-2 text-zinc-400 leading-relaxed text-sm">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map(tech => (
            <span key={tech} className="px-2.5 py-1 text-xs rounded-full bg-zinc-800/50 text-zinc-300 border border-zinc-800/50 group-hover:border-accent/20 group-hover:text-accent transition-colors">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  </button>
  );
};

const ProjectDetail: React.FC<{ project: Project; onBack: () => void }> = ({ project, onBack }) => {
  const [imageSrc, setImageSrc] = useState(project.image || '');
  const [imageError, setImageError] = useState(false);
  const [triedAltImage, setTriedAltImage] = useState(false);

  useEffect(() => {
    setImageSrc(project.image || '');
    setImageError(false);
    setTriedAltImage(false);
  }, [project.image]);

  return (
    <article className="space-y-6">
    <button
      type="button"
      onClick={onBack}
      className="mb-4 inline-flex items-center text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-200 transition-colors"
    >
      <ArrowRight className="mr-1 h-3 w-3 rotate-180" />
      Back to projects
    </button>

    <h3 className="text-xl font-semibold text-zinc-100 flex items-center gap-3">
      {project.title}
      <span className="inline-flex flex-wrap gap-1">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 text-[11px] rounded-full bg-zinc-800/60 text-zinc-300 border border-zinc-700"
          >
            {tech}
          </span>
        ))}
      </span>
    </h3>

    <p className="text-sm text-zinc-400 leading-relaxed">
      {project.description}
    </p>

    {/* Project image (shown after the description) */}
    {imageSrc && !imageError ? (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <img
          src={imageSrc}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="w-full max-h-[420px] object-cover"
          onError={() => {
            if (!triedAltImage && !imageSrc.includes('_1.')) {
              setTriedAltImage(true);
              setImageSrc(imageSrc.replace(/(\.[a-zA-Z0-9]+)$/, '_1$1'));
              return;
            }
            setImageError(true);
          }}
        />
      </div>
    ) : (
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-800 to-zinc-900 h-48 w-full" />
    )}

    {project.details && project.details.length > 0 && (
      <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
        {project.details.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
    )}
    </article>
  );
};

// -- Main App Component --

export default function App() {
  const [activeSection, setActiveSection] = useState('about');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // On desktop, move Education into the left column for a cleaner right side.
  // On smaller screens, keep Education in the main scrollable content.
  const sectionIds = useMemo(
    () => (isDesktop ? (['about', 'experience', 'projects'] as const) : (['about', 'experience', 'education', 'projects'] as const)),
    [isDesktop]
  );

  const sortedEducation = useMemo(() => {
    return [...RESUME_DATA.education].sort((a, b) => getSortYear(b.period) - getSortYear(a.period));
  }, []);

  // Use IntersectionObserver instead of scroll listeners (less main-thread churn).
  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most visible intersecting section.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        const top = visible[0];
        if (top?.target?.id) setActiveSection(top.target.id);
      },
      {
        // "Active" when section header is near top portion of viewport.
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: [0.01, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
  }, []);

  const resumeUrl = useMemo(
    () => RESUME_DATA.socials.find((s) => s.platform === 'Resume')?.url || '#',
    []
  );

  return (
    <div className="min-h-screen bg-background text-zinc-400 selection:bg-accent/20 selection:text-accent font-sans">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-12 xl:px-16 2xl:px-20 py-12 lg:py-0">
        {/* On desktop, keep the left column fixed and scroll only the right column. */}
        <div className="lg:flex lg:h-screen lg:overflow-hidden lg:justify-between lg:gap-8 xl:gap-10">
          
          {/* -- LEFT COLUMN (Fixed Header) -- */}
          <header className="lg:sticky lg:top-0 lg:h-screen lg:w-[48%] xl:w-[46%] lg:flex-none lg:py-24 lg:overflow-y-auto lg:pr-3 min-w-0 no-scrollbar [@media(min-width:1024px)_and_(max-height:800px)]:py-16 [@media(min-width:1024px)_and_(max-height:700px)]:py-12">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100">
                <a href="/">{RESUME_DATA.name}</a>
              </h1>
              <h2 className="mt-3 text-lg font-medium text-zinc-100 tracking-tight sm:text-xl">
                {RESUME_DATA.title}
              </h2>
              <p className="mt-4 max-w-xs leading-normal text-zinc-400">
                {RESUME_DATA.bio}
              </p>

              {/* Timeline Animation (Desktop) */}
              {isDesktop && (
                <div className="hidden lg:block mt-10 [@media(min-width:1024px)_and_(max-height:800px)]:mt-6">
                  <Suspense fallback={<div className="mb-8 pr-8 h-12" />}>
                    <LazyTimeline />
                  </Suspense>
                </div>
              )}

              {/* Socials & Resume */}
              <div className="mt-8 flex flex-wrap items-center gap-4 [@media(min-width:1024px)_and_(max-height:800px)]:mt-5 [@media(min-width:1024px)_and_(max-height:800px)]:gap-3">
                {RESUME_DATA.socials.map((link) => (
                  <SocialButton key={link.platform} link={link} />
                ))}
                {/* Availability Indicator */}
                {RESUME_DATA.availability && (
                  <div className="ml-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-emerald-400">Available for work</span>
                  </div>
                )}
              </div>

              {/* Navigation (Desktop) */}
              <nav className="nav hidden lg:block mt-10 [@media(min-width:1024px)_and_(max-height:800px)]:mt-7" aria-label="In-page jump links">
                <ul className="w-max">
                  {sectionIds.map((item) => (
                    <li key={item}>
                      <button 
                        onClick={() => scrollTo(item)}
                        className={`group flex items-center py-3 active focus:outline-none transition-all ${activeSection === item ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-200'}`}
                      >
                        <span className={`mr-4 h-px transition-all bg-zinc-600 group-hover:w-16 group-hover:bg-zinc-200 ${activeSection === item ? 'w-16 bg-zinc-100' : 'w-8'}`}></span>
                        <span className="text-xs font-bold uppercase tracking-widest">
                          {item === 'experience' ? 'Professional Experience' : item === 'education' ? 'Educational Qualifications' : item}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Educational Qualifications (Desktop-only, moved from right column) */}
              {isDesktop && (
                <div className="hidden lg:block mt-10 [@media(min-width:1024px)_and_(max-height:800px)]:mt-7">
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
                    Educational Qualifications
                  </div>
                  <ul className="space-y-4">
                    {sortedEducation.map((edu) => (
                      <li key={edu.id} className="max-w-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-zinc-100 leading-snug">
                              {edu.degree}
                            </div>
                            <div className="text-xs text-zinc-500 mt-1 truncate">
                              {edu.institution}
                            </div>
                          </div>
                          <div className="shrink-0 text-[11px] text-zinc-500 font-mono whitespace-nowrap pt-0.5">
                            {edu.period}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </header>

          {/* -- RIGHT COLUMN (Scrollable Content) -- */}
          <main className="pt-24 lg:flex-1 lg:min-w-0 lg:h-screen lg:overflow-y-auto lg:py-24 no-scrollbar">
            
            {/* ABOUT */}
            <section id="about" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
              <SectionHeader title="About" />
              <div className="text-zinc-400 leading-relaxed space-y-4">
                <p>
                  I am an experienced <span className="text-zinc-100">Design Engineer</span> with over 10 years in the automotive industry. My expertise lies in <span className="text-zinc-100">Body in White (BIW)</span> structures, sheet metal product design, and executing new vehicle development programs from concept to production.
                </p>
                <p>
                   I have had the privilege of working with global OEMs including <span className="text-zinc-100">Rivian</span>, <span className="text-zinc-100">Ford</span>, <span className="text-zinc-100">FCA</span>, and <span className="text-zinc-100">Hyundai</span>, gaining valuable cross-functional experience.
                </p>
                <p>
                  Currently, I am bridging the gap between mechanical engineering and software by pursuing a <span className="text-zinc-100">Master's in Computer Science (OMSCS)</span> at Georgia Tech. I am passionate about leveraging <span className="text-zinc-100">Python</span> and <span className="text-zinc-100">Generative AI</span> to build tools that optimize engineering workflows and solve complex manufacturing problems.
                </p>
              </div>
            </section>

            {/* PROFESSIONAL EXPERIENCE */}
            <section id="experience" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
              <SectionHeader title="Professional Experience" />
              <div>
                {(() => {
                  // Helper function to extract sort year from period string
                  // Uses the last year in the period (end year) for proper chronological sorting
                  const getSortYear = (period: string): number => {
                    // Check if period contains "Present" - use current year for sorting
                    if (period.includes('Present')) {
                      const years = period.match(/\d{4}/g);
                      // If there's a year before "Present", use it; otherwise use current year
                      return years && years.length > 0 ? parseInt(years[years.length - 1]) : new Date().getFullYear();
                    }
                    // Extract all years and use the last one (end year)
                    const years = period.match(/\d{4}/g);
                    return years && years.length > 0 ? parseInt(years[years.length - 1]) : 0;
                  };
                  
                  // Sort experiences by date (descending - most recent first)
                  const sortedExperiences = [...RESUME_DATA.experience].sort((a, b) => {
                    const yearA = getSortYear(a.period);
                    const yearB = getSortYear(b.period);
                    return yearB - yearA;
                  });
                  
                  return sortedExperiences.map(exp => (
                    <ExperienceCard key={exp.id} job={exp} />
                  ));
                })()}
              </div>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-medium leading-tight text-zinc-100 font-semibold group" aria-label="View Full Resume">
                <span className="border-b border-transparent pb-px transition group-hover:border-accent motion-reduce:transition-none">
                  View Full Resume
                </span>
                <ArrowRight className="ml-1 h-4 w-4 shrink-0 -translate-x-1 transition-transform group-hover:translate-x-0 group-hover:text-accent motion-reduce:transition-none" />
              </a>
            </section>

            {/* EDUCATIONAL QUALIFICATIONS (keep in main flow on smaller screens only) */}
            {!isDesktop && (
              <section id="education" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
                <SectionHeader title="Educational Qualifications" />
                <div>
                  {sortedEducation.map((edu) => (
                    <EducationCard key={edu.id} education={edu} />
                  ))}
                </div>
              </section>
            )}

            {/* PROJECTS */}
            <section id="projects" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
              <SectionHeader title={selectedProject ? "Project Details" : "Projects"} />
              <div>
                {selectedProject ? (
                  <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />
                ) : (
                  RESUME_DATA.projects.map(project => (
                    <ProjectCard key={project.id} project={project} onSelect={setSelectedProject} />
                  ))
                )}
              </div>
            </section>
            
            {/* FOOTER */}
            <footer className="max-w-md pb-16 text-sm text-zinc-500 sm:pb-0">
              <p>
                Built with <span className="text-zinc-400">React</span> and <span className="text-zinc-400">Tailwind CSS</span>.
              </p>
            </footer>

          </main>
        </div>
      </div>
    </div>
  );
}