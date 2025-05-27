using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Models;
using API.Data;

namespace API.Controllers
{
    [Route("api/reviews")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public ReviewController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpPost]
        public async Task<ActionResult<Review>> PostReview(Review review)
        {
            if (!_appDbContext.Review.Any(u => u.ID == review.UserID))
                return BadRequest("Usuário não encontrado.");

            _appDbContext.Review.Add(review);
            await _appDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReview), new { id = review.ID }, review);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            return await _appDbContext.Review.Include(r => r.User).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReview(int id)
        {
            var review = await _appDbContext.Review.Include(r => r.User).FirstOrDefaultAsync(r => r.ID == id);

            if (review == null)
                return NotFound();

            return review;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutReview(int id, Review updatedReview)
        {
            if (id != updatedReview.ID)
                return BadRequest();

            _appDbContext.Entry(updatedReview).State = EntityState.Modified;

            try
            {
                await _appDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_appDbContext.Review.Any(r => r.ID == id))
                    return NotFound();

                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _appDbContext.Review.FindAsync(id);

            if (review == null)
                return NotFound();

            _appDbContext.Review.Remove(review);
            await _appDbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
