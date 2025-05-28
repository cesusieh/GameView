using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class Review
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public int GameID { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public int UserID { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Relação com a entidade User
        [ForeignKey("UserID")]
        public User User { get; set; }
    }
}