const fs = require("fs");
const path = require("path");

const buildDirectory = path.resolve(__dirname, "..", "build");
const indexPath = path.join(buildDirectory, "index.html");
const siteUrl = "https://profleverage.com";

const pages = [
  {
    outputs: ["index.html"],
    title: "Professional Leverage Diagnostic™ | Discover the Hidden Patterns Shaping Your Career",
    description: "Discover the hidden strengths, positioning gaps, and leverage opportunities shaping your career. Take the free Professional Leverage Diagnostic™ and uncover your next level.",
    image: "/images/og-home.jpeg",
    url: "",
    robots: "index,follow",
  },
  {
    outputs: ["assessment/index.html", "wheel/index.html"],
    title: "Start Your Professional Leverage Diagnostic™",
    description: "Answer a series of carefully designed questions to uncover hidden career patterns, positioning gaps, and leverage opportunities.",
    image: "/images/og-assessment.jpeg",
    url: "/assessment",
    robots: "index,follow",
  },
  {
    outputs: ["result/index.html", "results/index.html", "email/index.html"],
    title: "Your Professional Leverage Results",
    description: "Your Professional Leverage Diagnostic™ results are ready. Review your personalized pattern, strengths, and leverage insights.",
    image: "/images/og-results.jpeg",
    url: "/result",
    robots: "noindex,nofollow",
  },
  {
    outputs: ["progress/index.html"],
    title: "Your Recommendation Progress",
    description: "Track your Professional Leverage Diagnostic recommendations and unlock your complimentary Professional Leverage Debrief™.",
    image: "/images/og-progress.jpeg",
    url: "/progress",
    robots: "noindex,nofollow",
  },
  {
    outputs: ["s/index.html", "referrer/index.html"],
    title: "Start Your Professional Leverage Diagnostic™",
    description: "Take the free Professional Leverage Diagnostic™ to uncover hidden career patterns, positioning gaps, and leverage opportunities.",
    image: "/images/og-assessment.jpeg",
    url: "/assessment",
    robots: "noindex,follow",
  },
];

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const createMetadataBlock = ({ title, description, image, url, robots }) => {
  const absoluteImage = `${siteUrl}${image}`;
  const absoluteUrl = `${siteUrl}${url}`;

  return `<meta name="route-meta-start" content="1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${absoluteUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Professional Leverage" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${absoluteImage}" />
    <meta property="og:url" content="${absoluteUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${absoluteImage}" />
    <meta name="route-meta-end" content="1" />`;
};

if (!fs.existsSync(indexPath)) {
  throw new Error("Build index not found. Run the React build before generating route metadata.");
}

const baseHtml = fs.readFileSync(indexPath, "utf8");
const metadataPattern = /<meta name="route-meta-start"[^>]*>[\s\S]*?<meta name="route-meta-end"[^>]*>/;

if (!metadataPattern.test(baseHtml)) {
  throw new Error("Metadata markers are missing from public/index.html.");
}

pages.forEach((page) => {
  const pageHtml = baseHtml.replace(metadataPattern, createMetadataBlock(page));

  page.outputs.forEach((relativeOutput) => {
    const outputPath = path.join(buildDirectory, relativeOutput);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, pageHtml);
  });
});

console.log("Generated route-specific metadata pages.");