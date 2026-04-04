import logoImage from "../../Orbit_logo.jpeg";
import heroImage from "../../orbit_header2.jpg";
import editorialImage from "../../orbit_header.jpg";

export type ProjectCard = {
  title: string;
  category: string;
  summary: string;
  href: string;
  linkLabel: string;
  status: string;
  image: string;
  accent: string;
  tags: string[];
  external?: boolean;
};

export type PricingItem = {
  name: string;
  price: string;
  details: string[];
  note?: string;
};

export type PricingGroup = {
  title: string;
  items: PricingItem[];
};

export const studioSummary = {
  name: "Orbit Studios",
  tagline: "Professional portfolio websites for artists, creative businesses, and independent brands.",
  mission:
    "Orbit Studios designs and builds clear, professional websites that help creative businesses present their work properly and make it easier for serious clients to get in touch.",
  email: "Orbitstudios26.ng@gmail.com",
  location: "Lagos, Nigeria",
  logoImage,
};

export const services = [
  {
    title: "Portfolio Website Design",
    description:
      "Structured website design focused on clear presentation, strong first impressions, and a professional client experience.",
  },
  {
    title: "Custom Frontend Development",
    description:
      "Responsive React websites built for speed, usability, and clean content management as the business grows.",
  },
  {
    title: "Commission Intake Setup",
    description:
      "Inquiry forms that collect project scope, budget, and timing in a straightforward and organized way.",
  },
  {
    title: "Launch Support",
    description:
      "Deployment support, production setup, and practical guidance for running the site after handoff.",
  },
];

export const pricingGroups: PricingGroup[] = [
  {
    title: "Website Services",
    items: [
      {
        name: "Basic Pages (UI Only)",
        price: "NGN 4,000 per page",
        details: [
          "Home, About, Contact, and similar pages",
          "Clean responsive design",
          "No advanced interactivity",
        ],
      },
      {
        name: "Standard Pages (Interactive UI)",
        price: "NGN 8,000 per page",
        details: [
          "Hover effects",
          "Simple animations",
          "Image switching or basic JavaScript",
          "No backend functionality",
        ],
      },
      {
        name: "Starter Website",
        price: "NGN 12,000",
        details: [
          "2 to 3 pages",
          "Clean design",
          "Mobile-friendly layout",
          "Linked pages",
        ],
        note: "Best for personal use or small ideas.",
      },
      {
        name: "Business Starter",
        price: "NGN 20,000",
        details: [
          "4 to 5 pages",
          "Stronger layout and styling",
          "Basic interactivity",
        ],
        note: "Best for small businesses.",
      },
      {
        name: "Custom Website",
        price: "NGN 25,000 to NGN 40,000",
        details: [
          "Pricing depends on the feature set",
          "Interactive sections",
          "Custom layouts for project-specific work",
        ],
        note: "Suitable for more tailored client projects.",
      },
    ],
  },
  {
    title: "Advanced Features",
    items: [
      {
        name: "Interactivity Add-ons",
        price: "NGN 3,000 to NGN 10,000",
        details: [
          "Image switching",
          "Filters",
          "Dynamic user interface elements",
        ],
      },
      {
        name: "Forms (UI Only)",
        price: "NGN 2,000 to NGN 5,000",
        details: [
          "Contact forms without backend integration",
        ],
      },
      {
        name: "Backend Features",
        price: "NGN 15,000+",
        details: [
          "Login systems",
          "Databases",
        ],
        note: "Offered only when the project scope and readiness are right.",
      },
    ],
  },
  {
    title: "Hosting and Deployment",
    items: [
      {
        name: "GitHub Pages Hosting",
        price: "Free",
        details: [
          "Included when suitable for the project",
        ],
      },
      {
        name: "Custom Domain Setup",
        price: "NGN 5,000 to NGN 10,000",
        details: [
          "Client pays for the domain separately",
        ],
      },
      {
        name: "Website Setup and Deployment",
        price: "NGN 3,000",
        details: [
          "Upload",
          "Testing",
          "Live link delivery",
        ],
      },
    ],
  },
  {
    title: "Maintenance",
    items: [
      {
        name: "Basic Maintenance",
        price: "NGN 3,000 to NGN 5,000 / month",
        details: [
          "Minor updates",
          "Fixes",
        ],
      },
    ],
  },
  {
    title: "Design Services",
    items: [
      {
        name: "UI / Visual Design",
        price: "NGN 5,000 to NGN 15,000",
        details: [
          "Layout design",
          "Images and visual assets",
          "Branding elements",
        ],
        note: "Can be bundled into website pricing where needed.",
      },
    ],
  },
];

export const processSteps = [
  "Review the business, audience, and type of clients the website needs to attract.",
  "Plan the structure, messaging, and visual direction around the actual work.",
  "Build the site with a clear portfolio flow, responsive layouts, and a practical inquiry path.",
  "Launch with a working submission system and room to expand as more client work is published.",
];

export const featuredProjects: ProjectCard[] = [
  {
    title: "Avatar Couture",
    category: "Fashion Portfolio",
    summary:
      "A public client-facing portfolio focused on visual presentation, brand positioning, and a clearer path for inquiries.",
    href: "https://orbitstudios26ng-spec.github.io/AvatarCouture/index.html",
    linkLabel: "Open live project",
    status: "Live",
    image: editorialImage,
    accent: "from-amber-400/40 via-yellow-500/20 to-transparent",
    tags: ["Fashion", "Portfolio", "Public project"],
    external: true,
  },
  {
    title: "Orbit Studios",
    category: "Studio Website",
    summary:
      "The current studio website used to present services, explain the process clearly, and receive commission requests directly.",
    href: "/",
    linkLabel: "View current site",
    status: "Live",
    image: heroImage,
    accent: "from-yellow-400/35 via-amber-500/15 to-transparent",
    tags: ["Studio", "Commission flow", "Production build"],
  },
];
