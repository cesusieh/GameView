import axios from 'axios';

export async function postReview(gameId, content) {
  try {
    const response = await axios.post(
      'http://localhost:5044/api/reviews',
      {gameId,content},
      {withCredentials: true}
    );

    return response.data;
  } catch (error) {
    console.error('Erro ao enviar review:', error.response?.data || error.message);
    throw error;
  }
}

export async function getMyReviews() {
  try {
    const response = await axios.get("http://localhost:5044/api/reviews/myReviews", {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("Erro ao buscar as reviews do usuário:", err);
    return [];
  }
}

export async function getGameReviews(gameId) {
  try {
    const response = await axios.get(`http://localhost:5044/api/reviews/myReviews/${gameId}`,
      {withCredentials: true}
    );
    return response.data;
  } catch (err) {
    console.error("Erro ao buscar reviews do usuário:", err);
    return [];
  }
}

export async function deleteReview(reviewId) {
  try {
    await axios.delete(
      `http://localhost:5044/api/reviews/${reviewId}`,
      { withCredentials: true }
    );

    return 
  } catch (err) {
    console.error("Erro ao deletar review:", err);
    throw err; 
  }
}

export async function updateReview(reviewId, content) {
  try {
    const response = await axios.put(`http://localhost:5044/api/reviews/${reviewId}`,
      { content },
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar review:', error.response?.data || error.message);
    throw error;
  }
}
