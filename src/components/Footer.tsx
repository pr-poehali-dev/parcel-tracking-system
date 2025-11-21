import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

export function Footer() {
  return (
    <footer className="border-t bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Package" size={24} className="text-primary" />
              <h3 className="font-bold text-lg">Aboba Express</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Global shipping service with real-time tracking. Fast, secure, and reliable delivery to over 200 countries worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Headquarters: Guangzhou, China</li>
              <li>Email: support@abobaexpress.com</li>
              <li>Phone: +86 20 1234 5678</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Aboba Express. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
