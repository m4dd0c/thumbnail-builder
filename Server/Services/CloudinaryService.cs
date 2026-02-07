using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace Server.Services;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;
    private readonly ILogger<CloudinaryService> _logger;

    public CloudinaryService(IConfiguration configuration, ILogger<CloudinaryService> logger)
    {
        var cloudName =
            configuration["Cloudinary:CloudName"]
            ?? throw new InvalidOperationException("Cloudinary CloudName not configured");
        var apiKey =
            configuration["Cloudinary:ApiKey"]
            ?? throw new InvalidOperationException("Cloudinary ApiKey not configured");
        var apiSecret =
            configuration["Cloudinary:ApiSecret"]
            ?? throw new InvalidOperationException("Cloudinary ApiSecret not configured");

        var account = new Account(cloudName, apiKey, apiSecret);
        _cloudinary = new Cloudinary(account);
        _logger = logger;
    }

    public async Task<(string Url, string PublicId)> UploadImageAsync(
        string base64Image,
        int userId
    )
    {
        try
        {
            // Remove data URL prefix if present (e.g., "data:image/png;base64,")
            var base64Data = base64Image;
            if (base64Image.Contains(","))
            {
                base64Data = base64Image.Split(',')[1];
            }

            // Convert base64 to byte array
            var imageBytes = Convert.FromBase64String(base64Data);

            using var stream = new MemoryStream(imageBytes);

            // Create unique public ID with user folder
            var publicId = $"thumbnails/{userId}/{Guid.NewGuid()}";

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription($"{publicId}.png", stream),
                PublicId = publicId,
                Overwrite = false,
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
            {
                _logger.LogError("Cloudinary upload error: {Error}", uploadResult.Error.Message);
                throw new InvalidOperationException(
                    $"Cloudinary upload failed: {uploadResult.Error.Message}"
                );
            }

            return (uploadResult.SecureUrl.ToString(), uploadResult.PublicId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading image to Cloudinary");
            throw;
        }
    }

    public async Task DeleteImageAsync(string publicId)
    {
        try
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);

            if (result.Error != null)
            {
                _logger.LogError("Cloudinary delete error: {Error}", result.Error.Message);
                throw new InvalidOperationException(
                    $"Cloudinary delete failed: {result.Error.Message}"
                );
            }

            _logger.LogInformation(
                "Successfully deleted image {PublicId} from Cloudinary",
                publicId
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting image from Cloudinary");
            throw;
        }
    }
}
