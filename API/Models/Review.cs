using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace API.Models
{
    public class Review
    {
    [Key]
    public int Id { get; set; }

    [Required]
    public string Nome { get; set; }

    [Required]
    public string Genero { get; set; }

    public string Descricao { get; set; }

    [Range(1950, 2100)]
    public int AnoLancamento { get; set; }
    }
}