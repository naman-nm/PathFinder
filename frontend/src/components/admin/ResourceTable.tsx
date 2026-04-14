import { useEffect, useState } from "react";
import { getResources, deleteResource } from "../../api/resourceAdminApi";
import ResourceRow from "./ResourceRow";

export default function ResourceTable() {

  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      const data = await getResources();
      setResources(data);
    };
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const data = await getResources();
    setResources(data);
  };


  const handleDelete = async (id: number) => {

    await deleteResource(id);

    fetchResources();

  };


  return (

    <div
      style={{
        background: "white",
        borderRadius: "14px",
        padding: "20px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
      }}
    >

      <table style={{ width: "100%" }}>

        <thead>

          <tr style={{ textAlign: "left", color: "#4A4A6A" }}>

            <th>Title</th>

            <th>Category</th>

            <th>Type</th>

            <th>Status</th> 

            <th>Actions</th>

          </tr>

        </thead>


        <tbody>

          {resources.map((resource: any) => (

            <ResourceRow
              key={resource.id}
              resource={resource}
              onDelete={handleDelete}
              onUpdated={fetchResources}
            />

          ))}

        </tbody>

      </table>

    </div>

  );

}