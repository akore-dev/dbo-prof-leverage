import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_NAME = "Professional Leverage";
const SITE_URL = "https://profleverage.com";

const metadataByPage = {
  home: {
    title: "Professional Leverage Diagnostic™ | Discover the Hidden Patterns Shaping Your Career",
    description: "Discover the hidden strengths, positioning gaps, and leverage opportunities shaping your career. Take the free Professional Leverage Diagnostic™ and uncover your next level.",
    image: "/images/og-home.jpeg",
    robots: "index,follow",
    canonicalPath: "/",
  },
  assessment: {
    title: "Start Your Professional Leverage Diagnostic™",
    description: "Answer a series of carefully designed questions to uncover hidden career patterns, positioning gaps, and leverage opportunities.",
    image: "/images/og-assessment.jpeg",
    robots: "index,follow",
    canonicalPath: "/assessment",
  },
  results: {
    title: "Your Professional Leverage Results",
    description: "Your Professional Leverage Diagnostic™ results are ready. Review your personalized pattern, strengths, and leverage insights.",
    image: "/images/og-results.jpeg",
    robots: "noindex,nofollow",
    canonicalPath: "/result",
  },
  progress: {
    title: "Your Recommendation Progress",
    description: "Track your Professional Leverage Diagnostic recommendations and unlock your complimentary Professional Leverage Debrief™.",
    image: "/images/og-progress.jpeg",
    robots: "noindex,nofollow",
    canonicalPath: "/progress",
  },
  referral: {
    title: "Start Your Professional Leverage Diagnostic™",
    description: "Take the free Professional Leverage Diagnostic™ to uncover hidden career patterns, positioning gaps, and leverage opportunities.",
    image: "/images/og-assessment.jpeg",
    robots: "noindex,follow",
    canonicalPath: "/assessment",
  },
};

const getPageMetadata = (pathname) => {
  if (pathname === "/assessment" || pathname === "/wheel") return metadataByPage.assessment;
  if (pathname === "/result" || pathname === "/results" || pathname === "/email") return metadataByPage.results;
  if (pathname === "/progress") return metadataByPage.progress;
  if (pathname === "/referrer" || pathname.startsWith("/s/")) return metadataByPage.referral;
  return metadataByPage.home;
};

const setMeta = (attribute, key, content) => {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

export default function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const metadata = getPageMetadata(pathname);
    const imageUrl = `${SITE_URL}${metadata.image}`;
    const pageUrl = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

    document.title = metadata.title;
    setMeta("name", "description", metadata.description);
    setMeta("name", "robots", metadata.robots);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:title", metadata.title);
    setMeta("property", "og:description", metadata.description);
    setMeta("property", "og:image", imageUrl);
    setMeta("property", "og:url", pageUrl);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", metadata.title);
    setMeta("name", "twitter:description", metadata.description);
    setMeta("name", "twitter:image", imageUrl);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${SITE_URL}${metadata.canonicalPath === "/" ? "" : metadata.canonicalPath}`);
  }, [pathname]);

  return null;
}