using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class User 
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome de usuário é obrigatório.")]
        [MaxLength(20, ErrorMessage = "O limite de caracteres do nome de usuário é 20.")]
        [MinLength(5, ErrorMessage = "O nome de usuário deve ter pelo menos 5 caracteres.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "A senha é obrigatória.")]
        public string Password { get; set; } 

    }
}
