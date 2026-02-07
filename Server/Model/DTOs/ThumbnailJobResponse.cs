namespace Server.Model.DTOs;

public class ThumbnailJobResponse
{
    public Guid JobId { get; set; }
    public string Status { get; set; } = string.Empty;
}
