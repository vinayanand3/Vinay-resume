import { ResumeData } from './types';

export const RESUME_DATA: ResumeData = {
  name: "Vinay Anand Bhaskarla",
  title: "Design Engineer | OMSCS Student",
  bio: "Design Engineer with 10+ years in Automotive (BIW, Product Design). Proficient in CAD (Catia/NX) and Python for engineering automation. Currently pursuing a Master's in Computer Science at Georgia Tech.",
  location: "Farmington Hills, MI",
  availability: true,
  socials: [
    { platform: "GitHub", url: "https://github.com/vinayanand3", iconName: "Github" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/vinayanand2", iconName: "Linkedin" },
    { platform: "Email", url: "mailto:vinayanand2@gmail.com", iconName: "Mail" },
    { platform: "Resume", url: "/vinay-resume/Vinay%20Bhaskarla_Resume.pdf", iconName: "FileText" }
  ],
  experience: [
    {
      id: "exp-1",
      company: "Nissan Technical Center (Goken America)",
      role: "Design Release Engineer (Materials)",
      period: "Sep 2024 — Present",
      description: "Leading flex sourcing strategies for materials to drive cost savings. Developed Python tools to automate mechanical property and chemistry comparisons between flat steel grades. Working on steel coil width optimization to reduce scrap.",
      technologies: ["NX11", "Catia V5", "Python", "DVPR", "Material Science"]
    },
    {
      id: "exp-2",
      company: "Rivian Automotive",
      role: "Senior Mechanical Design Engineer",
      period: "May 2021 — Sep 2024",
      description: "Engineered BIW structure fasteners, sealers, B-pillars, and bumper beams for RPV and R1T programs. Created strategies for commonizing welds/SPRs and managed PLM data in Enovia. Provided on-site plant support in Normal, IL.",
      technologies: ["Catia V6 (3DX)", "Enovia", "DFM", "GD&T", "Jira"]
    },
    {
      id: "exp-3",
      company: "FCA (TEC Group)",
      role: "Product Engineer",
      period: "Mar 2019 — May 2020",
      description: "Designed steering columns for RAM trucks and cross-car beams for JEEP Wrangler. Optimized upper I-shaft designs using DFSS (Red X, Green Y) to resolve warranty issues and manufacturing constraints.",
      technologies: ["NX11", "Catia V5", "Teamcenter", "DFSS", "Root Cause Analysis"]
    },
    {
      id: "exp-4",
      company: "Ford Motor Company (OPTIMAL CAE)",
      role: "Product Engineer",
      period: "Aug 2015 — Mar 2019",
      description: "Designed B-pillar sheet metal brackets and floor panel reinforcements for Ford F150 (Electric) and Mondeo EU. Performed motion mapping for steering columns using KBE tools.",
      technologies: ["Catia V5", "Teamcenter", "Vismockup", "KBE", "Sheet Metal"]
    },
    {
      id: "exp-6",
      company: "University of Michigan-Dearborn",
      role: "Graduate Research Assistant",
      period: "Jun 2014 — Jun 2015",
      description: "Conducted fatigue analysis of spot welds of automotive BIW using Hypermesh and Abaqus under tensile stress. Designed a rubber shredding machine for extracting rubber from used tires of automobiles using Catia V5.",
      technologies: ["Catia V5", "Hypermesh", "Abaqus", "Fatigue Analysis", "Research"]
    },
    {
      id: "exp-5",
      company: "Hyundai Motor India Engineering",
      role: "Research Engineer",
      period: "Sep 2010 — Dec 2013",
      description: "Designed BIW structure parts (underbody, rear floor, dash panel) for i10/i20 projects. Performed digital pre-assembly checks and reverse engineering from 3D scan data.",
      technologies: ["Catia V5", "Reverse Engineering", "Cost Reduction", "PLM"]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "Georgia Institute of Technology",
      degree: "MS in Computer Science (OMSCS)",
      period: "2024 — Present"
    },
    {
      id: "edu-2",
      institution: "University of Michigan-Dearborn",
      degree: "MS in Automotive Systems Engineering",
      period: "2014 — 2015"
    },
    {
      id: "edu-3",
      institution: "Jawaharlal Nehru Technological University",
      degree: "B.Tech in Mechanical Engineering",
      period: "2006 — 2010"
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Material Comparison Automation Tool",
      description: "Created Python-based tools to compare mechanical properties and chemistry of different flat steel grades, aiding in the execution of flex sourcing strategies for cost optimization at Nissan.",
      technologies: ["Python", "Data Analysis", "Automation"],
      link: "https://github.com/vinayanand3",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: "proj-2",
      title: "Rivian RPV/R1T Bumper & Fasteners",
      description: "Designed radar brackets, attachment features on bumper beams, and developed fastening strategies (spot welds, rivets) for Rivian's electric delivery vans and trucks.",
      technologies: ["Catia V6", "Manufacturing", "EV Design"],
      link: "https://github.com/vinayanand3",
      image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: "proj-3",
      title: "Jeep Wrangler EA Brackets",
      description: "Designed and developed Energy Absorbing (EA) brackets for cross-car beams, working with safety teams to meet FMVSS requirements during frontal crash tests.",
      technologies: ["Safety Engineering", "Crash Analysis", "Product Design"],
      link: "https://github.com/vinayanand3",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop"
    },
     {
      id: "proj-4",
      title: "Ford F150 Electric Components",
      description: "Designed OBD mounting brackets and floor panel reinforcements to accommodate high-voltage batteries for the electric version of the Ford F150.",
      technologies: ["EV Packaging", "Sheet Metal", "Catia V5"],
      link: "https://github.com/vinayanand3",
      image: "https://images.unsplash.com/photo-1552060196-6eae4f886c99?q=80&w=2070&auto=format&fit=crop"
    }
  ],
  skills: [
    {
      category: "CAD & PLM",
      items: ["Catia V6 (3DX)", "Catia V5", "NX 11", "Teamcenter", "Enovia", "Vismockup", "GD&T"]
    },
    {
      category: "Software & AI",
      items: ["Python", "Generative AI", "Data Analysis", "Automation Scripting"]
    },
    {
      category: "Engineering",
      items: ["BIW Design", "Sheet Metal", "DFM/DFA", "DFSS", "Root Cause Analysis", "Cost Reduction"]
    }
  ]
};