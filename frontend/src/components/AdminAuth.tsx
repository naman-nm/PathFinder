import { useState } from "react";
import { adminLogin, adminSignup } from "../api/adminAuthApi";

export default function AdminAuth() {

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {

      if (mode === "login") {
        const res = await adminLogin(email, password);
        localStorage.setItem(
          "admin_token",
          res.access_token
        );
        window.location.href = "/admin";
      }

      else {

        const res = await adminSignup(
          email,
          password,
          confirmPassword
        );

        setSuccess("Account created successfully");

        console.log("admin signup", res);

      }

    }

    catch (err: any) {
      setError(err.message);

    }

    finally {

      setLoading(false);

    }

  };



  return (

    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#D6DEF0,#F5F7FA)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >

      <div
        style={{
          width: "420px",
          background: "#F5F7FA",
          padding: "40px",
          borderRadius: "18px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
        }}
      >

        <h2
          style={{
            textAlign: "center",
            color: "#1A1A2E",
            marginBottom: "20px",
          }}
        >
          Admin Access
        </h2>



        {/* toggle */}

        <div
          style={{
            display: "flex",
            marginBottom: "20px",
            background: "#C2CCDE",
            borderRadius: "10px",
          }}
        >

          <button
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              padding: "10px",
              background: mode === "login" ? "#C8F135" : "transparent",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Login
          </button>


          <button
            onClick={() => setMode("signup")}
            style={{
              flex: 1,
              padding: "10px",
              background: mode === "signup" ? "#C8F135" : "transparent",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Signup
          </button>
        </div>



        <form onSubmit={handleSubmit}>

          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />


          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />


          {mode === "signup" && (

            <input
              placeholder="Re-enter password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />

          )}



          {error && (

            <p style={{ color: "red", fontSize: "14px" }}>
              {error}
            </p>

          )}



          {success && (

            <p style={{ color: "#17C4A4", fontSize: "14px" }}>
              {success}
            </p>

          )}



          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "15px",
              background: "#B6E82A",
              border: "none",
              padding: "12px",
              borderRadius: "10px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >

            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create Account"}

          </button>
        </form>
      </div>
    </div>
  );
}



const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #C2CCDE",
  marginBottom: "12px",
};
