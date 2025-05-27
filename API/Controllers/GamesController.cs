using Microsoft.AspNetCore.Mvc;
using API.Services;
using System.Text.Json;
using API.DTOs;

namespace API.Controllers
{
    [ApiController]
    [Route("api/games")]
    public class GamesController : ControllerBase
    {
        private readonly Rawg _rawg;

        public GamesController(Rawg rawg)
        {
            _rawg = rawg;
        }

        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest(new { error = "Query missing" });

            try
            {
                var resultJson = await _rawg.SearchGamesAsync(q);

                using var document = JsonDocument.Parse(resultJson);
                var root = document.RootElement;

                if (!root.TryGetProperty("results", out JsonElement results))
                    return NotFound(new { error = "Nenhum resultado encontrado" });

                var games = new List<IdGameDTO>();

                foreach (var game in results.EnumerateArray())
                {
                    if (game.TryGetProperty("id", out var idProp) &&
                        game.TryGetProperty("name", out var nameProp))
                    {
                        games.Add(new IdGameDTO
                        {
                            Id = idProp.GetInt32(),
                            Name = nameProp.GetString()!
                        });
                    }
                }
                return Ok(games);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erro ao buscar dados na RAWG", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            if (id <= 0)
                return BadRequest(new { error = "ID inválido" });

            try
            {
                var resultJson = await _rawg.GetGameByIdAsync(id);

                using var doc = JsonDocument.Parse(resultJson);
                var root = doc.RootElement;

                var gameDto = new GameDto
                {
                    Id = root.GetProperty("id").GetInt32(),
                    Name = root.GetProperty("name").GetString(),
                    Description = root.GetProperty("description_raw").GetString(),
                    Metacritic = root.TryGetProperty("metacritic", out var meta) && meta.ValueKind != JsonValueKind.Null ? meta.GetInt32() : null,
                    BackgroundImage = root.GetProperty("background_image").GetString(),
                    Ratings = root.GetProperty("ratings").EnumerateArray().Select(r => new RatingDto
                    {
                        Id = r.GetProperty("id").GetInt32(),
                        Title = r.GetProperty("title").GetString(),
                        Count = r.GetProperty("count").GetInt32(),
                        Percent = r.GetProperty("percent").GetDouble()
                    }).ToList()
                };
                return Ok(gameDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erro ao buscar dados na RAWG", details = ex.Message });
            }
        }
    }
}