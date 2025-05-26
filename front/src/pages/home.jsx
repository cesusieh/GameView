import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../common/navBar";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5044/api/auth/check", { withCredentials: true })
      .then(() => setLoading(false))
      .catch(() => {
        navigate("/login", { state: { message: "Você deve estar autenticado" } });
      });
  }, [navigate]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.length > 2) {
        axios.get(`http://localhost:5044/api/Games/search?q=${search}`)
          .then(res => {
            // extrair só o array results
            const games = res.data.results || [];
            setResults(games);
          })
          .catch(() => setResults([]));
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Pesquisar por: ${search}`);
  };

  if (loading) return null;

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

        {/* Resultados da busca abaixo do input */}
        {results.length > 0 && (
          <div className="search-results">
            {results.map((item, index) => (
              <div key={index} className="search-result-item">
                {item.name /* use "name" para o nome do jogo */}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
