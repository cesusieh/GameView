using System.ComponentModel.DataAnnotations;

namespace API.models
{
    public class User 
    {
        public int Id { get; set;}
        [Required]
        public string Nickname {get; set;}
        public string Password {get; set;}
    }
}

