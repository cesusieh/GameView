using API.Data;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

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
            {
                return BadRequest(ModelState);
            }
            bool usernameVerify = await _appDbContext.User.AnyAsync(u => u.Username == user.Username);
            if (usernameVerify)
            {
                return Conflict(new { message = "O nome de usuário já está em uso!" });
            }

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
            {
                return NotFound(new { message = "Usuário não encontrado" });
            }

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, [FromBody]User user)
        {
            User u = await _appDbContext.User.FindAsync(id);

            if (u == null)
            {
                return NotFound(new {message = "Usuário não encontrado" });
            }

            _appDbContext.Entry(u).CurrentValues.SetValues(user);
            await _appDbContext.SaveChangesAsync();

            return Ok(new {message = "Atualizado com sucesso!"});
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            User user = await _appDbContext.User.FindAsync(id);

            if (user == null)
            {
                return NotFound(new {message = "Usuário não encontrado" });
            }

            _appDbContext.User.Remove(user);
            await _appDbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}