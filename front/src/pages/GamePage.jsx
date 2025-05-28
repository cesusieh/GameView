import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGameById } from "../services/rawg";
import "../styles/game-page.css";
import NavBar from "../common/NavBar";
import axios from "axios";

export default function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState("");
  const [resultMsg, setResultMsg] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", {
        state: { message: "Você precisa estar autenticado para acessar esta página." },
      });
      return;
    }

    axios
      .get("http://localhost:5044/api/auth/check", { withCredentials: true })
      .then(() => {
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
      })
      .catch(() => {
        navigate("/login", {
          state: { message: "Você precisa estar autenticado para acessar esta página." },
        });
      });
  }, [id, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!review.trim()) {
      setResultMsg({ error: true, text: "Por favor, escreva sua review." });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5044/api/reviews",
        {
          GameID: id,
          Content: review,
        },
        { withCredentials: true }
      );

      console.log("Resposta do servidor:", response.data);

      setResultMsg({ error: false, text: "Review enviada com sucesso! Obrigado." });
      setReview("");

      // Redireciona para "Minhas Reviews" após o envio
      setTimeout(() => {
        navigate("/my-reviews");
      }, 1500);
    } catch (err) {
      setResultMsg({ error: true, text: "Erro ao enviar a review. Tente novamente." });
    }
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