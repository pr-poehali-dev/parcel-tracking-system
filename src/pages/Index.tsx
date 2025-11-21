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

const API_URL = 'https://functions.poehali.dev/6658ccf3-0414-4954-aeaf-62baa6ff8277';

interface Parcel {
  id: number;
  tracking_code: string;
  recipient_first_name: string;
  recipient_last_name: string;
  recipient_address: string;
  current_location: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'destructive' }> = {
  pending: { label: 'Принята', variant: 'secondary' },
  in_transit: { label: 'В пути', variant: 'default' },
  ready_for_pickup: { label: 'Готова к выдаче', variant: 'success' },
  delivered: { label: 'Доставлена', variant: 'success' },
};

export default function Index() {
  const [trackingCode, setTrackingCode] = useState('');
  const [searchResult, setSearchResult] = useState<Parcel | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const [adminView, setAdminView] = useState(false);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!trackingCode.trim()) {
      setSearchError('Введите трек-код');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setSearchResult(null);

    try {
      const response = await fetch(`${API_URL}?tracking_code=${trackingCode}`);
      const data = await response.json();

      if (response.ok) {
        setSearchResult(data);
      } else {
        setSearchError('Посылка не найдена');
      }
    } catch (error) {
      setSearchError('Ошибка поиска');
    } finally {
      setIsSearching(false);
    }
  };

  const loadParcels = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setParcels(data);
    } catch (error) {
      toast({ title: 'Ошибка загрузки', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateParcel = async (formData: Partial<Parcel>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({ title: 'Посылка создана' });
        setIsDialogOpen(false);
        loadParcels();
      }
    } catch (error) {
      toast({ title: 'Ошибка создания', variant: 'destructive' });
    }
  };

  const handleUpdateParcel = async (formData: Parcel) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({ title: 'Посылка обновлена' });
        setIsDialogOpen(false);
        setEditingParcel(null);
        loadParcels();
      }
    } catch (error) {
      toast({ title: 'Ошибка обновления', variant: 'destructive' });
    }
  };

  const handleDeleteParcel = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({ title: 'Посылка удалена' });
        loadParcels();
      }
    } catch (error) {
      toast({ title: 'Ошибка удаления', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Package" size={32} className="text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Aboba Express</h1>
                <p className="text-sm text-muted-foreground">Служба доставки посылок</p>
              </div>
            </div>
            <Button
              variant={adminView ? 'default' : 'outline'}
              onClick={() => {
                setAdminView(!adminView);
                if (!adminView) loadParcels();
              }}
              className="gap-2"
            >
              <Icon name={adminView ? 'Search' : 'Settings'} size={18} />
              {adminView ? 'Отслеживание' : 'Админ-панель'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {!adminView ? (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-foreground">Отследите вашу посылку</h2>
              <p className="text-lg text-muted-foreground">Введите трек-код для получения информации о статусе доставки</p>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Search" size={24} />
                  Поиск по трек-коду
                </CardTitle>
                <CardDescription>Формат: AB2024XXXXXX</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Введите трек-код"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="text-lg"
                  />
                  <Button onClick={handleSearch} disabled={isSearching} size="lg" className="gap-2">
                    <Icon name="Search" size={18} />
                    {isSearching ? 'Поиск...' : 'Найти'}
                  </Button>
                </div>

                {searchError && (
                  <div className="flex items-center gap-2 text-destructive animate-fade-in">
                    <Icon name="AlertCircle" size={18} />
                    <span>{searchError}</span>
                  </div>
                )}

                {searchResult && (
                  <Card className="border-primary/20 bg-primary/5 animate-scale-in">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">{searchResult.tracking_code}</CardTitle>
                        <Badge variant={statusMap[searchResult.status]?.variant || 'default'}>
                          {statusMap[searchResult.status]?.label || searchResult.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4">
                        <div className="flex items-start gap-3">
                          <Icon name="User" size={20} className="text-muted-foreground mt-1" />
                          <div>
                            <p className="text-sm text-muted-foreground">Получатель</p>
                            <p className="font-medium">
                              {searchResult.recipient_first_name} {searchResult.recipient_last_name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Icon name="MapPin" size={20} className="text-muted-foreground mt-1" />
                          <div>
                            <p className="text-sm text-muted-foreground">Адрес доставки</p>
                            <p className="font-medium">{searchResult.recipient_address}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Icon name="Truck" size={20} className="text-muted-foreground mt-1" />
                          <div>
                            <p className="text-sm text-muted-foreground">Текущее местоположение</p>
                            <p className="font-medium text-primary">{searchResult.current_location}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Icon name="Calendar" size={20} className="text-muted-foreground mt-1" />
                          <div>
                            <p className="text-sm text-muted-foreground">Создана</p>
                            <p className="font-medium">{new Date(searchResult.created_at).toLocaleString('ru-RU')}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">Тестовые трек-коды: AB2024001, AB2024002, AB2024003</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Управление посылками</h2>
                <p className="text-muted-foreground">Создавайте и редактируйте информацию о посылках</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingParcel(null)} className="gap-2">
                    <Icon name="Plus" size={18} />
                    Создать посылку
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingParcel ? 'Редактировать посылку' : 'Новая посылка'}</DialogTitle>
                    <DialogDescription>
                      {editingParcel ? 'Обновите данные посылки' : 'Трек-код будет сгенерирован автоматически'}
                    </DialogDescription>
                  </DialogHeader>
                  <ParcelForm
                    parcel={editingParcel}
                    onSubmit={editingParcel ? handleUpdateParcel : handleCreateParcel}
                    onCancel={() => {
                      setIsDialogOpen(false);
                      setEditingParcel(null);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <Card className="shadow-lg">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Icon name="Loader2" size={32} className="animate-spin text-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Трек-код</TableHead>
                        <TableHead>Получатель</TableHead>
                        <TableHead>Адрес</TableHead>
                        <TableHead>Местоположение</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parcels.map((parcel) => (
                        <TableRow key={parcel.id}>
                          <TableCell className="font-mono font-medium">{parcel.tracking_code}</TableCell>
                          <TableCell>
                            {parcel.recipient_first_name} {parcel.recipient_last_name}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{parcel.recipient_address}</TableCell>
                          <TableCell>{parcel.current_location}</TableCell>
                          <TableCell>
                            <Badge variant={statusMap[parcel.status]?.variant || 'default'}>
                              {statusMap[parcel.status]?.label || parcel.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingParcel(parcel);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Icon name="Pencil" size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteParcel(parcel.id)}
                              >
                                <Icon name="Trash2" size={16} />
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

function ParcelForm({
  parcel,
  onSubmit,
  onCancel,
}: {
  parcel: Parcel | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    id: parcel?.id || 0,
    recipient_first_name: parcel?.recipient_first_name || '',
    recipient_last_name: parcel?.recipient_last_name || '',
    recipient_address: parcel?.recipient_address || '',
    current_location: parcel?.current_location || '',
    status: parcel?.status || 'pending',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Имя получателя</Label>
          <Input
            id="first_name"
            value={formData.recipient_first_name}
            onChange={(e) => setFormData({ ...formData, recipient_first_name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Фамилия получателя</Label>
          <Input
            id="last_name"
            value={formData.recipient_last_name}
            onChange={(e) => setFormData({ ...formData, recipient_last_name: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Адрес доставки</Label>
        <Textarea
          id="address"
          value={formData.recipient_address}
          onChange={(e) => setFormData({ ...formData, recipient_address: e.target.value })}
          required
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Текущее местоположение</Label>
        <Input
          id="location"
          value={formData.current_location}
          onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Статус</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Принята</SelectItem>
            <SelectItem value="in_transit">В пути</SelectItem>
            <SelectItem value="ready_for_pickup">Готова к выдаче</SelectItem>
            <SelectItem value="delivered">Доставлена</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit">{parcel ? 'Обновить' : 'Создать'}</Button>
      </div>
    </form>
  );
}
