import { Link } from "react-router-dom";

export default function About() {
  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "100K+", label: "Thumbnails Created" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ];

  const team = [
    {
      role: "Mission",
      title: "Empowering Creators",
      description:
        "We believe every creator deserves professional-quality design tools. Our mission is to democratize thumbnail creation, making it accessible, fast, and incredibly effective for everyone.",
    },
    {
      role: "Vision",
      title: "The Future of Design",
      description:
        "We're building the future where AI and human creativity work together seamlessly. Our vision is a world where great design is just a click away, enabling creators to focus on what they do best.",
    },
    {
      role: "Values",
      title: "Quality & Innovation",
      description:
        "We're committed to excellence in everything we do. From our cutting-edge AI technology to our user experience, we never compromise on quality or innovation.",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white">
      {/* Hero Section */}
      <section className="border-b border-gray-200 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-black md:text-6xl">
            Building the Future of
            <span className="block mt-2">Thumbnail Creation</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            ThumbnailBuilder was born from a simple idea: creating stunning
            thumbnails shouldn't require hours of design work or expensive
            software. We're on a mission to empower creators with AI-powered
            tools that make professional design accessible to everyone.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-gray-200 bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transition-transform duration-300 hover:scale-105"
              >
                <div className="mb-2 text-5xl font-bold text-black">
                  {stat.value}
                </div>
                <div className="text-sm font-medium uppercase tracking-wider text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-3">
            {team.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden border border-gray-200 p-8 transition-all duration-300 hover:border-black hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-linear-to-br from-gray-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-4 inline-block border-b-2 border-black pb-2">
                    <span className="text-sm font-bold uppercase tracking-wider text-gray-600">
                      {item.role}
                    </span>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-black">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="border-t border-gray-200 bg-linear-to-b from-white to-gray-50 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-4xl font-bold text-black">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-gray-600">
              We leverage the latest in artificial intelligence and cloud
              technology to deliver lightning-fast, professional results.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-xl font-bold text-black">
                🤖 AI Generation
              </h3>
              <p className="text-gray-600">
                Our proprietary AI models are trained on millions of
                high-performing thumbnails to understand what works.
              </p>
            </div>
            <div className="border border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-xl font-bold text-black">
                ☁️ Cloud Infrastructure
              </h3>
              <p className="text-gray-600">
                Built on enterprise-grade cloud infrastructure ensuring 99.9%
                uptime and blazing-fast performance.
              </p>
            </div>
            <div className="border border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-xl font-bold text-black">
                🔒 Security First
              </h3>
              <p className="text-gray-600">
                Your data is encrypted end-to-end. We take privacy and security
                seriously with industry-leading practices.
              </p>
            </div>
            <div className="border border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-xl font-bold text-black">
                🚀 Continuous Innovation
              </h3>
              <p className="text-gray-600">
                We ship new features and improvements every week based on user
                feedback and the latest AI research.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-200 bg-black px-4 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Join Our Community
          </h2>
          <p className="mb-8 text-xl text-gray-300">
            Be part of a growing community of creators who are transforming
            their content with AI-powered design.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-white px-8 py-4 text-base font-medium text-black transition-all duration-200 hover:bg-gray-100"
            >
              Get Started Free
            </Link>
            <Link
              to="/features"
              className="border border-white bg-transparent px-8 py-4 text-base font-medium text-white transition-all duration-200 hover:bg-white hover:text-black"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
