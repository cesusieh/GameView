import axios from "axios";

export async function searchGames(query) {
  if (!query || query.length < 3) {
    return [];
  }

  try {
    const response = await axios.get(`http://localhost:5044/api/games?q=${query}`);
    return response.data || [];
  } catch (error) {
    throw new Error("Erro ao buscar os jogos: " + (error.response?.data?.message || error.message));
  }
}

export async function fetchGameById(id) {
  try {
    const response = await axios.get(`http://localhost:5044/api/games/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao buscar o jogo: " + (error.response?.data?.message || error.message));
  }
}