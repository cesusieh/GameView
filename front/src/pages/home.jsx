import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../common/navBar";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5044/api/auth/check", { withCredentials: true })
      .then(() => setLoading(false))
      .catch(() => {
        navigate("/login", { state: { message: "Você deve estar autenticado" } });
      });
  }, [navigate]);

  if (loading) return null; // ou um spinner

  const handleSearch = (e) => {
    e.preventDefault();
    // Aqui você pode implementar a lógica de pesquisa
    alert(`Pesquisar por: ${search}`);
  };

  return (
    <>
      <NavBar />
      <main className="home-main">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar jogos ou reviews..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="search-button">
            Pesquisar
          </button>
        </form>
      </main>
    </>
  );
}