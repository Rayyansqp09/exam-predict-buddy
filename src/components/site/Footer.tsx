import { Link } from "@tanstack/react-router";
import { GraduationCap, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="font-display text-base font-bold">FYUGP Model Papers</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Syllabus-aligned predicted model question papers crafted to help Calicut University students prepare smarter.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="/#features" className="hover:text-foreground">Features</a></li>
              <li><a href="/#pricing" className="hover:text-foreground">Pricing</a></li>
              <li><a href="/#faq" className="hover:text-foreground">FAQ</a></li>
              <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Contact</h4>
            <a href="mailto:support@FYUGP-papers.example" className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <Mail className="h-4 w-4" /> support@FYUGP-papers.example
            </a>
            <p className="mt-4 text-xs text-muted-foreground">
              Disclaimer: Predictions are based on syllabus and trend analysis. We do not guarantee exact exam questions.
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} FYUGP Model Question Papers. All rights reserved.</p>
          <p>Trusted by students preparing for Calicut University semester exams.</p>
        </div>
      </div>
    </footer>
  );
}
