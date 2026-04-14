import { useState } from "react";
import AdminHeader from "./AdminHeader";
import ResourceTable from "./ResourceTable";
import ResourceEditModal from "./ResourceEditModal";

export default function AdminPanel() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateResource = () => {
    setShowCreateModal(true);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
  };

  const handleResourceCreated = () => {
    // Refresh the resource table
    setRefreshKey(prev => prev + 1);
    setShowCreateModal(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F7FA",
        padding: "40px"
      }}
    >
      <AdminHeader onCreateClick={handleCreateResource} />

      <ResourceTable key={refreshKey} />

      {showCreateModal && (
        <ResourceEditModal
          mode="create"
          onClose={handleModalClose}
          onUpdated={handleResourceCreated}
        />
      )}
    </div>
  );
}
