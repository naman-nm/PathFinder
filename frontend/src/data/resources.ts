export type ResourceType = "pdf" | "video" | "template" | "article";
export type ResourceCategory =
  | "framework"
  | "playbook"
  | "market_map"
  | "case_study"
  | "tool"
  | "blog";

export type ContentTemplate = "concept" | "research" | "download";

export interface ResourceSection {
  title: string;
  paragraphs: string[];
}

export interface ResourceListItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: ResourceCategory;
  resourceType: ResourceType;
  readTime: string;
  tags: string[];
  contentTemplate: ContentTemplate;
  isFeatured: boolean;
  thumbnailUrl: string | null;
  detailUrl: string | null;
  downloadUrl: string | null;
}

export interface RelatedResource {
  title: string;
  slug: string;
  summary: string;
  category: ResourceCategory;
  resourceType: ResourceType;
  detailUrl: string | null;
}

export interface ResourceDetailItem extends ResourceListItem {
  overview: string[];
  sections: ResourceSection[];
  keyPoints: string[];
  relatedResources: RelatedResource[];
  publishedAt: string;
}

export interface ResourceMeta {
  total: number;
  featured: number;
  counts: Partial<Record<ResourceCategory, number>>;
  templates: Partial<Record<ContentTemplate, number>>;
}

// ─── Constants ─────────────────────────────────────────────────────────────

export const PATHFINDER_PILLARS = [
  {
    title: "Align",
    description:
      "Clarify the opportunity, sharpen the value proposition, and understand where real traction can come from.",
  },
  {
    title: "Act",
    description:
      "Translate strategy into focused founder moves through practical frameworks, playbooks, and reusable tools.",
  },
  {
    title: "Advance",
    description:
      "Build momentum with a stronger market view, better sequencing, and a more coherent path from 0 to 1.",
  },
];