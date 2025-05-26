using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using API.Services;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly Rawg _rawg;

    public GamesController(Rawg rawg)
    {
        _rawg = rawg;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
            return BadRequest(new { error = "Query missing" });

        try
        {
            var resultJson = await _rawg.SearchGamesAsync(q);
            return Content(resultJson, "application/json");
        }
        catch
        {
            return StatusCode(500, new { error = "Erro ao buscar dados na RAWG" });
        }
    }
}
