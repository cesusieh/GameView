import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../common/NavBar";
import "../styles/home.css";
import { searchGames } from "../services/rawg";
import { checkAuth } from "../services/auth";

export default function Home() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const authenticated = await checkAuth();
      if (!authenticated) {
        navigate("/login", {
          state: {
            message: "Você precisa estar autenticado para acessar esta página.",
          },
        });
        return;
      }
      setAuthChecked(true);
      setLoading(false);
    };
    verify();
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

  if (!authChecked) {
    return (
      <>
        <NavBar />
        <div className="body">
          <p>Verificando autenticação...</p>
        </div>
      </>
    );
  }

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
