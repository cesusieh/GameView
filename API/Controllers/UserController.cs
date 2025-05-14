using API.Data;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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

            // Verificando se o nickname já está em uso
            bool nicknameVerify = await _appDbContext.User.AnyAsync(u => u.Nickname == user.Nickname);
            if (nicknameVerify)
            {
                return Conflict(new { message = "O nickname já está em uso!" });
            }

            // Hash da senha
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
            .Select(u => new UserDTO{Id=u.Id, Nickname=u.Nickname})
            .ToListAsync();

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(int id)
        {
            UserDTO user = await _appDbContext.User
            .Where(u => u.Id == id)
            .Select(u => new UserDTO{Id=u.Id, Nickname=u.Nickname})
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
    

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            var user = await _appDbContext.User
                .FirstOrDefaultAsync(u => u.Nickname == loginDto.Nickname);

            if (user == null)
            {
                return Unauthorized(new { message = "Usuário não encontrado!" });
            }

            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(user, user.Password, loginDto.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { message = "Senha incorreta!" });
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Nickname)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("minha-chave-super-secreta-de-256-bits!12345678"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "suaapi.com",
                audience: "suaapi.com",
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token)
            });
        }
    }
}