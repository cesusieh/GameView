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
using Microsoft.AspNetCore.Authorization;
using API.Settings;
using Microsoft.Extensions.Options;

namespace API.Controllers
{
    [ApiController]
    [Route("api/login")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        private readonly JwtSettings _jwtSettings;

        public AuthController(AppDbContext appDbContext, IOptions<JwtSettings> jwtSettings)
        {
            _appDbContext = appDbContext;
            _jwtSettings = jwtSettings.Value;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            var user = await _appDbContext.User
                .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

            if (user == null)
            {
                return Unauthorized(new { message = "Usuário ou senha incorretos!" });
            }

            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(user, user.Password, loginDto.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { message = "Usuário ou senha incorretos!" });
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            string HCToken = new JwtSecurityTokenHandler().WriteToken(token);

            Response.Cookies.Append("token", HCToken, new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddHours(1),
                HttpOnly = true,
                SameSite = SameSiteMode.Lax,
                Secure = false
            });

            return Ok(new
            {
                message = "Você está logado!",
                token = HCToken
            });
        }

        [HttpPost("/api/logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("token", new CookieOptions
            {
                Secure = true,
                HttpOnly = true,
                SameSite = SameSiteMode.Lax
            });

            return Ok(new { message = "Logout realizado com sucesso!" });
        }

        [HttpGet("/api/check")]
        [Authorize]
        public IActionResult CheckAuth()
        {
            return Ok(new { message = "Usuário autenticado." });
        }
    }
}