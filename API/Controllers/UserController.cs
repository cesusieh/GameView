using API.Data;
using API.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public UserController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpPost]
        public async Task<IActionResult> AddUser(User user)
        {
            // Validação do objeto
            if (!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            // Verifica se o nickname está livre
            bool nicknameVerify = await _appDbContext.User.AnyAsync(u => u.Nickname == user.Nickname);
            if (nicknameVerify){
                return Conflict(new { message = "O nickname já está em uso!"});
            }


            // Adiciona no banco
            _appDbContext.User.Add(user);
            await _appDbContext.SaveChangesAsync();
            
            return Created($"api/User/{user.Id}", user.Id);
        }
    }

}