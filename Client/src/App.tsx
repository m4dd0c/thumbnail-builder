import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Generate from "./pages/Generate";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/library"
              element={
                <ProtectedRoute>
                  <Library />
                </ProtectedRoute>
              }
            />
            <Route
              path="/generate"
              element={
                <ProtectedRoute>
                  <Generate />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/features"
              element={
                <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
                  <h1 className="text-4xl font-bold">Features Page</h1>
                </div>
              }
            />
            <Route
              path="/pricing"
              element={
                <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
                  <h1 className="text-4xl font-bold">Pricing Page</h1>
                </div>
              }
            />
            <Route
              path="/about"
              element={
                <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
                  <h1 className="text-4xl font-bold">About Page</h1>
                </div>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
