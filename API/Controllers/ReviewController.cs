using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Models;
using API.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/reviews")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        private readonly GamesController _gamesController;

        public ReviewController(AppDbContext appDbContext, GamesController gamesController)
        {
            _appDbContext = appDbContext;
            _gamesController = gamesController;
        }

        // Cria uma nova review
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Review>> PostReview([FromBody] Review review)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
                {
                    return Unauthorized("Usuário não autenticado ou ID inválido.");
                }

                // Associa o ID do usuário à review
                review.UserID = userIdInt;

                // Verifica se o jogo já existe no banco de dados
                var existingGame = await _appDbContext.Games.FindAsync(review.GameID);
                if (existingGame == null)
                {
                    // Busca os dados do jogo na API externa
                    var gameResponse = await _gamesController.GetById(review.GameID);
                    if (gameResponse is ObjectResult result && result.Value is Game gameDto)
                    {
                        // Salva o jogo no banco de dados
                        var newGame = new Game
                        {
                            ID = gameDto.ID,
                            Name = gameDto.Name,
                            Description = gameDto.Description,
                            BackgroundImage = gameDto.BackgroundImage,
                            Metacritic = gameDto.Metacritic
                        };
                        _appDbContext.Games.Add(newGame);
                        await _appDbContext.SaveChangesAsync();
                    }
                    else
                    {
                        return BadRequest("Jogo não encontrado na API externa.");
                    }
                }

                // Salva a review no banco de dados
                _appDbContext.Review.Add(review);
                await _appDbContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetReview), new { id = review.ID }, review);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao criar review: {ex.Message}");
                return StatusCode(500, "Erro interno no servidor.");
            }
        }

        // Obtém todas as reviews (opcional, pode ser restrito)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            return await _appDbContext.Review
                .Include(r => r.User)
                .ToListAsync();
        }

        // Obtém uma review específica pelo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReview(int id)
        {
            var review = await _appDbContext.Review
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.ID == id);

            if (review == null)
            {
                return NotFound("Review não encontrada.");
            }

            return review;
        }

        // Obtém as reviews do usuário autenticado
        [HttpGet("my-reviews")]
        [Authorize]
        public async Task<IActionResult> GetMyReviews()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
                {
                    return Unauthorized("Usuário não autenticado ou ID inválido.");
                }

                // Consulta otimizada com join direto
                var reviews = await _appDbContext.Review
                    .Where(r => r.UserID == userIdInt)
                    .Join(
                        _appDbContext.Games,
                        review => review.GameID,
                        game => game.ID,
                        (review, game) => new
                        {
                            review.ID,
                            review.GameID,
                            review.Content,
                            review.CreatedAt,
                            GameName = game.Name
                        }
                    )
                    .ToListAsync();

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar reviews: {ex.Message}");
                return StatusCode(500, "Erro interno no servidor.");
            }
        }

        // Atualiza uma review
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] Review updatedReview)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Unauthorized("Usuário não autenticado ou ID inválido.");
            }

            var review = await _appDbContext.Review.FindAsync(id);

            if (review == null)
            {
                return NotFound("Review não encontrada.");
            }

            if (review.UserID != userIdInt)
            {
                return Forbid("Você não tem permissão para editar esta review.");
            }

            review.Content = updatedReview.Content;
            review.UpdatedAt = DateTime.UtcNow;

            await _appDbContext.SaveChangesAsync();

            return Ok(review);
        }

        // Exclui uma review
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Unauthorized("Usuário não autenticado ou ID inválido.");
            }

            var review = await _appDbContext.Review.FindAsync(id);

            if (review == null)
            {
                return NotFound("Review não encontrada.");
            }

            if (review.UserID != userIdInt)
            {
                return Forbid("Você não tem permissão para excluir esta review.");
            }

            _appDbContext.Review.Remove(review);
            await _appDbContext.SaveChangesAsync();

            return Ok("Review excluída com sucesso.");
        }
    }
}