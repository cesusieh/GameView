using Microsoft.AspNetCore.Mvc;
using API.Services;
using API.Models;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly RapidApiGameReviewService _reviewService;

    public ReviewsController(RapidApiGameReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet("destructoid")]
    public async Task<ActionResult<GameReviewResult>> GetDestructoidReviews()
    {
        var result = await _reviewService.GetDestructoidReviewsAsync();
        if (result == null)
            return NotFound("Dados não encontrados ou erro na API.");

        return Ok(result);
    }
}
