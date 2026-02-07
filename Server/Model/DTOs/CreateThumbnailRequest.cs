using System.ComponentModel.DataAnnotations;

namespace Server.Model.DTOs;

public class CreateThumbnailRequest
{
    [Required(ErrorMessage = "Prompt is required")]
    [MinLength(3, ErrorMessage = "Prompt must be at least 3 characters")]
    [MaxLength(1000, ErrorMessage = "Prompt must not exceed 1000 characters")]
    public required string Prompt { get; set; }
}
