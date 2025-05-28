using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data 
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }
        public DbSet<User> User { get; set; }
        public DbSet<Review> Review { get; set; }
        public DbSet<Game> Games { get; set; }
    }
}