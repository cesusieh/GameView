using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class User 
    {
        [Key]
        public int Id { get; set;}
        [Required(ErrorMessage = "O nickname é obrigatório.")]
        [MaxLength(20, ErrorMessage = "O limite de caracteres é 20.")]
        public string Nickname {get; set;}
        [Required]
        public string Password {get; set;}
    }
}

