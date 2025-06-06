import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout, checkAuth } from "../services/auth";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = carregando

  useEffect(() => {
    async function verifyAuth() {
      const auth = await checkAuth();
      setIsAuthenticated(auth);
    }
    verifyAuth();
  }, []);

  const showHomeButton =
    isAuthenticated &&
    (location.pathname === "/home" ||
      location.pathname === "/my-reviews" ||
      location.pathname.startsWith("/gamepage/"));

  if (isAuthenticated === null) {
    return (
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "12px 30px",
          backgroundColor: "#2563eb",
          color: "white",
        }}
      >
        <span>Verificando autenticação...</span>
      </nav>
    );
  }

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 30px",
        backgroundColor: "#2563eb",
        color: "white",
      }}
    >
      <div style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>
        Gameview
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {isAuthenticated ? (
          <>
            {showHomeButton && (
              <button
                style={buttonStyle}
                onClick={() => navigate("/home")}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1e40af")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1d4ed8")
                }
              >
                Home
              </button>
            )}
            <button
              style={buttonStyle}
              onClick={() => navigate("/my-reviews")}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#1e40af")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#1d4ed8")
              }
            >
              Minhas reviews
            </button>

            <button
              onClick={async () => {
                await logout(navigate);
                setIsAuthenticated(false);
              }}
              style={{
                ...buttonStyle,
                backgroundColor: "#ef4444",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#b91c1c")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#ef4444")
              }
            >
              Logout
            </button>

            <img
              src="/images/user.jpeg"
              alt="Foto do usuário"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid white",
              }}
            />
          </>
        ) : (
          <button
            className="nav-btn"
            style={{
              backgroundColor: "#4e90ff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "15px",
              fontWeight: "bold",
              padding: "8px 22px",
              cursor: "pointer",
              marginRight: "8px",
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

const buttonStyle = {
  backgroundColor: "#1d4ed8",
  color: "white",
  border: "none",
  borderRadius: "8px",
  width: "150px",
  height: "45px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s ease",
};
