import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../common/NavBar";
import { checkAuth } from "../services/auth";
import { getMyReviews } from "../services/reviews";
import { fetchGameById } from "../services/rawg";
import "../styles/myReviews.css";

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [gameNames, setGameNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyAndLoad() {
      const authenticated = await checkAuth();

      if (!authenticated) {
        navigate("/login", {
          state: { message: "Você precisa estar autenticado para acessar esta página." },
        });
        return;
      }

      const data = await getMyReviews();

      if (!data || data.length === 0) {
        setError("Nenhuma review encontrada ou erro ao carregar.");
        setLoading(false);
        return;
      }

      setReviews(data);

      const uniqueGameIds = [...new Set(data.map((r) => r.gameId))];

      const namesMap = {};
      await Promise.all(
        uniqueGameIds.map(async (gameId) => {
          try {
            const gameData = await fetchGameById(gameId);
            namesMap[gameId] = gameData.name || "Nome desconhecido";
          } catch {
            namesMap[gameId] = "Erro ao carregar nome";
          }
        })
      );

      setGameNames(namesMap);
      setLoading(false);
    }

    verifyAndLoad();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="my-reviews-container">
          <h1 className="my-reviews-header">Últimas reviews</h1>
          <p>Carregando suas reviews...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="my-reviews-container">
          <h1 className="my-reviews-header">Últimas reviews</h1>
          <p style={{ color: "red" }}>{error}</p>
        </div>
      </>
    );
  }

  return (
  <div className="my-reviews-page">
    <NavBar />
    <div className="body-my-reviews">
      <div className="container-my-reviews">
        <h1 className="my-reviews-header">Minhas Reviews</h1>
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="empty-message">{error}</p>
        ) : reviews.length === 0 ? (
          <p className="empty-message">Você ainda não cadastrou nenhuma review.</p>
        ) : (
          <div className="reviews-wrapper">
            {reviews.map(({ id, content, gameId }) => (
              <div key={id} className="review-card">
                <p>
                  <strong>Jogo:</strong>{" "}
                  {gameNames[gameId] ? (
                    <Link to={`/gamepage/${gameId}`}>{gameNames[gameId]}</Link>
                  ) : (
                    "Carregando..."
                  )}
                </p>
                <p><strong>Conteúdo:</strong> {content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    <footer className="my-review-footer">
      <span>GameView &copy; {new Date().getFullYear()} &mdash; Desenvolvido por turma do pagode</span>
    </footer>
  </div>
);
}
