using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Models;
using API.Data;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class GameReviewController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GameReviewController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            return await _context.GameReviews.ToListAsync();
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReview(int id)
        {
            var review = await _context.GameReviews.FindAsync(id);

            if (review == null)
                return NotFound();

            return review;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Review>> CreateReview(Review review)
        {
            _context.GameReviews.Add(review);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReview), new { id = review.Id }, review);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(int id, Review review)
        {
            if (id != review.Id)
                return BadRequest();

            _context.Entry(review).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReviewExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.GameReviews.FindAsync(id);
            if (review == null)
                return NotFound();

            _context.GameReviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReviewExists(int id) =>
            _context.GameReviews.Any(e => e.Id == id);
    }
}