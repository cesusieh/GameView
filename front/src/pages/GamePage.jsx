import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchGameById } from "../services/rawg";
import "../styles/game-page.css";
import NavBar from "../common/NavBar";

export default function GamePage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState("");
  const [resultMsg, setResultMsg] = useState(null);

  useEffect(() => {
    async function loadGame() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchGameById(id);
        setGame(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [id]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!review.trim()) {
      setResultMsg({ error: true, text: "Por favor, escreva sua review." });
      return;
    }

    setResultMsg({ error: false, text: "Review enviada com sucesso! Obrigado." });
    setReview("");
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

  return (
    <>
      <NavBar />
      <div className="body">
        <div className="container">
          <div className="game-info">
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
              <button type="submit">Enviar Review</button>
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
          </div>
        </div>
      </div>
    </>
  );
}
