using System.ComponentModel.DataAnnotations;


namespace API.DTOs
{
    public class LoginDTO
    {
        [Required(ErrorMessage = "O username é obrigatório.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "A senha é obrigatória.")]
        public string Password { get; set; }
    }
}