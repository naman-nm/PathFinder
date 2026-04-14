import ResourceEditModal from "./ResourceEditModal";
import { useState } from "react";

export default function ResourceRow({ resource, onDelete, onUpdated }: any) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <tr style={{ borderTop: "1px solid #C2CCDE" }}>
        <td style={td}>
          <div style={{ fontWeight: 600, color: "#1A1A2E" }}>{resource.title}</div>
          <div style={{ fontSize: "12px", color: "#4A4A6A", marginTop: 2 }}>{resource.slug}</div>
        </td>
        <td style={td}>
          <span style={badge("#D6DEF0", "#1A1A2E")}>{resource.category}</span>
        </td>
        <td style={td}>
          <span style={badge("#C8F135", "#1A1A2E")}>{resource.resource_type}</span>
        </td>
        <td style={td}>
          <span style={{ fontSize: "12px", color: resource.is_published ? "#17C4A4" : "#4A4A6A", fontWeight: 600 }}>
            {resource.is_published ? "Published" : "Draft"}
          </span>
        </td>
        <td style={td}>
          <button onClick={() => setShowEdit(true)} style={editBtn}>Edit</button>
          <button onClick={() => onDelete(resource.id)} style={deleteBtn}>Delete</button>
        </td>
      </tr>

      {showEdit && (
        <ResourceEditModal
          resource={resource}
          onClose={() => setShowEdit(false)}
          onUpdated={() => { setShowEdit(false); onUpdated(); }}
        />
      )}
    </>
  );
}

const td = { padding: "12px 8px", color: "#2C2C3E" };

const badge = (bg: string, color: string) => ({
  background: bg,
  color,
  padding: "3px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 600,
});

const editBtn = {
  background: "#1FC8C8", border: "none", padding: "6px 12px",
  borderRadius: "6px", marginRight: "8px", cursor: "pointer", color: "white", fontWeight: 600,
};

const deleteBtn = {
  background: "#ff4d4d", border: "none", padding: "6px 12px",
  borderRadius: "6px", cursor: "pointer", color: "white", fontWeight: 600,
};