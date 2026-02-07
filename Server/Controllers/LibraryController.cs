using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Model;
using Server.Model.DTOs;
using Server.Services;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LibraryController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly ILogger<LibraryController> _logger;

    public LibraryController(
        ApplicationDbContext context,
        ICloudinaryService cloudinaryService,
        ILogger<LibraryController> logger
    )
    {
        _context = context;
        _cloudinaryService = cloudinaryService;
        _logger = logger;
    }

    /// <summary>
    /// Save a base64 image to Cloudinary and user's library
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<LibraryImageResponse>> SaveImage(
        [FromBody] SaveImageRequest request
    )
    {
        // Get user ID from JWT claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { message = "Invalid token" });

        try
        {
            // Upload image to Cloudinary
            var (url, publicId) = await _cloudinaryService.UploadImageAsync(
                request.ImageBase64,
                userId
            );

            // Save to database
            var libraryImage = new LibraryImage
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CloudinaryUrl = url,
                CloudinaryPublicId = publicId,
                Title = request.Title,
                CreatedAt = DateTime.UtcNow,
            };

            _context.LibraryImages.Add(libraryImage);
            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "Saved image {ImageId} to library for user {UserId}",
                libraryImage.Id,
                userId
            );

            return Ok(
                new LibraryImageResponse
                {
                    Id = libraryImage.Id,
                    Url = libraryImage.CloudinaryUrl,
                    Title = libraryImage.Title,
                    CreatedAt = libraryImage.CreatedAt,
                }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving image to library for user {UserId}", userId);
            return StatusCode(500, new { message = "Failed to save image", error = ex.Message });
        }
    }

    /// <summary>
    /// Get all images from the logged-in user's library
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<LibraryImageResponse>>> GetUserLibrary()
    {
        // Get user ID from JWT claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { message = "Invalid token" });

        var images = await _context
            .LibraryImages.Where(img => img.UserId == userId)
            .OrderByDescending(img => img.CreatedAt)
            .Select(img => new LibraryImageResponse
            {
                Id = img.Id,
                Url = img.CloudinaryUrl,
                Title = img.Title,
                CreatedAt = img.CreatedAt,
            })
            .ToListAsync();

        _logger.LogInformation("Retrieved {Count} images for user {UserId}", images.Count, userId);

        return Ok(images);
    }

    /// <summary>
    /// Delete an image from the library and Cloudinary
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteImage(Guid id)
    {
        // Get user ID from JWT claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { message = "Invalid token" });

        var image = await _context
            .LibraryImages.Where(img => img.Id == id && img.UserId == userId)
            .FirstOrDefaultAsync();

        if (image == null)
            return NotFound(new { message = "Image not found" });

        try
        {
            // Delete from Cloudinary
            await _cloudinaryService.DeleteImageAsync(image.CloudinaryPublicId);

            // Delete from database
            _context.LibraryImages.Remove(image);
            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "Deleted image {ImageId} from library for user {UserId}",
                id,
                userId
            );

            return Ok(new { message = "Image deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting image {ImageId} for user {UserId}", id, userId);
            return StatusCode(500, new { message = "Failed to delete image", error = ex.Message });
        }
    }
}
