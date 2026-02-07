namespace Server.Model.DTOs;

public class ThumbnailStatusResponse
{
    public string Status { get; set; } = string.Empty;
    public List<string>? Images { get; set; }
    public string? ErrorMessage { get; set; }
}
