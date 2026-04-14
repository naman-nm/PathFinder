interface ResourceDetailProps {
    resource: any;
    onBack: () => void;
  }
  
  export default function ResourceDetail({
    resource,
    onBack,
  }: ResourceDetailProps) {
  
    return (
      <section
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          padding: "20px",
        }}
      >
  
        <button
          onClick={onBack}
          style={{
            marginBottom: "20px",
            background: "none",
            border: "none",
            color: "#1FC8C8",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          ← Back to resources
        </button>
  
        <h1
          style={{
            fontSize: "32px",
            color: "#1A1A2E",
            marginBottom: "10px"
          }}
        >
          {resource.title}
        </h1>
  
        <p
          style={{
            color: "#4A4A6A",
            marginBottom: "20px"
          }}
        >
          {resource.read_time}
        </p>
  
        <div
          style={{
            background: "#F5F7FA",
            padding: "20px",
            borderRadius: "14px",
            border: "1px solid #C2CCDE"
          }}
        >
          {resource.description}
        </div>
  
      </section>
    );
  }