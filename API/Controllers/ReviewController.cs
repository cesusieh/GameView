using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public ReviewController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddReview([FromBody] Review review)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "Usuário não autenticado." });
            }

            int userId = int.Parse(userIdClaim.Value);

            review.UserId = userId;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userExists = await _appDbContext.User.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                return BadRequest(new { message = "Usuário não encontrado!" });
            }

            _appDbContext.Review.Add(review);
            await _appDbContext.SaveChangesAsync();

            return Created($"api/reviews/{review.Id}", new { message = "Review criado com sucesso!" });
        }


        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetReviews()
        {
            var reviews = await _appDbContext.Review
                .Include(r => r.User)
                .Select(r => new
                {
                    Id = r.Id,
                    Content = r.Content,
                    GameId = r.GameId,
                    CreatedAt = r.CreatedAt,
                    User = new
                    {
                        Id = r.User.Id,
                        Username = r.User.Username
                    }
                })
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<object>> GetReview(int id)
        {
            var review = await _appDbContext.Review
                .Include(r => r.User)
                .Where(r => r.Id == id)
                .Select(r => new
                {
                    Id = r.Id,
                    Content = r.Content,
                    GameId = r.GameId,
                    CreatedAt = r.CreatedAt,
                    User = new
                    {
                        Id = r.User.Id,
                        Username = r.User.Username
                    }
                })
                .FirstOrDefaultAsync();

            if (review == null)
            {
                return NotFound(new { message = "Review não encontrado" });
            }

            return Ok(review);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] Review updatedReview)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized(new { message = "Token inválido ou usuário não autenticado" });

            int userId = int.Parse(userIdClaim.Value);

            var review = await _appDbContext.Review.FirstOrDefaultAsync(r => r.Id == id);

            if (review == null)
                return NotFound(new { message = "Review não encontrado" });

            if (review.UserId != userId)
                return Forbid("Você não tem permissão para editar esta review.");

            review.Content = updatedReview.Content;
            review.GameId = updatedReview.GameId;

            await _appDbContext.SaveChangesAsync();

            return Ok(new { message = "Review atualizada com sucesso!" });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized(new { message = "Token inválido ou usuário não autenticado" });

            int userId = int.Parse(userIdClaim.Value);

            var review = await _appDbContext.Review.FirstOrDefaultAsync(r => r.Id == id);

            if (review == null)
                return NotFound(new { message = "Review não encontrado" });

            if (review.UserId != userId)
                return Forbid("Você não tem permissão para deletar esta review.");

            _appDbContext.Review.Remove(review);
            await _appDbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("myReviews")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetMyReviews()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "Token inválido ou usuário não autenticado" });
            }

            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return BadRequest(new { message = "Id do usuário inválido" });
            }
            var reviews = await _appDbContext.Review
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new
                {
                    r.Id,
                    r.Content,
                    r.GameId,
                    r.CreatedAt
                })
                .ToListAsync();

            return Ok(reviews);
        }
        
        [HttpGet("myReviews/{gameId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetMyReviewsByGameId(int gameId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "Token inválido ou usuário não autenticado" });
            }

            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return BadRequest(new { message = "Id do usuário inválido" });
            }

            var reviews = await _appDbContext.Review
                .Where(r => r.UserId == userId && r.GameId == gameId)
                .Select(r => new
                {
                    r.Id,
                    r.Content,
                    r.GameId,
                    r.CreatedAt
                })
                .ToListAsync();

            return Ok(reviews);
        }
    }
}
