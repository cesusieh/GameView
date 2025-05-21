export default function NavBar() {
    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 20px",
                backgroundColor: "#2563eb",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                color: "white"
            }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}> Gameview </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                    onMouseOver={e => e.currentTarget.style.backgroundColor = "#1e40af"}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}>
                    Minhas reviews
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
            </div>
        </nav>
    )
}
