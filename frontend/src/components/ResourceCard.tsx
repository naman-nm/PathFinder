import { useState, type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ResourceType     = "pdf" | "video" | "template" | "article";
export type ResourceCategory =
  | "framework"
  | "playbook"
  | "market_map"
  | "case_study"
  | "tool"
  | "blog";

export interface ResourceCardProps {
  id: number;
  title: string;
  description: string;
  category: ResourceCategory;
  resourceType: ResourceType;
  slug?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  tags?: string[];
  readTime?: string; // e.g. "5 min read"
  actionLabel?: string;
  onAction?: () => void;
}

// ─── Config maps ──────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  framework:  "Framework",
  playbook:   "Playbook",
  market_map: "Market Map",
  case_study: "Case Study",
  tool:       "Tool",
  blog:       "Orbit Blog",
};

const TYPE_CONFIG: Record<
  ResourceType,
  { label: string; bg: string; color: string; icon: ReactNode }
> = {
  pdf: {
    label: "PDF",
    bg:    "#C8F135",
    color: "#1A1A2E",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  video: {
    label: "Video",
    bg:    "#1FC8C8",
    color: "#1A1A2E",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  template: {
    label: "Template",
    bg:    "#C2CCDE",
    color: "#2C2C3E",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  article: {
    label: "Article",
    bg:    "#1A1A2E",
    color: "#C8F135",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16M4 12h16M4 18h12" />
      </svg>
    ),
  },
};

const CATEGORY_ICONS: Record<ResourceCategory, ReactNode> = {
  framework: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  playbook: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h18v18H3z" /><path d="M3 9h18M3 15h18M9 3v18" />
    </svg>
  ),
  market_map: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  ),
  case_study: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  tool: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  blog: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 010 8h-1" />
      <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  ),
};

// ─── Thumbnail placeholder (when no image provided) ───────────────────────────
function ThumbnailPlaceholder({ category }: { category: ResourceCategory }) {
  const colors: Record<ResourceCategory, { bg: string; fg: string }> = {
    framework:  { bg: "#C8F135", fg: "#1A1A2E" },
    playbook:   { bg: "#1A1A2E", fg: "#C8F135" },
    market_map: { bg: "#1FC8C8", fg: "#1A1A2E" },
    case_study: { bg: "#17C4A4", fg: "#1A1A2E" },
    tool:       { bg: "#C2CCDE", fg: "#2C2C3E" },
    blog:       { bg: "#2C2C3E", fg: "#C8F135" },
  };
  const { bg, fg } = colors[category];

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ background: bg }}
    >
      {/* Large faded category icon as illustration */}
      <div style={{ color: fg, opacity: 0.5, transform: "scale(3.5)" }}>
        {CATEGORY_ICONS[category]}
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ResourceCard({
  title,
  description,
  category,
  resourceType,
  slug,
  thumbnail,
  isFeatured = false,
  tags = [],
  readTime,
  actionLabel = "View Details",
  onAction,
}: ResourceCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered,    setIsHovered]    = useState(false);

  const typeConfig = TYPE_CONFIG[resourceType];

  const handleAccess = () => {
    if (onAction) {
      onAction();
      return;
    }
  };

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300"
      style={{
        background:   "#F5F7FA",
        border:       `1.5px solid ${isHovered ? "#C8F135" : "#C2CCDE"}`,
        boxShadow:    isHovered
          ? "0 12px 32px rgba(26,26,46,0.14), -4px 0 0 #C8F135"
          : "0 2px 8px rgba(26,26,46,0.06)",
        transform:    isHovered ? "translateY(-5px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`${title} — ${typeConfig.label}${slug ? ` — ${slug}` : ""}`}
    >

      {/* ── Thumbnail area ──────────────────────────────────────────────────── */}
      <div className="relative h-40 w-full overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ThumbnailPlaceholder category={category} />
        )}

        {/* Featured ribbon */}
        {isFeatured && (
          <div
            className="absolute left-0 top-4 flex items-center gap-1.5 rounded-r-full px-3 py-1 text-xs font-bold"
            style={{ background: "#C8F135", color: "#1A1A2E" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Featured
          </div>
        )}

        {/* Type badge — top right */}
        <div
          className="absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
          style={{ background: typeConfig.bg, color: typeConfig.color }}
        >
          {typeConfig.icon}
          {typeConfig.label}
        </div>

        {/* Bookmark button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsBookmarked((b) => !b);
          }}
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
          style={{
            background: isBookmarked ? "#1A1A2E" : "rgba(245,247,250,0.9)",
            backdropFilter: "blur(4px)",
            border: `1.5px solid ${isBookmarked ? "#1A1A2E" : "#C2CCDE"}`,
          }}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark resource"}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill={isBookmarked ? "#C8F135" : "none"}
            stroke={isBookmarked ? "#C8F135" : "#4A4A6A"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </button>
      </div>

      {/* ── Card body ───────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3 p-5">

        {/* Category label row */}
        <div className="flex items-center gap-2">
          <span style={{ color: "#1FC8C8" }}>
            {CATEGORY_ICONS[category]}
          </span>
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "#1FC8C8" }}
          >
            {CATEGORY_LABELS[category]}
          </span>

          {/* Read time */}
          {readTime && (
            <>
              <span style={{ color: "#C2CCDE" }}>·</span>
              <span className="text-xs" style={{ color: "#4A4A6A" }}>
                {readTime}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-base font-bold leading-snug transition-colors duration-200"
          style={{ color: isHovered ? "#1A1A2E" : "#2C2C3E" }}
        >
          {title}
        </h3>

        {/* Description — 2-line clamp */}
        <p
          className="text-sm leading-relaxed"
          style={{
            color: "#4A4A6A",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ background: "#EEF1F7", color: "#4A4A6A" }}
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ background: "#EEF1F7", color: "#4A4A6A" }}
              >
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* ── Footer: divider + CTA ──────────────────────────────────────── */}
        <div className="mt-auto pt-3">
          <div
            className="mb-3 h-px w-full"
            style={{ background: "#E4E8F0" }}
          />

          <div className="flex items-center justify-between">
            {/* Left: resource type pill */}
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: "#1A1A2E", color: "#C8F135" }}
            >
              {typeConfig.icon}
              Free Resource
            </div>

            {/* Right: Access CTA */}
            <button
                onClick={handleAccess}
                style={{
                  background: "#B6E82A",
                  color: "#1A1A2E",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all .2s ease"
                }}
              >
                {actionLabel}
              </button>
          </div>
        </div>
      </div>

      {/* ── Volt green left border that grows on hover ──────────────────────── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 top-0 w-[3px] rounded-l-2xl transition-all duration-300"
        style={{
          background:  "#C8F135",
          opacity:     isHovered ? 1 : 0,
          transform:   isHovered ? "scaleY(1)" : "scaleY(0)",
          transformOrigin: "bottom",
        }}
      />
    </article>
  );
}
