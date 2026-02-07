import { Link } from "react-router-dom";

export default function Features() {
  const features = [
    {
      icon: "🎨",
      title: "AI-Powered Design",
      description:
        "Leverage cutting-edge AI technology to generate professional thumbnails that capture attention and drive engagement.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Create stunning thumbnails in seconds, not hours. Our optimized workflow gets you from concept to completion instantly.",
    },
    {
      icon: "🎯",
      title: "Smart Templates",
      description:
        "Choose from a curated collection of templates designed by professionals, optimized for maximum click-through rates.",
    },
    {
      icon: "🖼️",
      title: "Cloud Library",
      description:
        "Store all your thumbnails securely in the cloud. Access your designs anywhere, anytime, from any device.",
    },
    {
      icon: "✨",
      title: "Customization",
      description:
        "Fine-tune every aspect of your thumbnail with intuitive controls. Colors, fonts, layouts - complete creative freedom.",
    },
    {
      icon: "📊",
      title: "Analytics Ready",
      description:
        "Export thumbnails optimized for all platforms. Track performance and iterate on what works best for your audience.",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white">
      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-linear-to-b from-gray-50 to-white px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-black md:text-6xl">
            Everything You Need to Create
            <span className="block mt-2 bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Professional Thumbnails
            </span>
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Powerful features designed to make thumbnail creation effortless,
            fast, and incredibly effective.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-black hover:shadow-lg"
              >
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-gray-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center bg-black text-4xl transition-transform duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-black">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-200 bg-black px-4 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-xl text-gray-300">
            Join thousands of creators who trust ThumbnailBuilder for their
            design needs.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-white px-8 py-4 text-base font-medium text-black transition-all duration-200 hover:bg-gray-100"
            >
              Start Creating Free
            </Link>
            <Link
              to="/library"
              className="border border-white bg-transparent px-8 py-4 text-base font-medium text-white transition-all duration-200 hover:bg-white hover:text-black"
            >
              View Examples
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
