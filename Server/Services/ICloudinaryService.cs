namespace Server.Services;

public interface ICloudinaryService
{
    Task<(string Url, string PublicId)> UploadImageAsync(string base64Image, int userId);
    Task DeleteImageAsync(string publicId);
}
