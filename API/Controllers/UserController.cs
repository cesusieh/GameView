using API.Data;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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
        public async Task<IActionResult> AddUser([FromBody] User user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool usernameVerify = await _appDbContext.User.AnyAsync(u => u.Username == user.Username);
            if (usernameVerify)
                return Conflict(new { message = "O nome de usuário já está em uso!" });

            var passwordHasher = new PasswordHasher<User>();
            user.Password = passwordHasher.HashPassword(user, user.Password);

            _appDbContext.User.Add(user);
            await _appDbContext.SaveChangesAsync();

            return Created($"api/users/{user.Id}", new { message = "Usuário cadastrado com sucesso!" });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var users = await _appDbContext.User
            .Select(u => new UserDTO{Id=u.Id, Username=u.Username})
            .ToListAsync();

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(int id)
        {
            UserDTO user = await _appDbContext.User
            .Where(u => u.Id == id)
            .Select(u => new UserDTO{Id=u.Id, Username=u.Username})
            .FirstOrDefaultAsync();

            if (user == null)
                return NotFound(new { message = "Usuário não encontrado" });

            return Ok(user);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutUser(int id, [FromBody] User user)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return Unauthorized(new { message = "Token inválido ou usuário não autenticado" });    

            if (id != int.Parse(userIdClaim.Value))
                return Unauthorized(new { message = "Vocẽ só pode alterar seu próprio usuário" });
            
            var u = await _appDbContext.User.FindAsync(id);

            if (u == null)
                return NotFound(new { message = "Usuário não encontrado" });

            if (u.Username != user.Username)
            {
                bool usernameExists = await _appDbContext.User.AnyAsync(us => us.Username == user.Username);
                if (usernameExists)
                    return Conflict(new { message = "O nome de usuário já está em uso!" });
                u.Username = user.Username;
            }

            if (!string.IsNullOrWhiteSpace(user.Password) && user.Password != u.Password)
            {
                var passwordHasher = new PasswordHasher<User>();
                u.Password = passwordHasher.HashPassword(u, user.Password);
            }

            await _appDbContext.SaveChangesAsync();

            return Ok(new { message = "Usuário atualizado com sucesso!" });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
         
            if (userIdClaim == null)
                return Unauthorized(new { message = "Token inválido ou usuário não autenticado" });    

            if (id != int.Parse(userIdClaim.Value))
                return Unauthorized(new { message = "Vocẽ só pode deletar seu próprio usuário" });

            User user = await _appDbContext.User.FindAsync(id);

            if (user == null)
                return NotFound(new { message = "Usuário não encontrado" });

            _appDbContext.User.Remove(user);
            await _appDbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}