using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;


namespace API.DTOs
{
    public class LoginDTO
    {
        [Required(ErrorMessage = "O nickname é obrigatório.")]
        public string Nickname { get; set; }

        [Required(ErrorMessage = "A senha é obrigatória.")]
        public string Password { get; set; }
    }
}