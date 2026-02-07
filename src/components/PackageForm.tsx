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

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
];

const generateTrackingCode = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `ZV${year}${random}`;
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

  const getCountryFlag = (countryName: string) => {
    const country = countries.find(c => c.name === countryName);
    return country?.flag || '🌍';
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
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Sender Country</Label>
                <Select 
                  value={formData.sender_country} 
                  onValueChange={(value) => setFormData({ ...formData, sender_country: value })}
                >
                  <SelectTrigger className="bg-[#0f1729] border-[#1e2a47] text-white">
                    <SelectValue placeholder="Select country">
                      {formData.sender_country && (
                        <span className="flex items-center gap-2">
                          <span>{getCountryFlag(formData.sender_country)}</span>
                          <span>{formData.sender_country}</span>
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2332] border-[#1e2a47]">
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.name}>
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Sender Address</Label>
              <Input
                value={formData.sender_address}
                onChange={(e) => setFormData({ ...formData, sender_address: e.target.value })}
                className="bg-[#0f1729] border-[#1e2a47] text-white"
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
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Recipient Country</Label>
                <Select 
                  value={formData.recipient_country} 
                  onValueChange={(value) => setFormData({ ...formData, recipient_country: value })}
                >
                  <SelectTrigger className="bg-[#0f1729] border-[#1e2a47] text-white">
                    <SelectValue placeholder="Select country">
                      {formData.recipient_country && (
                        <span className="flex items-center gap-2">
                          <span>{getCountryFlag(formData.recipient_country)}</span>
                          <span>{formData.recipient_country}</span>
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2332] border-[#1e2a47]">
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.name}>
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Recipient Address</Label>
              <Input
                value={formData.recipient_address}
                onChange={(e) => setFormData({ ...formData, recipient_address: e.target.value })}
                className="bg-[#0f1729] border-[#1e2a47] text-white"
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
