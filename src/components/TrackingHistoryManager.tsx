import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface TrackingEvent {
  id?: number;
  package_id: number;
  location: string;
  status: string;
  description: string;
  event_date: string;
}

interface TrackingHistoryManagerProps {
  open: boolean;
  onClose: () => void;
  packageId: number;
  trackingCode: string;
  apiUrl: string;
}

export function TrackingHistoryManager({ open, onClose, packageId, trackingCode, apiUrl }: TrackingHistoryManagerProps) {
  const [history, setHistory] = useState<TrackingEvent[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TrackingEvent | null>(null);
  const [formData, setFormData] = useState<Partial<TrackingEvent>>({
    location: '',
    status: '',
    description: '',
    event_date: new Date().toISOString().split('T')[0] + 'T12:00:00',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadHistory();
    }
  }, [open, packageId]);

  const loadHistory = async () => {
    try {
      const response = await fetch(`${apiUrl}?package_id=${packageId}`);
      const data = await response.json();
      if (data.success) {
        setHistory(data.history || []);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleAddEvent = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: packageId,
          ...formData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Event added successfully' });
        loadHistory();
        setShowAddForm(false);
        setFormData({
          location: '',
          status: '',
          description: '',
          event_date: new Date().toISOString().split('T')[0] + 'T12:00:00',
        });
      }
    } catch (error) {
      toast({ title: 'Failed to add event', variant: 'destructive' });
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent?.id) return;

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingEvent.id,
          ...formData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Event updated successfully' });
        loadHistory();
        setEditingEvent(null);
        setFormData({
          location: '',
          status: '',
          description: '',
          event_date: new Date().toISOString().split('T')[0] + 'T12:00:00',
        });
      }
    } catch (error) {
      toast({ title: 'Failed to update event', variant: 'destructive' });
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm('Delete this tracking event?')) return;

    try {
      const response = await fetch(`${apiUrl}?id=${eventId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Event deleted successfully' });
        loadHistory();
      }
    } catch (error) {
      toast({ title: 'Failed to delete event', variant: 'destructive' });
    }
  };

  const startEdit = (event: TrackingEvent) => {
    setEditingEvent(event);
    setFormData({
      location: event.location,
      status: event.status,
      description: event.description,
      event_date: event.event_date,
    });
    setShowAddForm(true);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a2332] border-[#1e2a47]">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Tracking History: {trackingCode}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button 
            onClick={() => {
              setShowAddForm(true);
              setEditingEvent(null);
              setFormData({
                location: '',
                status: '',
                description: '',
                event_date: new Date().toISOString().split('T')[0] + 'T12:00:00',
              });
            }}
            className="bg-[#3b82f6] hover:bg-[#2563eb]"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add Tracking Event
          </Button>

          {showAddForm && (
            <Card className="bg-[#0f1729] border-[#1e2a47] p-4 space-y-4">
              <h3 className="text-white font-semibold">
                {editingEvent ? 'Edit Event' : 'New Event'}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-[#1a2332] border-[#1e2a47] text-white"
                    placeholder="e.g., Beijing Distribution Center"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Status</Label>
                  <Input
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="bg-[#1a2332] border-[#1e2a47] text-white"
                    placeholder="e.g., In Transit"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-[#1a2332] border-[#1e2a47] text-white"
                  placeholder="Describe the tracking event..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Event Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.event_date?.replace('Z', '')}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="bg-[#1a2332] border-[#1e2a47] text-white"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                  className="bg-[#3b82f6] hover:bg-[#2563eb]"
                >
                  {editingEvent ? 'Update' : 'Add'} Event
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingEvent(null);
                  }}
                  className="border-[#1e2a47] text-white"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Icon name="Clock" size={48} className="mx-auto mb-3 opacity-50" />
                <p>No tracking events yet</p>
              </div>
            ) : (
              history.map((event) => (
                <Card key={event.id} className="bg-[#0f1729] border-[#1e2a47] p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <Icon name="MapPin" size={16} className="text-[#3b82f6]" />
                        <span className="text-white font-semibold">{event.location}</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-[#3b82f6]/20 text-[#3b82f6]">
                          {event.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm ml-7">{event.description}</p>
                      <p className="text-gray-500 text-xs ml-7">
                        {new Date(event.event_date).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEdit(event)}
                        className="text-white"
                      >
                        <Icon name="Edit" size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => event.id && handleDeleteEvent(event.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
