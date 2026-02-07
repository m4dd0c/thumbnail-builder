using Server.Model;

namespace Server.Services;

public interface IJwtService
{
    string GenerateToken(User user);
}
