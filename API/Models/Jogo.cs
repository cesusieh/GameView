using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class Jogo
    {
        public int Id { get; set; } // Chave primária para o banco de dados
        public string Titulo { get; set; }
        public string Review { get; set; }
        public string Fonte { get; set; } // Ex: "Destructoid", "IGN"
        public string Score { get; set; }
    }
}