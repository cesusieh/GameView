import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGameById } from "../services/rawg";
import { deleteReview, getGameReviews, postReview } from "../services/reviews";
import "../styles/game-page.css";
import NavBar from "../common/NavBar";
import { checkAuth } from "../services/auth";

export default function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState("");
  const [resultMsg, setResultMsg] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    const verifyAndLoad = async () => {
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

      setLoading(true);
      setError(null);

      try {
        const data = await fetchGameById(id);
        setGame(data);

        const userReviewsData = await getGameReviews(id);
        setUserReviews(userReviewsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyAndLoad();
  }, [id, navigate]);

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

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="body">
          <p>Carregando dados do jogo...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="body">
          <p>{error}</p>
        </div>
      </>
    );
  }

  if (!game) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!review.trim()) {
      setResultMsg({ error: true, text: "Por favor, escreva sua review." });
      return;
    }

    try {
      await postReview(id, review);

      setResultMsg({
        error: false,
        text: "Review enviada com sucesso! Obrigado.",
      });
      setReview("");

      // Atualiza a lista de reviews sem redirecionar
      const updatedReviews = await getGameReviews(id);
      setUserReviews(updatedReviews);

    } catch (err) {
      setResultMsg({
        error: true,
        text: "Erro ao enviar a review. Tente novamente.",
      });
    }
  }

  async function handleDeleteReview(reviewId) {
    try {
      await deleteReview(reviewId);

      setUserReviews(userReviews.filter((rev) => rev.id !== reviewId));
    } catch (error) {
      alert("Erro ao deletar a review, tente novamente.");
    }
  }

  return (
    <>
    <div className="game-page">
      <NavBar />
      <div className="body">
        <div className="container">
          <div className="game-info">
            <br />
            <img
              src={game.backgroundImage}
              alt={game.nome || game.name}
              className="game-image"
            />
            <h2>{game.name}</h2>
            <p><strong>ID:</strong> {game.id}</p>
            <p><strong>Nome:</strong> {game.name}</p>
            <p><strong>Descrição:</strong> {game.description}</p>
            <p><strong>Metacritic:</strong> {game.metacritic}</p>
            <div>
              <strong>Ratings:</strong>
              <ul className="ratings-list">
                {game.ratings?.map((r) => (
                  <li key={r.id}>
                    {r.title} - {r.count} ({r.percent}%)
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="review-form">
            <h2>Deixe sua review</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="reviewInput">Sua avaliação:</label>
                <textarea
                  id="reviewInput"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Escreva sua review aqui..."
                />
              </div>
              <button className="form-button" type="submit">Enviar Review</button>
            </form>
            {resultMsg && (
              <div
                className={
                  resultMsg.error ? "review-result error" : "review-result success"
                }
              >
                {resultMsg.text}
              </div>
            )}

            {userReviews.length > 0 && (
              <div className="user-reviews">
                <h3>Suas reviews anteriores:</h3>
                {userReviews.map((rev, index) => (
                  <div key={index} className="user-review-item">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteReview(rev.id)}
                      title="Deletar review"
                    >
                      🗑️
                    </button>
                    <p>{rev.content}</p>
                    <span className="review-date">
                      {new Date(rev.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      <footer className="game-footer">
        <span>GameView &copy; {new Date().getFullYear()} &mdash; Desenvolvido por turma do pagode</span>
      </footer>
      </div>
    </div>
    </>
  );
}
