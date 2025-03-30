export default function Footer() {
  return (
    <footer className="py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-between md:flex-row">
          <div className="mb-8 md:mb-0">
            <h3 className="mb-4 font-bold text-xl">SmartMed</h3>
            <p className="max-w-xs text-slate-400">
              Transforming healthcare with AI-powered patient tracking and
              diagnostic tools.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            <div>
              <h4 className="mb-4 font-medium">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-medium">Resources</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-medium">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-slate-800 border-t pt-8 text-slate-400 text-sm">
          <p>© 2025 SmartMed. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
