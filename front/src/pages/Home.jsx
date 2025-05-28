import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../common/NavBar";
import "../styles/home.css";
import { searchGames } from "../services/rawg";
import axios from "axios";

export default function Home() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o token está presente no localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", {
        state: { message: "Você precisa estar autenticado para acessar esta página." },
      });
      return;
    }
    // Verifica se o usuário está autenticado
    axios
      .get("http://localhost:5044/api/auth/check", { withCredentials: true })
      .then(() => setLoading(false)) // Usuário autenticado
      .catch(() => {
        // Redireciona para /login com mensagem
        navigate("/login", {
          state: { message: "Você precisa estar autenticado para acessar esta página." },
        });
      });
  }, [navigate]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.length > 2) {
        searchGames(search).then(setResults);
      } else {
        setResults([]);
      }
    }, 150);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  if (loading) return null; // Exibe nada ou um spinner enquanto verifica autenticação

  return (
    <>
      <NavBar />
      <main className="home-main">
        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar jogos ou reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {results.length > 0 && (
              <div className="search-results">
                {results.map((item, index) => (
                  <Link
                    key={index}
                    to={`/gamepage/${item.id}`}
                    className="search-result-item"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </form>
      </main>
    </>
  );
}