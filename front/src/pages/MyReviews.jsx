import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../common/NavBar";
import "../styles/my-reviews.css";

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [updatedContent, setUpdatedContent] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", {
        state: { message: "Você precisa estar autenticado para acessar esta página." },
      });
      return;
    }

    axios
      .get("http://localhost:5044/api/reviews/my-reviews", { withCredentials: true })
      .then((response) => {
        setReviews(response.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Erro ao carregar suas reviews.");
        setLoading(false);
      });
  }, [navigate]);

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta review?")) {
      axios
        .delete(`http://localhost:5044/api/reviews/${id}`, { withCredentials: true })
        .then(() => {
          setReviews(reviews.filter((review) => review.ID !== id));
        })
        .catch(() => {
          alert("Erro ao excluir a review.");
        });
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setUpdatedContent(review.Content);
  };

  const handleUpdate = () => {
    axios
      .put(
        `http://localhost:5044/api/reviews/${editingReview.ID}`,
        { Content: updatedContent },
        { withCredentials: true }
      )
      .then(() => {
        setReviews(
          reviews.map((review) =>
            review.ID === editingReview.ID ? { ...review, Content: updatedContent } : review
          )
        );
        setEditingReview(null);
        setUpdatedContent("");
      })
      .catch(() => {
        alert("Erro ao atualizar a review.");
      });
  };

    if (loading) {
    return (
      <>
        <NavBar />
        <div className="my-reviews-container">
          <h1>Minhas Reviews</h1>
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
          <h1>Minhas Reviews</h1>
          <p style={{ color: "red" }}>{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="my-reviews-container">
        <h1>Minhas Reviews</h1>
        {reviews.length === 0 ? (
          <p>Você ainda não cadastrou nenhuma review.</p>
        ) : (
          <ul className="reviews-list">
            {reviews.map((review) => (
              <li key={review.ID} className="review-item">
                <p><strong>Jogo:</strong> {review.GameName}</p>
                {editingReview?.ID === review.ID ? (
                  <div>
                    <textarea
                      value={updatedContent}
                      onChange={(e) => setUpdatedContent(e.target.value)}
                    />
                    <button onClick={handleUpdate} className="update-button">Salvar</button>
                    <button onClick={() => setEditingReview(null)} className="cancel-button">Cancelar</button>
                  </div>
                ) : (
                  <>
                    <p><strong>Review:</strong> {review.Content}</p>
                    <button onClick={() => handleEdit(review)} className="edit-button">Atualizar</button>
                    <button onClick={() => handleDelete(review.ID)} className="delete-button">Deletar</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}