import { cn } from "@/lib/utils"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-between md:flex-row">
          <div className="mb-8 md:mb-0">
            <h3 className="mb-4 font-bold text-xl">SmartMed</h3>
            <p className="max-w-xs text-muted-foreground">
              Transforming healthcare with AI-powered patient tracking and
              diagnostic tools.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            <div>
              <h4 className="mb-4 font-medium">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className={cn(
                      "text-muted-foreground",
                      "transition-colors hover:text-foreground"
                    )}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#benefits"
                    className={cn(
                      "text-muted-foreground",
                      "transition-colors hover:text-foreground"
                    )}
                  >
                    Benefits
                  </a>
                </li>
                <li>
                  <Link
                    href="/auth/signup"
                    className={cn(
                      "text-muted-foreground",
                      "transition-colors hover:text-foreground"
                    )}
                  >
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className={cn(
                      "text-muted-foreground",
                      "transition-colors hover:text-foreground"
                    )}
                  >
                    My Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-medium">Patients</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/dashboard/patients"
                    className={cn(
                      "text-muted-foreground",
                      "transition-colors hover:text-foreground"
                    )}
                  >
                    My Patients
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/patients/new"
                    className={cn(
                      "text-muted-foreground",
                      "transition-colors hover:text-foreground"
                    )}
                  >
                    Add Patient
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-medium">Reports</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/dashboard/reports"
                    className={cn(
                      "text-muted-foreground",
                      "transition-colors hover:text-foreground"
                    )}
                  >
                    My Reports
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-medium">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className={cn(
                      "text-muted-foreground",
                      "transition-colors hover:text-foreground"
                    )}
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-border border-t pt-8 text-muted-foreground text-sm">
          <p>© 2025 Harsh Narayan Jha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
