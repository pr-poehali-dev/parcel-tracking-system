import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Package } from '@/types/package';
import { getCountryCode, getCountryFlagEmoji } from '@/utils/countries';

const statusConfig = {
  pending: { label: 'Pending', variant: 'secondary' as const, icon: 'Package' },
  in_transit: { label: 'In Transit', variant: 'default' as const, icon: 'Truck' },
  delivered: { label: 'Delivered', variant: 'success' as const, icon: 'CheckCircle2' },
  returned: { label: 'Returned', variant: 'destructive' as const, icon: 'RotateCcw' }
};

export default function Track() {
  const { trackingCode } = useParams<{ trackingCode: string }>();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPackage = async () => {
      if (!trackingCode) return;
      
      try {
        const response = await fetch(`https://functions.poehali.dev/377be8f8-6ae5-4538-9bd0-310ecc0aeec8?tracking_code=${trackingCode}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setPackageData(data.package);
        } else {
          setError(data.error || 'Package not found');
        }
      } catch (err) {
        setError('Failed to fetch package data');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [trackingCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Package" size={48} className="mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Icon name="AlertCircle" size={48} className="text-destructive" />
            </div>
            <CardTitle className="text-center">Tracking Not Found</CardTitle>
            <CardDescription className="text-center">
              We couldn't find a package with tracking code: <span className="font-mono font-semibold">{trackingCode}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link to="/">
              <Button>
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = statusConfig[packageData.status as keyof typeof statusConfig];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Icon name={status.icon} size={28} />
                    Package Tracking
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Tracking Code: <span className="font-mono font-semibold text-lg">{packageData.tracking_code}</span>
                  </CardDescription>
                </div>
                <Badge variant={status.variant} className="text-sm px-3 py-1">
                  {status.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Sender</p>
                    <p className="font-semibold">{packageData.sender_name}</p>
                    <p className="text-sm text-muted-foreground">{packageData.sender_address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Origin</p>
                    <p className="font-medium flex items-center gap-2">
                      <span className="text-2xl">{getCountryFlagEmoji(getCountryCode(packageData.origin))}</span>
                      {packageData.origin}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Recipient</p>
                    <p className="font-semibold">{packageData.recipient_name}</p>
                    <p className="text-sm text-muted-foreground">{packageData.recipient_address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Destination</p>
                    <p className="font-medium flex items-center gap-2">
                      <span className="text-2xl">{getCountryFlagEmoji(getCountryCode(packageData.destination))}</span>
                      {packageData.destination}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">{packageData.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-medium">
                      {new Date(packageData.estimated_delivery).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {packageData.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{packageData.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon name="MapPin" size={20} />
                Tracking History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div className="w-0.5 h-full bg-border"></div>
                  </div>
                  <div className="pb-8 flex-1">
                    <p className="font-semibold">Current Location</p>
                    <p className="text-sm text-muted-foreground">
                      {packageData.status === 'delivered' ? packageData.destination : packageData.origin}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(packageData.created_at).toLocaleString('en-US')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-muted"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Origin</p>
                    <p className="text-sm text-muted-foreground">{packageData.origin}</p>
                    <p className="text-xs text-muted-foreground mt-1">Package registered</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}