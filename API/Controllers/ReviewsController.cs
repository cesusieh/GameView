using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly RapidApiGameReviewService _reviewService;

        public ReviewsController(RapidApiGameReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        // Endpoint para obter reviews do Destructoid
        [HttpGet("destructoid")]
        public async Task<IActionResult> GetDestructoidReviews()
        {
            var data = await _reviewService.GetDestructoidReviewsAsync();
            
            if (data == null)
            {
                return NotFound("Não foi possível obter os reviews.");
            }

            // Aqui, você pode converter o JSON em objetos `Jogo` ou retornar o JSON como está
            // Para isso, pode usar o modelo `Jogo` para mapear os dados do JSON

            return Ok(data); // Por enquanto, retorna os dados crus da API
        }
    }
}