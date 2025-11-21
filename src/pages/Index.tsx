import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Package } from '@/types/package';

const API_URL = 'https://functions.poehali.dev/377be8f8-6ae5-4538-9bd0-310ecc0aeec8';

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'destructive' }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  in_transit: { label: 'In Transit', variant: 'default' },
  delivered: { label: 'Delivered', variant: 'success' },
  returned: { label: 'Returned', variant: 'destructive' },
};

export default function Index() {
  const [trackingCode, setTrackingCode] = useState('');
  const navigate = useNavigate();
  
  const [adminView, setAdminView] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      toast({ title: 'Please enter a tracking code', variant: 'destructive' });
      return;
    }
    navigate(`/track/${trackingCode.trim()}`);
  };

  const loadPackages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.success) {
        setPackages(data.packages || []);
      }
    } catch (error) {
      toast({ title: 'Failed to load packages', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePackage = async (formData: Partial<Package>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({ title: 'Package created successfully' });
        setIsDialogOpen(false);
        loadPackages();
      }
    } catch (error) {
      toast({ title: 'Failed to create package', variant: 'destructive' });
    }
  };

  const handleUpdatePackage = async (formData: Package) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({ title: 'Package updated successfully' });
        setIsDialogOpen(false);
        setEditingPackage(null);
        loadPackages();
      }
    } catch (error) {
      toast({ title: 'Failed to update package', variant: 'destructive' });
    }
  };

  const handleDeletePackage = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({ title: 'Package deleted successfully' });
        loadPackages();
      }
    } catch (error) {
      toast({ title: 'Failed to delete package', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b backdrop-blur-sm sticky top-0 z-50 bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Package" size={32} className="text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Aboba Express</h1>
                <p className="text-sm text-muted-foreground">Global Shipping Service</p>
              </div>
            </div>
            <Button
              variant={adminView ? 'default' : 'outline'}
              onClick={() => {
                setAdminView(!adminView);
                if (!adminView) loadPackages();
              }}
              className="gap-2"
            >
              <Icon name={adminView ? 'Search' : 'Settings'} size={18} />
              {adminView ? 'Track Package' : 'Admin Panel'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {!adminView ? (
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
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Package Management</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" onClick={() => setEditingPackage(null)}>
                    <Icon name="Plus" size={18} />
                    New Package
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingPackage ? 'Edit Package' : 'Create New Package'}</DialogTitle>
                    <DialogDescription>
                      {editingPackage ? 'Update package information' : 'Enter package details to create a new tracking entry'}
                    </DialogDescription>
                  </DialogHeader>
                  <PackageForm
                    initialData={editingPackage}
                    onSubmit={editingPackage ? handleUpdatePackage : handleCreatePackage}
                    onCancel={() => setIsDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Package" size={24} />
                  All Packages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <Icon name="Loader2" size={32} className="animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground mt-2">Loading packages...</p>
                  </div>
                ) : packages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="Package" size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No packages found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tracking Code</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>From → To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Delivery Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-mono font-semibold">{pkg.tracking_code}</TableCell>
                          <TableCell>{pkg.recipient_name}</TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1">
                              <span>{pkg.origin}</span>
                              <Icon name="ArrowRight" size={14} />
                              <span>{pkg.destination}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusMap[pkg.status]?.variant || 'default'}>
                              {statusMap[pkg.status]?.label || pkg.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(pkg.estimated_delivery).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingPackage(pkg);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Icon name="Edit" size={14} />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeletePackage(pkg.id)}
                              >
                                <Icon name="Trash2" size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

function PackageForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData: Package | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Package>>(
    initialData || {
      sender_name: '',
      sender_address: '',
      recipient_name: '',
      recipient_address: '',
      origin: '',
      destination: '',
      weight: 0,
      status: 'pending',
      estimated_delivery: '',
      notes: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sender Name</Label>
          <Input
            value={formData.sender_name}
            onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Sender Address</Label>
          <Input
            value={formData.sender_address}
            onChange={(e) => setFormData({ ...formData, sender_address: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Recipient Name</Label>
          <Input
            value={formData.recipient_name}
            onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Recipient Address</Label>
          <Input
            value={formData.recipient_address}
            onChange={(e) => setFormData({ ...formData, recipient_address: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Origin</Label>
          <Input
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Destination</Label>
          <Input
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Weight (kg)</Label>
          <Input
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Estimated Delivery</Label>
          <Input
            type="date"
            value={formData.estimated_delivery?.split('T')[0] || ''}
            onChange={(e) => setFormData({ ...formData, estimated_delivery: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Notes (optional)</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Package' : 'Create Package'}
        </Button>
      </div>
    </form>
  );
}