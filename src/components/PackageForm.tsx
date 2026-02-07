import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface PackageFormData {
  id?: number;
  tracking_code: string;
  sender_name: string;
  sender_address: string;
  sender_country: string;
  recipient_name: string;
  recipient_address: string;
  recipient_country: string;
  status: string;
  shipped_date: string;
  delivery_date: string;
}

interface PackageFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PackageFormData) => void;
  editingPackage?: PackageFormData | null;
}

const countryFlags: Record<string, string> = {
  'United States': '🇺🇸',
  'China': '🇨🇳',
  'Russia': '🇷🇺',
  'United Kingdom': '🇬🇧',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Japan': '🇯🇵',
  'South Korea': '🇰🇷',
  'Canada': '🇨🇦',
  'Australia': '🇦🇺',
  'Brazil': '🇧🇷',
  'India': '🇮🇳',
  'Mexico': '🇲🇽',
  'Spain': '🇪🇸',
  'Italy': '🇮🇹',
  'Netherlands': '🇳🇱',
  'Belgium': '🇧🇪',
  'Switzerland': '🇨🇭',
  'Sweden': '🇸🇪',
  'Norway': '🇳🇴',
  'Denmark': '🇩🇰',
  'Finland': '🇫🇮',
  'Poland': '🇵🇱',
  'Portugal': '🇵🇹',
  'Greece': '🇬🇷',
  'Turkey': '🇹🇷',
  'UAE': '🇦🇪',
  'Saudi Arabia': '🇸🇦',
  'Singapore': '🇸🇬',
  'Malaysia': '🇲🇾',
  'Thailand': '🇹🇭',
  'Vietnam': '🇻🇳',
  'Indonesia': '🇮🇩',
  'Philippines': '🇵🇭',
  'Hong Kong': '🇭🇰',
  'Taiwan': '🇹🇼',
  'New Zealand': '🇳🇿',
  'Argentina': '🇦🇷',
  'Chile': '🇨🇱',
  'Colombia': '🇨🇴',
  'Peru': '🇵🇪',
  'South Africa': '🇿🇦',
  'Egypt': '🇪🇬',
  'Nigeria': '🇳🇬',
  'Kenya': '🇰🇪',
  'Morocco': '🇲🇦',
  'Israel': '🇮🇱',
  'Pakistan': '🇵🇰',
  'Bangladesh': '🇧🇩',
  'Sri Lanka': '🇱🇰',
  'Kazakhstan': '🇰🇿',
  'Ukraine': '🇺🇦',
  'Belarus': '🇧🇾',
  'Czech Republic': '🇨🇿',
  'Austria': '🇦🇹',
  'Hungary': '🇭🇺',
  'Romania': '🇷🇴',
  'Bulgaria': '🇧🇬',
  'Croatia': '🇭🇷',
  'Serbia': '🇷🇸',
  'Ireland': '🇮🇪',
  'Iceland': '🇮🇸',
  'Luxembourg': '🇱🇺',
  'Malta': '🇲🇹',
  'Cyprus': '🇨🇾',
};

const generateTrackingCode = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `ZV${year}${random}`;
};

const getCountryFlag = (countryName: string) => {
  return countryFlags[countryName] || '🌍';
};

export function PackageForm({ open, onClose, onSubmit, editingPackage }: PackageFormProps) {
  const [formData, setFormData] = useState<PackageFormData>({
    tracking_code: generateTrackingCode(),
    sender_name: '',
    sender_address: '',
    sender_country: '',
    recipient_name: '',
    recipient_address: '',
    recipient_country: '',
    status: 'pending',
    shipped_date: '',
    delivery_date: '',
  });

  useEffect(() => {
    if (editingPackage) {
      setFormData(editingPackage);
    } else {
      setFormData({
        tracking_code: generateTrackingCode(),
        sender_name: '',
        sender_address: '',
        sender_country: '',
        recipient_name: '',
        recipient_address: '',
        recipient_country: '',
        status: 'pending',
        shipped_date: '',
        delivery_date: '',
      });
    }
  }, [editingPackage, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1a2332] border-[#1e2a47]">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            {editingPackage ? 'Edit Package' : 'Create New Package'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tracking Code */}
          <div className="space-y-2">
            <Label className="text-white">Tracking Code</Label>
            <Input
              value={formData.tracking_code}
              onChange={(e) => setFormData({ ...formData, tracking_code: e.target.value })}
              disabled={!!editingPackage}
              className="bg-[#0f1729] border-[#1e2a47] text-white"
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-white">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-[#0f1729] border-[#1e2a47] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2332] border-[#1e2a47]">
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sender Info */}
          <div className="space-y-4 border-t border-[#1e2a47] pt-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Icon name="User" size={18} />
              Sender Information
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Sender Name</Label>
                <Input
                  value={formData.sender_name}
                  onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                  className="bg-[#0f1729] border-[#1e2a47] text-white"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Sender Country</Label>
                <div className="relative">
                  <Input
                    value={formData.sender_country}
                    onChange={(e) => setFormData({ ...formData, sender_country: e.target.value })}
                    className="bg-[#0f1729] border-[#1e2a47] text-white pl-12"
                    placeholder="China"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl">
                    {getCountryFlag(formData.sender_country)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Sender Address</Label>
              <Input
                value={formData.sender_address}
                onChange={(e) => setFormData({ ...formData, sender_address: e.target.value })}
                className="bg-[#0f1729] border-[#1e2a47] text-white"
                placeholder="123 Main Street, Beijing"
                required
              />
            </div>
          </div>

          {/* Recipient Info */}
          <div className="space-y-4 border-t border-[#1e2a47] pt-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Icon name="MapPin" size={18} />
              Recipient Information
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Recipient Name</Label>
                <Input
                  value={formData.recipient_name}
                  onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                  className="bg-[#0f1729] border-[#1e2a47] text-white"
                  placeholder="Jane Smith"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Recipient Country</Label>
                <div className="relative">
                  <Input
                    value={formData.recipient_country}
                    onChange={(e) => setFormData({ ...formData, recipient_country: e.target.value })}
                    className="bg-[#0f1729] border-[#1e2a47] text-white pl-12"
                    placeholder="United States"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl">
                    {getCountryFlag(formData.recipient_country)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Recipient Address</Label>
              <Input
                value={formData.recipient_address}
                onChange={(e) => setFormData({ ...formData, recipient_address: e.target.value })}
                className="bg-[#0f1729] border-[#1e2a47] text-white"
                placeholder="456 Oak Avenue, New York"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-4 border-t border-[#1e2a47] pt-4">
            <div className="space-y-2">
              <Label className="text-white">Shipped Date</Label>
              <Input
                type="date"
                value={formData.shipped_date}
                onChange={(e) => setFormData({ ...formData, shipped_date: e.target.value })}
                className="bg-[#0f1729] border-[#1e2a47] text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Delivery Date</Label>
              <Input
                type="date"
                value={formData.delivery_date}
                onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                className="bg-[#0f1729] border-[#1e2a47] text-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end border-t border-[#1e2a47] pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="border-[#1e2a47] text-white">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb]">
              <Icon name={editingPackage ? 'Save' : 'Plus'} size={16} className="mr-2" />
              {editingPackage ? 'Update Package' : 'Create Package'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
