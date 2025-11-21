import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { TrackingSearch } from '@/components/TrackingSearch';

export default function Index() {

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b backdrop-blur-sm sticky top-0 z-50 bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Icon name="Package" size={32} className="text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Aboba Express</h1>
                <p className="text-sm text-muted-foreground">Global Shipping Service</p>
              </div>
            </Link>

          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        <TrackingSearch />
      </main>
    </div>
  );
}