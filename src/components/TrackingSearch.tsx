import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export function TrackingSearch() {
  const [trackingCode, setTrackingCode] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      toast({ title: 'Please enter a tracking code', variant: 'destructive' });
      return;
    }
    navigate(`/track/${trackingCode.trim()}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-foreground">Track Your Package</h2>
        <p className="text-lg text-muted-foreground">Enter your tracking code to get real-time delivery updates</p>
      </div>

      <Card className="shadow-lg border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Search" size={24} />
            Search by Tracking Code
          </CardTitle>
          <CardDescription>Format: AB2024XXXXXX</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter tracking code"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                className="text-lg"
              />
              <Button type="submit" size="lg" className="gap-2">
                <Icon name="Search" size={18} />
                Track
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <Icon name="Clock" size={24} className="text-primary mb-2" />
            <CardTitle className="text-lg">Fast Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Express shipping to over 200 countries worldwide</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <Icon name="Shield" size={24} className="text-primary mb-2" />
            <CardTitle className="text-lg">Secure Shipping</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Full insurance coverage for all packages</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <Icon name="MapPin" size={24} className="text-primary mb-2" />
            <CardTitle className="text-lg">Real-time Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Track your package at every step of the journey</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
