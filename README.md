# ThumbnailBuilder - Authentication & Pages Documentation

## 🎉 What's New

### Authentication System

The application now has a fully functional authentication system with:

- **User Registration** - Create new accounts with name, email, and password
- **User Login** - Secure JWT-based authentication
- **Protected Routes** - Library and Generate pages require authentication
- **Persistent Sessions** - Stay logged in across page refreshes
- **User Context** - Global authentication state management

### New Pages

- **Features Page** (`/features`) - Showcase of all platform capabilities
- **About Page** (`/about`) - Company mission, vision, and technology stack

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- .NET 10 SDK
- SQL Server (running in Docker or locally)

### Backend Setup

1. **Navigate to Server directory:**

   ```bash
   cd Server
   ```

2. **Update the database connection string** in `appsettings.json`:

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost,1433;Database=ThumbnailBuilderDb;User Id=sa;Password=YourPassword;TrustServerCertificate=True;"
   }
   ```

3. **Run database migrations:**

   ```bash
   dotnet ef database update
   ```

4. **Start the backend server:**
   ```bash
   dotnet run
   ```
   The API will be available at `https://localhost:7001`

### Frontend Setup

1. **Navigate to Client directory:**

   ```bash
   cd Client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file (or use the existing one):

   ```env
   VITE_API_URL=https://localhost:7001/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

## 📁 Project Structure

### Frontend (`/Client`)

```
src/
├── components/
│   ├── Header.tsx          # Navigation with auth state
│   ├── Footer.tsx          # Footer component
│   ├── Layout.tsx          # Main layout wrapper
│   ├── Login.tsx           # Login form
│   ├── Register.tsx        # Registration form
│   └── ProtectedRoute.tsx  # Route protection wrapper
├── context/
│   └── AuthContext.tsx     # Global auth state management
├── pages/
│   ├── Home.tsx           # Landing page
│   ├── Features.tsx       # Features showcase
│   ├── About.tsx          # About page
│   ├── Library.tsx        # User's thumbnail library (protected)
│   └── Generate.tsx       # Thumbnail generator (protected)
├── services/
│   ├── api.ts            # HTTP client
│   └── auth.ts           # Authentication service
└── App.tsx               # Main app with routing
```

### Backend (`/Server`)

```
Controllers/
├── AuthController.cs       # Registration, login, user info
├── LibraryController.cs    # User's thumbnail library
└── ThumbnailController.cs  # Thumbnail generation

Services/
├── IPasswordHasher.cs      # Password hashing interface
├── PasswordHasher.cs       # BCrypt password hashing
├── IJwtService.cs          # JWT token interface
├── JwtService.cs           # JWT token generation
├── ICloudinaryService.cs   # Cloudinary interface
└── CloudinaryService.cs    # Image upload to Cloudinary

Model/
└── DTOs/
    ├── RegisterRequest.cs  # Registration payload
    ├── LoginRequest.cs     # Login payload
    ├── AuthResponse.cs     # Auth response with token
    └── UserResponse.cs     # User info response
```

## 🔐 Authentication Flow

### Registration

1. User fills out registration form (name, email, password)
2. Frontend validates input and sends POST to `/api/auth/register`
3. Backend creates user with hashed password
4. JWT token is generated and returned
5. Token is stored in localStorage
6. User is redirected to `/library`

### Login

1. User enters email and password
2. Frontend sends POST to `/api/auth/login`
3. Backend verifies credentials
4. JWT token is generated and returned
5. Token is stored in localStorage
6. User is redirected to `/library`

### Protected Routes

- Routes wrapped with `<ProtectedRoute>` check authentication
- If not authenticated, user is redirected to `/login`
- Token is sent in `Authorization: Bearer <token>` header

### Logout

- User clicks logout button in header
- Token is removed from localStorage
- User is redirected to home page

## 🎨 Pages Overview

### Home (`/`)

- Hero section with CTA buttons
- Public access
- Links to Features and Generate pages

### Features (`/features`)

- 6 feature cards with hover animations
- Hero section with gradient text
- CTA section with registration prompt
- Public access

### About (`/about`)

- Company stats showcase
- Mission, Vision, and Values
- Technology highlights
- Community CTA
- Public access

### Library (`/library`)

- User's saved thumbnails
- Grid layout with lightbox
- **Protected** - requires authentication

### Generate (`/generate`)

- AI thumbnail generation
- **Protected** - requires authentication

### Login (`/login`)

- Email and password form
- Real-time validation
- Error handling
- Link to registration

### Register (`/register`)

- Name, email, and password form
- Real-time validation
- Error handling
- Link to login

## 🛠️ API Endpoints

### Authentication

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login to existing account
- `GET /api/auth/me` - Get current user info (requires auth)

### Library

- `GET /api/library` - Get user's thumbnails (requires auth)
- `POST /api/library` - Save thumbnail to library (requires auth)

### Thumbnails

- `POST /api/thumbnail/generate` - Generate new thumbnail (requires auth)

## 🎯 Design System

The application follows a minimal black and white design aesthetic:

- **Primary Colors:** Black (#000000) and White (#FFFFFF)
- **Accent Colors:** Gray scale (50, 100, 200, 300, 600)
- **Typography:** System fonts with bold headings
- **Animations:** Smooth transitions (200-300ms)
- **Hover Effects:** Scale, border, and background changes
- **Spacing:** Consistent padding and margins

## 🔧 Environment Variables

### Frontend (`.env`)

```env
VITE_API_URL=https://localhost:7001/api
```

### Backend (`appsettings.json`)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=ThumbnailBuilderDb;User Id=sa;Password=YourPassword;TrustServerCertificate=True;"
  },
  "Jwt": {
    "SecretKey": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "ThumbnailBuilderAPI",
    "Audience": "ThumbnailBuilderClient",
    "ExpirationMinutes": "60"
  },
  "Cloudinary": {
    "CloudName": "YOUR_CLOUD_NAME",
    "ApiKey": "YOUR_API_KEY",
    "ApiSecret": "YOUR_API_SECRET"
  }
}
```

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure SQL Server is running
- Verify connection string credentials
- Check that port 1433 is accessible
- Remove `Trusted_Connection=True` if using SQL auth

### CORS Errors

- Backend allows `http://localhost:5173` and `http://localhost:3000`
- Check that frontend is running on one of these ports

### JWT Token Issues

- Tokens expire after 60 minutes by default
- Clear localStorage and login again if experiencing auth issues

### Build Errors

- Run `npm install` in Client directory
- Run `dotnet restore` in Server directory
- Clear build cache: `dotnet clean` and `npm run build`

## 📝 Next Steps

- [ ] Add password reset functionality
- [ ] Implement email verification
- [ ] Add OAuth providers (Google, GitHub)
- [ ] Create user profile page
- [ ] Add thumbnail editing capabilities
- [ ] Implement team collaboration features

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

Private project - All rights reserved.
