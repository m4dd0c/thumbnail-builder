using System.ComponentModel.DataAnnotations;

namespace Server.Model.DTOs;

public class SaveImageRequest
{
    [Required(ErrorMessage = "Image is required")]
    public required string ImageBase64 { get; set; }

    [MaxLength(200, ErrorMessage = "Title must not exceed 200 characters")]
    public string? Title { get; set; }
}
