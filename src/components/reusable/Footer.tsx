import Link from "next/link"

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
                  <a
                    href="#features"
                    className="transition-colors hover:text-white"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#benefits"
                    className="transition-colors hover:text-white"
                  >
                    Benefits
                  </a>
                </li>
                <li>
                  <Link
                    href="/auth/signup"
                    className="transition-colors hover:text-white"
                  >
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="transition-colors hover:text-white"
                  >
                    My Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-medium">Patients</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link
                    href="/dashboard/patients"
                    className="transition-colors hover:text-white"
                  >
                    My Patients
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/patients/new"
                    className="transition-colors hover:text-white"
                  >
                    Add Patient
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-medium">Reports</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link
                    href="/dashboard/reports"
                    className="transition-colors hover:text-white"
                  >
                    My Reports
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-medium">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link
                    href="/about"
                    className="transition-colors hover:text-white"
                  >
                    About
                  </Link>
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
