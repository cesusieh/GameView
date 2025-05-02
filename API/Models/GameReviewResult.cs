namespace API.Models;

public class GameReviewResult
{
    public List<GameReviewItem> Results { get; set; }
}

public class GameReviewItem
{
    public GameReviewEntity Entity { get; set; }
    public double Score { get; set; }
    public string Type { get; set; }
}

public class GameReviewEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
}
