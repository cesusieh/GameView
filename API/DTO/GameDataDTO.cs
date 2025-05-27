namespace API.DTOs
{
    public class GameDto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public int? Metacritic { get; set; }
        public IEnumerable<RatingDto> Ratings { get; set; }
        public string BackgroundImage { get; set; }
    }

    public class RatingDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Count { get; set; }
        public double Percent { get; set; }
    }
}
