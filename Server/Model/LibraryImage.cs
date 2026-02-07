using System.ComponentModel.DataAnnotations;

namespace Server.Model;

public class LibraryImage
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public int UserId { get; set; }

    [Required]
    [MaxLength(500)]
    public string CloudinaryUrl { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string CloudinaryPublicId { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Title { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public User User { get; set; } = null!;
}
