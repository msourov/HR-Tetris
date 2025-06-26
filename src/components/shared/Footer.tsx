const Footer = () => {
  return (
    <footer className="pt-8 border-t border-black/20 backdrop-blur-xl bg-white shadow-lg">
      <div className="mx-auto ">
        <div className="max-w-[90vw] mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo Column */}
          <div className="flex flex-col items-start">
            <img
              src="./assets/logo.jpg"
              alt="Company Logo"
              className="w-40 object-contain mb-4"
            />
            <p className="text-sm text-gray-600 drop-shadow-md">
              A tech company transforming ideas into digital reality
            </p>
          </div>

          {/* Contact Column */}
          <div className="space-y-4 drop-shadow-md">
            <div className="flex items-center gap-3 drop-shadow-md">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <p className="text-sm">+880-123456789</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div className="drop-shadow-md">
                <p className="text-sm text-gray-600">Address</p>
                <p className="text-sm">Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Description Column */}
          <div className="space-y-2 drop-shadow-md">
            <p className="text-sm text-gray-600">About Us</p>
            <p className="text-sm">
              Lorem Ipsum is a piece of text used by designers to fill space
              where content will eventually sit. It helps show how text will
              look once finished.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center py-4 border-t border-gray-600 bg-black">
          <p className="text-sm text-gray-600">
            &copy; 2024-2025 Infozillion. All rights reserved |{" "}
            <a
              href="https://www.infotelebd.com/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              https://www.infotelebd.com/
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
