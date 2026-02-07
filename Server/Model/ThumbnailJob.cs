using System.ComponentModel.DataAnnotations;

namespace Server.Model;

public class ThumbnailJob
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public int UserId { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Prompt { get; set; } = string.Empty;

    [Required]
    public JobStatus Status { get; set; } = JobStatus.Pending;

    public string? Image1Base64 { get; set; }

    public string? Image2Base64 { get; set; }

    public string? ErrorMessage { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedAt { get; set; }

    // Navigation property
    public User User { get; set; } = null!;
}

public enum JobStatus
{
    Pending,
    Processing,
    Completed,
    Failed,
}
