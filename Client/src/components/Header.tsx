import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-16 border-b border-gray-200 bg-white transition-all duration-200">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link to="/" className="group flex cursor-pointer items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center bg-black transition-transform duration-200 group-hover:scale-105">
            <span className="text-lg font-bold text-white">T</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-black">
            ThumbnailBuilder
          </h1>
        </Link>

        <nav>
          <ul className="m-0 flex list-none gap-8 p-0">
            {[
              { name: "Home", path: "/" },
              { name: "Generate", path: "/generate" },
              { name: "Library", path: "/library" },
              { name: "Features", path: "/features" },
              { name: "Pricing", path: "/pricing" },
              { name: "About", path: "/about" },
            ].map((item) => (
              <li key={item.name}>
                <Link to={item.path} className="link text-sm">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer border border-gray-300 bg-transparent px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:border-black hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="cursor-pointer border border-gray-300 bg-transparent px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:border-black hover:bg-gray-50"
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="button w-auto px-4 py-2 text-sm"
              >
                <span className="relative z-10">Sign Up</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
