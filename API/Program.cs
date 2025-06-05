using API.Extensions;
using API.Services;
using API.Settings;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Serviços
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddMemoryCache();
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

// Extensões criadas
builder.Services.AddCorsPolicy();
builder.Services.AddSwaggerDocumentation();
builder.Services.AddAuthenticationJwt(builder.Configuration);
builder.Services.AddDatabase(builder.Configuration);

// HTTP Client para RAWG API
builder.Services.AddHttpClient<Rawg>()
    .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
    {
        AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate
    });

// App
var app = builder.Build();

// Middlewares
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowLocalhost3000");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
