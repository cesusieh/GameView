using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.DTOs;

namespace API.Models
{
    public class Review
    {
        [Key]
        public int ID { get; set; }

        [ForeignKey("User")]
        public int UserID { get; set; }

        public UserDTO User { get; set; }

        public string GameID { get; set; }
    }
}
