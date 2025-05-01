using API.models;
using Microsoft.EntityFrameworkCore;

namespace API.Data 
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options){}
        public DbSet <User> User {get; set;}
    }
}