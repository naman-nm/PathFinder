import { logout } from "../../api/resourceAdminApi"; // adjust path if needed
import { useRouter } from "next/navigation";

export default function AdminHeader() {

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();   // call API function
      localStorage.removeItem("access_token"); // remove token from storage
      router.push("/admin/login"); // redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
      }}
    >

      <h1
        style={{
          color: "#1A1A2E",
          fontSize: "28px",
          fontWeight: 700
        }}
      >
        Admin Panel
      </h1>

      <div style={{ display: "flex", gap: "10px" }}>

        <button
          style={{
            background: "#B6E82A",
            border: "none",
            padding: "12px 20px",
            borderRadius: "10px",
            fontWeight: 600,
            cursor: "pointer",
            color: "#1A1A2E"
          }}
        >
          + Add Resource
        </button>

        <button
          onClick={handleLogout}
          style={{
            background: "#FF4D4F",
            border: "none",
            padding: "12px 20px",
            borderRadius: "10px",
            fontWeight: 600,
            cursor: "pointer",
            color: "#fff"
          }}
        >
          Logout
        </button>

      </div>

    </div>

  );

}