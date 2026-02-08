# 🎨 ThumbnailBuilder - AI-Powered YouTube Thumbnail Generator

A full-stack web application that leverages Google's Gemini 2.5 Flash Image API to generate professional, eye-catching YouTube thumbnails. Built with React, TypeScript, .NET 10, and modern cloud technologies.

## 🌟 Overview

![preview](./preview.mov)

ThumbnailBuilder is an intelligent thumbnail generation platform that helps content creators design stunning YouTube thumbnails in seconds. The application uses advanced AI to understand your content requirements and generate multiple thumbnail variations optimized for YouTube's platform.

### Key Features

- **🤖 AI-Powered Generation** - Leverages Google Gemini 2.5 Flash Image API for intelligent thumbnail creation
- **🖼️ Image-to-Image Generation** - Upload reference images to guide AI style and composition
- **⚡ Asynchronous Processing** - Background worker service handles long-running AI tasks without blocking
- **☁️ Cloud Storage** - Cloudinary integration for reliable, scalable image hosting
- **📚 Personal Library** - Save, organize, and manage your generated thumbnails
- **🔐 Secure Authentication** - JWT-based auth with BCrypt password hashing
- **🎯 YouTube-Optimized** - Generates 16:9 thumbnails following YouTube best practices
- **💾 State Persistence** - Resume active generation jobs after page refresh
- **🎨 Modern UI** - Clean, minimal black-and-white design with smooth animations

## 🏗️ Architecture

### Technology Stack

#### Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS 4.1
- **Routing**: React Router DOM 7
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom service layer

#### Backend

- **Framework**: ASP.NET Core 10
- **Database**: SQL Server with Entity Framework Core 10
- **Authentication**: JWT Bearer tokens
- **Password Hashing**: BCrypt.Net
- **API Documentation**: Scalar (OpenAPI)
- **Background Jobs**: Hosted Service with custom job queue

#### External Services

- **AI Generation**: Google Gemini 2.5 Flash Image API
- **Image Storage**: Cloudinary
- **Database**: SQL Server (Docker or local)

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │ Features │  │  About   │  │  Login   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────────────────────────────────┐   │
│  │ Library  │  │         Generate (Protected)         │   │
│  │(Protected)│  │  - Prompt Input + Image Upload       │   │
│  └──────────┘  │  - Job Status Polling                │   │
│                 │  - Result Display & Download         │   │
│                 └──────────────────────────────────────┘   │
│                          │                                   │
│                    AuthContext (JWT)                        │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTPS/REST API
┌─────────────────────────┼───────────────────────────────────┐
│                    Backend (.NET 10)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Controllers Layer                        │  │
│  │  ┌────────┐  ┌────────┐  ┌──────────────────────┐   │  │
│  │  │  Auth  │  │Library │  │    Thumbnail         │   │  │
│  │  │        │  │        │  │  - Create Job        │   │  │
│  │  └────────┘  └────────┘  │  - Poll Status       │   │  │
│  │                           └──────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Services Layer                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │  │
│  │  │   JWT    │  │Cloudinary│  │  Gemini Service  │   │  │
│  │  │ Service  │  │ Service  │  │  (HTTP Client)   │   │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │  │
│  │  ┌──────────┐  ┌──────────────────────────────────┐ │  │
│  │  │ Password │  │  Background Job Queue            │ │  │
│  │  │  Hasher  │  │  (In-Memory Channel)             │ │  │
│  │  └──────────┘  └──────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Thumbnail Worker Service (Hosted)            │  │
│  │  - Dequeues jobs from background queue               │  │
│  │  - Calls Gemini API with enhanced prompts           │  │
│  │  - Updates job status in database                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Data Layer (Entity Framework Core)           │  │
│  │  ┌────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │  User  │  │ThumbnailJob  │  │LibraryImage  │    │  │
│  │  └────────┘  └──────────────┘  └──────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
    ┌─────────▼────────┐    ┌──────────▼─────────┐
    │   SQL Server     │    │  External Services │
    │   Database       │    │  - Gemini API      │
    │                  │    │  - Cloudinary      │
    └──────────────────┘    └────────────────────┘
```

### Data Flow: Thumbnail Generation

1. **User submits prompt** (+ optional reference image) via Generate page
2. **Frontend** sends POST to `/api/thumbnail` with prompt and base64 image
3. **ThumbnailController** creates a `ThumbnailJob` record (status: Pending)
4. **Job ID** is enqueued to `BackgroundJobQueue` (in-memory channel)
5. **ThumbnailWorkerService** dequeues job and updates status to Processing
6. **Worker** builds enhanced YouTube-optimized prompt with system context
7. **GeminiService** calls Gemini 2.5 Flash Image API with prompt + reference image
8. **Gemini API** returns 2 base64-encoded thumbnail images
9. **Worker** stores images in database and updates job status to Completed
10. **Frontend** polls `/api/thumbnail/{jobId}/status` every 2 seconds
11. **User** downloads or saves thumbnails to library via Cloudinary

## 📁 Project Structure

### Frontend (`/Client`)

```
Client/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Navigation with auth state
│   │   ├── Footer.tsx              # Footer component
│   │   ├── Layout.tsx              # Main layout wrapper
│   │   ├── Login.tsx               # Login form with validation
│   │   ├── Register.tsx            # Registration form
│   │   └── ProtectedRoute.tsx      # Auth guard for routes
│   ├── context/
│   │   └── AuthContext.tsx         # Global auth state (JWT)
│   ├── pages/
│   │   ├── Home.tsx                # Landing page
│   │   ├── Features.tsx            # Feature showcase
│   │   ├── About.tsx               # About page
│   │   ├── Library.tsx             # User's saved thumbnails (protected)
│   │   └── Generate.tsx            # AI generation interface (protected)
│   ├── services/
│   │   ├── api.ts                  # HTTP client with auth interceptor
│   │   ├── auth.ts                 # Authentication service
│   │   ├── library.ts              # Library API calls
│   │   └── thumbnail.ts            # Thumbnail generation API
│   ├── App.tsx                     # Route configuration
│   ├── main.tsx                    # App entry point
│   └── index.css                   # Global styles + Tailwind
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Backend (`/Server`)

```
Server/
├── Controllers/
│   ├── AuthController.cs           # POST /register, /login, GET /me
│   ├── LibraryController.cs        # GET /library, POST /library, DELETE /library/{id}
│   └── ThumbnailController.cs      # POST /thumbnail, GET /thumbnail/{id}/status
├── Services/
│   ├── IPasswordHasher.cs          # Password hashing interface
│   ├── PasswordHasher.cs           # BCrypt implementation
│   ├── IJwtService.cs              # JWT token interface
│   ├── JwtService.cs               # JWT generation with claims
│   ├── ICloudinaryService.cs       # Image upload interface
│   ├── CloudinaryService.cs        # Cloudinary SDK wrapper
│   ├── IGeminiService.cs           # AI generation interface
│   ├── GeminiService.cs            # Gemini API HTTP client
│   ├── IBackgroundJobQueue.cs      # Job queue interface
│   ├── BackgroundJobQueue.cs       # Channel-based queue
│   └── ThumbnailWorkerService.cs   # Background worker (HostedService)
├── Model/
│   ├── User.cs                     # User entity
│   ├── ThumbnailJob.cs             # Job entity with status enum
│   ├── LibraryImage.cs             # Saved image entity
│   └── DTOs/
│       ├── RegisterRequest.cs      # Registration payload
│       ├── LoginRequest.cs         # Login payload
│       ├── AuthResponse.cs         # JWT response
│       ├── UserResponse.cs         # User info
│       ├── CreateThumbnailRequest.cs  # Generation request
│       ├── ThumbnailJobResponse.cs    # Job creation response
│       ├── ThumbnailStatusResponse.cs # Job status + images
│       ├── SaveImageRequest.cs        # Library save request
│       └── LibraryImageResponse.cs    # Library image info
├── Data/
│   └── ApplicationDbContext.cs     # EF Core DbContext
├── Migrations/                     # EF Core migrations
├── Program.cs                      # App configuration & DI
├── Server.csproj                   # NuGet packages
└── appsettings.json                # Configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **.NET 10 SDK**
- **SQL Server** (Docker recommended)
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))
- **Cloudinary Account** ([Sign up free](https://cloudinary.com/))

### Backend Setup

1. **Navigate to Server directory:**

   ```bash
   cd Server
   ```

2. **Configure `appsettings.json`:**

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
     "Gemini": {
       "ApiKey": "YOUR_GEMINI_API_KEY",
       "ApiUrl": "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent"
     },
     "Cloudinary": {
       "CloudName": "YOUR_CLOUD_NAME",
       "ApiKey": "YOUR_API_KEY",
       "ApiSecret": "YOUR_API_SECRET"
     }
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
   API will be available at `https://localhost:7001`
   API documentation at `https://localhost:7001/scalar/v1`

### Frontend Setup

1. **Navigate to Client directory:**

   ```bash
   cd Client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure `.env` file:**

   ```env
   VITE_API_URL=https://localhost:7001/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   App will be available at `http://localhost:5173`

### Docker Setup for SQL Server (Optional)

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123!" \
  -p 1433:1433 --name sql-server \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

## 🔐 Authentication Flow

### Registration

1. User fills registration form (name, email, password)
2. Frontend validates input and sends POST to `/api/auth/register`
3. Backend hashes password with BCrypt and creates user record
4. JWT token is generated with user claims (ID, email)
5. Token stored in localStorage, user redirected to `/library`

### Login

1. User enters credentials
2. Frontend sends POST to `/api/auth/login`
3. Backend verifies password hash
4. JWT token generated and returned
5. Token stored, user redirected to `/library`

### Protected Routes

- `ProtectedRoute` component checks `AuthContext` state
- Unauthenticated users redirected to `/login`
- All API calls include `Authorization: Bearer <token>` header
- Backend validates JWT on protected endpoints

### Token Management

- Tokens expire after 60 minutes (configurable)
- Stored in localStorage for persistence
- Automatically included in API requests via service layer
- Logout clears token and redirects to home

## 🎨 Pages Overview

| Page         | Route       | Access    | Description                           |
| ------------ | ----------- | --------- | ------------------------------------- |
| **Home**     | `/`         | Public    | Hero section with CTA buttons         |
| **Features** | `/features` | Public    | 6 feature cards with hover animations |
| **About**    | `/about`    | Public    | Mission, vision, tech stack showcase  |
| **Login**    | `/login`    | Public    | Email/password form with validation   |
| **Register** | `/register` | Public    | User registration form                |
| **Generate** | `/generate` | Protected | AI thumbnail generation interface     |
| **Library**  | `/library`  | Protected | User's saved thumbnails with lightbox |

## 🛠️ API Endpoints

### Authentication

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login to existing account
- `GET /api/auth/me` - Get current user info (requires auth)

### Thumbnail Generation

- `POST /api/thumbnail` - Create thumbnail generation job (requires auth)
  - Body: `{ "prompt": "string", "image": "base64 string (optional)" }`
  - Returns: `{ "jobId": "guid", "status": "Pending" }`
- `GET /api/thumbnail/{jobId}/status` - Poll job status (requires auth)
  - Returns: `{ "status": "Completed", "images": ["base64...", "base64..."] }`

### Library

- `GET /api/library` - Get user's saved thumbnails (requires auth)
- `POST /api/library` - Save thumbnail to library (requires auth)
  - Body: `{ "imageBase64": "string", "title": "string" }`
- `DELETE /api/library/{id}` - Delete thumbnail (requires auth)

## 🎯 Design System

The application follows a **minimal black-and-white aesthetic**:

- **Colors**: Black (#000), White (#FFF), Gray scale (50-600)
- **Typography**: System fonts with bold headings
- **Animations**: Smooth transitions (200-300ms)
- **Hover Effects**: Scale, border, background changes
- **Spacing**: Consistent padding/margins
- **Components**: Reusable, accessible, responsive

## 🧪 Key Features Deep Dive

### AI Thumbnail Generation

- **System Prompt Enhancement**: Worker service adds YouTube best practices to user prompts
- **16:9 Aspect Ratio**: Enforced in system prompt for YouTube compatibility
- **Best Practices**: Eye-catching design, bold text, high contrast, clear focal point
- **Reference Image Support**: Upload images to guide AI style/composition
- **Batch Generation**: Creates 2 variations per request

### Background Processing

- **Non-Blocking**: Jobs processed asynchronously via hosted service
- **Job Queue**: In-memory channel-based queue (System.Threading.Channels)
- **Status Tracking**: Pending → Processing → Completed/Failed
- **Error Handling**: Failed jobs store error messages
- **Persistence**: Jobs survive server restarts (stored in database)

### State Management

- **Job Persistence**: Active job ID stored in localStorage
- **Auto-Resume**: Page refresh resumes polling active job
- **Clear State**: Manual clear button removes all local state
- **Context API**: Global auth state across components

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure SQL Server is running: `docker ps` or check local service
- Verify connection string credentials in `appsettings.json`
- Check port 1433 accessibility: `telnet localhost 1433`
- Remove `Trusted_Connection=True` if using SQL auth

### CORS Errors

- Backend allows `http://localhost:5173` and `http://localhost:3000`
- Verify frontend runs on allowed port
- Check browser console for specific CORS error details

### JWT Token Issues

- Tokens expire after 60 minutes by default
- Clear localStorage and re-login if experiencing auth issues
- Verify `Jwt:SecretKey` is at least 32 characters
- Check token in browser DevTools → Application → Local Storage

### Gemini API Errors

- Verify API key in `appsettings.json`
- Check API quota/limits in Google AI Studio
- Review backend logs for detailed error messages
- Ensure image is valid base64 format

### Build Errors

- **Frontend**: Run `npm install` in Client directory
- **Backend**: Run `dotnet restore` in Server directory
- **Clear cache**: `dotnet clean` and `rm -rf node_modules`

## 📊 Database Schema

### Users Table

- `Id` (int, PK)
- `Email` (string, unique, indexed)
- `Name` (string)
- `PasswordHash` (string)
- `CreatedAt` (datetime)

### ThumbnailJobs Table

- `Id` (guid, PK)
- `UserId` (int, FK → Users)
- `Prompt` (string, max 1000)
- `InputImageBase64` (text, nullable)
- `Status` (enum: Pending/Processing/Completed/Failed)
- `Image1Base64` (text, nullable)
- `Image2Base64` (text, nullable)
- `ErrorMessage` (string, nullable)
- `CreatedAt` (datetime, indexed)
- `CompletedAt` (datetime, nullable)

### LibraryImages Table

- `Id` (guid, PK)
- `UserId` (int, FK → Users)
- `CloudinaryUrl` (string, max 500)
- `CloudinaryPublicId` (string, max 200)
- `Title` (string, max 200, nullable)
- `CreatedAt` (datetime, indexed)

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
  "Gemini": {
    "ApiKey": "YOUR_GEMINI_API_KEY",
    "ApiUrl": "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent"
  },
  "Cloudinary": {
    "CloudName": "YOUR_CLOUD_NAME",
    "ApiKey": "YOUR_API_KEY",
    "ApiSecret": "YOUR_API_SECRET"
  }
}
```

## 📝 Future Enhancements

- [ ] Password reset functionality via email
- [ ] Email verification for new accounts
- [ ] OAuth providers (Google, GitHub)
- [ ] User profile page with settings
- [ ] Thumbnail editing capabilities (text overlay, filters)
- [ ] Team collaboration features
- [ ] Thumbnail analytics (views, clicks)
- [ ] Template library with pre-built styles
- [ ] Batch generation (multiple prompts)
- [ ] Export to different formats/sizes
- [ ] A/B testing for thumbnails
- [ ] Integration with YouTube API for direct upload

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to open issues or submit pull requests.

## 📄 License

Private project - All rights reserved.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful image generation capabilities
- **Cloudinary** for reliable image hosting
- **React** and **.NET** communities for excellent documentation
- **YouTube** for inspiring the need for better thumbnails

---

**Built with ❤️ by Manish**
