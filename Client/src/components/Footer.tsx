export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: ["Features", "Pricing", "Templates", "API"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Legal: ["Privacy", "Terms", "Security", "Cookies"],
  };

  const socialLinks = ["Twitter", "GitHub", "LinkedIn", "Discord"];

  return (
    <footer className="mt-auto bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center bg-white">
                <span className="text-lg font-bold text-black">T</span>
              </div>
              <h2 className="m-0 text-lg font-semibold">ThumbnailBuilder</h2>
            </div>
            <p className="m-0 text-sm leading-relaxed text-gray-400">
              Create stunning thumbnails with AI-powered design tools.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                {category}
              </h3>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {links.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-gray-400 no-underline transition-colors duration-200 hover:text-white"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-800 pt-8">
          <p className="m-0 text-sm text-gray-500">
            © {currentYear} ThumbnailBuilder. All rights reserved.
          </p>

          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm text-gray-500 no-underline transition-colors duration-200 hover:text-white"
                aria-label={social}
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
