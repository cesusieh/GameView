import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NavBar() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verifica autenticação ao montar a NavBar
        axios.get("http://localhost:5044/api/auth/check", { withCredentials: true })
            .then(() => setIsAuthenticated(true))
            .catch(() => setIsAuthenticated(false));
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:5044/api/login/logout", {}, { withCredentials: true });
            setIsAuthenticated(false);
            navigate("/");
        } catch (error) {
            alert("Erro ao fazer logout!");
        }
    };

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "24px 60px",
                backgroundColor: "#2563eb",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                color: "white"
            }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}> Gameview </div>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                {isAuthenticated ? (
                    <>
                        <button
                            style={{
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
                                transition: "background-color 0.3s ease"
                            }}
                            onClick={() => navigate("/home")}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = "#1e40af"}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}>
                            Minhas reviews
                        </button>

                        <button
                            onClick={handleLogout}
                            style={{
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                width: "100px",
                                height: "40px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "16px",
                                marginLeft: "10px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                transition: "background-color 0.3s ease"
                            }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = "#b91c1c"}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = "#ef4444"}
                        >
                            Logout
                        </button>
                        <img
                            src="/images/user.jpeg"
                            alt="Foto do usuário"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: "2px solid white"
                            }}
                        />
                    </>
                ) : (
                    <>
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
                                marginRight: "8px"
                            }}
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
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
                                cursor: "pointer"
                            }}
                            onClick={() => navigate("/register")}
                        >
                            Registrar
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}