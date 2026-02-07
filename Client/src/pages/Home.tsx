import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-white px-4 py-12">
      <div className="max-w-4xl text-center">
        <h1 className="mb-6 text-6xl font-bold tracking-tight text-black">
          Create Stunning Thumbnails
        </h1>
        <p className="mb-12 text-xl text-gray-600">
          AI-powered design tools to help you create professional thumbnails in
          minutes.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/generate" className="button w-auto px-8 py-4 text-base">
            <span className="relative z-10">Get Started</span>
          </Link>
          <Link
            to="/features"
            className="border border-gray-300 bg-transparent px-8 py-4 text-base font-medium text-black transition-all duration-200 hover:border-black hover:bg-gray-50"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
