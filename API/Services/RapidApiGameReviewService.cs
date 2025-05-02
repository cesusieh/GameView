namespace API.Services;
using System.Text.Json;
using API.Models;


public class RapidApiGameReviewService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public RapidApiGameReviewService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
    }

    public async Task<GameReviewResult> GetDestructoidReviewsAsync()
    {
        
        var request = new HttpRequestMessage
        {
            Method = HttpMethod.Get,
            RequestUri = new Uri("https://esportapi1.p.rapidapi.com/api/esport/search/ATK"),
            Headers =
            {
                { "x-rapidapi-host", _config["RapidAPI:Host"] },
                { "x-rapidapi-key", _config["RapidAPI:Key"] }
            }
        };

        using var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode)
            return null;

        var json = await response.Content.ReadAsStringAsync();

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var result = JsonSerializer.Deserialize<GameReviewResult>(json, options);
        return result;
    }
}
