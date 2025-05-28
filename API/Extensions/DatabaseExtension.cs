using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class DatabaseExtension
    {
        public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration config)
        {
            var connectionString = config.GetConnectionString("AppDbConnectionString");
            services.AddDbContext<AppDbContext>(options =>
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

            return services;
        }
    }
}