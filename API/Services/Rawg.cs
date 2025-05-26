using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace API.Services
{
    public class Rawg
    {
        private readonly HttpClient _httpClient;
        private readonly string _rawgApiKey;

        public Rawg(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _rawgApiKey = configuration["RawgApiKey"];
        }

        public async Task<string> SearchGamesAsync(string query)
        {
            var url = $"https://api.rawg.io/api/games?key={_rawgApiKey}&search={query}";
            var response = await _httpClient.GetAsync(url);

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }
    }
}
