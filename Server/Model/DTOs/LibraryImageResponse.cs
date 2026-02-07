namespace Server.Model.DTOs;

public class LibraryImageResponse
{
    public Guid Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? Title { get; set; }
    public DateTime CreatedAt { get; set; }
}
