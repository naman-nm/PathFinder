import { useState, ChangeEvent, FormEvent } from "react";
import { updateResource, createResource } from "../../api/resourceAdminApi";

const CATEGORIES = ["framework", "playbook", "market_map", "case_study", "tool", "blog"];
const TYPES = ["pdf", "video", "template", "article"];

interface Resource {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  resource_type: string;
  read_time: string;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
}

interface FormData {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  resource_type: string;
  read_time: string;
  tags: string;
  is_featured: boolean;
  is_published: boolean;
}

interface ResourceEditModalProps {
  resource?: Resource;
  mode?: "create" | "edit";
  onClose: () => void;
  onUpdated: () => void;
}

export default function ResourceEditModal({ resource, mode = "edit", onClose, onUpdated }: ResourceEditModalProps) {
  const [form, setForm] = useState<FormData>({
    title: resource?.title || "",
    slug: resource?.slug || "",
    summary: resource?.summary || "",
    description: resource?.description || "",
    category: resource?.category || "",
    resource_type: resource?.resource_type || "",
    read_time: resource?.read_time || "",
    tags: (resource?.tags || []).join(", "),
    is_featured: resource?.is_featured || false,
    is_published: resource?.is_published || (mode === "create" ? true : false),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      };
      
      if (mode === "create") {
        await createResource(payload);
        // Refresh page after creating resource
        setTimeout(() => window.location.reload(), 500);
      } else {
        if (resource?.id) {
          await updateResource(resource.id, payload);
          onUpdated();
        }
      }
    } catch {
      setError(`Failed to ${mode === "create" ? "create" : "update"} resource. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = mode === "create" ? "Create Resource" : "Edit Resource";
  const submitButtonText = mode === "create" ? "Create Resource" : "Save Changes";

  return (
    <div style={overlay}>
      <div style={modal}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: "#1A1A2E", fontSize: 20 }}>{modalTitle}</h2>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        {error && <div style={errorBox}>{error}</div>}

        <div style={grid}>
          <Field label="Title">
            <input name="title" value={form.title} onChange={handleChange} style={input} placeholder="Resource title" />
          </Field>

          <Field label="Slug">
            <input name="slug" value={form.slug} onChange={handleChange} style={input} placeholder="resource-slug" />
          </Field>

          <Field label="Category">
            <select name="category" value={form.category} onChange={handleChange} style={input}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Resource Type">
            <select name="resource_type" value={form.resource_type} onChange={handleChange} style={input}>
              <option value="">Select type</option>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>

          <Field label="Read Time">
            <input name="read_time" value={form.read_time} onChange={handleChange} style={input} placeholder="e.g. 5 min" />
          </Field>

          <Field label="Tags (comma separated)">
            <input name="tags" value={form.tags} onChange={handleChange} style={input} placeholder="strategy, product" />
          </Field>
        </div>

        <Field label="Summary">
          <textarea name="summary" value={form.summary} onChange={handleChange} style={{ ...input, height: 72, resize: "vertical" }} placeholder="Brief summary of the resource" />
        </Field>

        <Field label="Description">
          <textarea name="description" value={form.description} onChange={handleChange} style={{ ...input, height: 100, resize: "vertical" }} placeholder="Detailed description" />
        </Field>

        {/* Toggles */}
        <div style={{ display: "flex", gap: 24, margin: "16px 0" }}>
          <label style={toggle}>
            <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} />
            <span style={{ color: "#1A1A2E", fontWeight: 600 }}>Featured</span>
          </label>
          <label style={toggle}>
            <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} />
            <span style={{ color: "#1A1A2E", fontWeight: 600 }}>Published</span>
          </label>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
          <button onClick={onClose} style={cancelBtn}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={saveBtn}>
            {loading ? "Saving..." : submitButtonText}
          </button>
        </div>

      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4A4A6A", marginBottom: 5 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(26,26,46,0.55)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
};

const modal: React.CSSProperties = {
  background: "white", borderRadius: 16, padding: 32,
  width: "100%", maxWidth: 680, maxHeight: "90vh",
  overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
};

const grid: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px",
};

const input: React.CSSProperties = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #C2CCDE",
  borderRadius: 8, fontSize: 14, color: "#2C2C3E",
  background: "#F5F7FA", boxSizing: "border-box", outline: "none",
};

const toggle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
};

const closeBtn: React.CSSProperties = {
  background: "none", border: "none", fontSize: 18,
  cursor: "pointer", color: "#4A4A6A",
};

const cancelBtn: React.CSSProperties = {
  padding: "10px 20px", borderRadius: 8, border: "1.5px solid #C2CCDE",
  background: "white", color: "#4A4A6A", cursor: "pointer", fontWeight: 600,
};

const saveBtn: React.CSSProperties = {
  padding: "10px 24px", borderRadius: 8, border: "none",
  background: "#C8F135", color: "#1A1A2E", cursor: "pointer",
  fontWeight: 700, fontSize: 14,
};

const errorBox: React.CSSProperties = {
  background: "#fff0f0", border: "1px solid #ffcccc",
  borderRadius: 8, padding: "10px 14px", color: "#cc0000",
  marginBottom: 16, fontSize: 13,
};
