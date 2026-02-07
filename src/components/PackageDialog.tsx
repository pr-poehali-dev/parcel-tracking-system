import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Package } from '@/types/package';

interface PackageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingPackage: Package | null;
  generateTrackingCode: () => string;
}

const getDefaultDeliveryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
};

export function PackageDialog({ isOpen, onClose, onSubmit, editingPackage, generateTrackingCode }: PackageDialogProps) {
  const [formData, setFormData] = useState<Partial<Package>>({
    tracking_code: '',
    sender_name: '',
    sender_address: '',
    recipient_name: '',
    recipient_address: '',
    weight: 0,
    status: 'pending',
    origin: '',
    destination: '',
    estimated_delivery: getDefaultDeliveryDate(),
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (editingPackage) {
        setFormData(editingPackage);
      } else {
        setFormData({
          tracking_code: generateTrackingCode(),
          sender_name: '',
          sender_address: '',
          recipient_name: '',
          recipient_address: '',
          weight: 0,
          status: 'pending',
          origin: '',
          destination: '',
          estimated_delivery: getDefaultDeliveryDate(),
          notes: '',
        });
      }
    }
  }, [isOpen, editingPackage, generateTrackingCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingPackage ? 'Edit Package' : 'Create New Package'}</DialogTitle>
          <DialogDescription>
            {editingPackage ? 'Update package information' : 'Enter package details to create a new shipment'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tracking_code">Tracking Code</Label>
              <Input
                id="tracking_code"
                value={formData.tracking_code}
                onChange={(e) => setFormData({ ...formData, tracking_code: e.target.value })}
                disabled={!!editingPackage}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sender_name">Sender Name</Label>
              <Input
                id="sender_name"
                value={formData.sender_name}
                onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient_name">Recipient Name</Label>
              <Input
                id="recipient_name"
                value={formData.recipient_name}
                onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sender_address">Sender Address</Label>
            <Input
              id="sender_address"
              value={formData.sender_address}
              onChange={(e) => setFormData({ ...formData, sender_address: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient_address">Recipient Address</Label>
            <Input
              id="recipient_address"
              value={formData.recipient_address}
              onChange={(e) => setFormData({ ...formData, recipient_address: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimated_delivery">Estimated Delivery</Label>
              <Input
                id="estimated_delivery"
                type="date"
                value={formData.estimated_delivery || ''}
                onChange={(e) => setFormData({ ...formData, estimated_delivery: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shipped_date">Shipment Date</Label>
              <Input
                id="shipped_date"
                type="date"
                value={formData.shipped_date ? formData.shipped_date.split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, shipped_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivered_date">Delivery Date</Label>
              <Input
                id="delivered_date"
                type="date"
                value={formData.delivered_date ? formData.delivered_date.split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, delivered_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Icon name={editingPackage ? 'Save' : 'Plus'} size={16} />
              {editingPackage ? 'Update' : 'Create'} Package
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}