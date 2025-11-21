import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { Package } from '@/types/package';
import { CountryFlag } from '@/components/ui/country-flag';
import { useNavigate } from 'react-router-dom';

interface PackageManagementProps {
  packages: Package[];
  isLoading: boolean;
  onCreateNew: () => void;
  onEdit: (pkg: Package) => void;
  onDelete: (id: number) => void;
  statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'destructive' }>;
}

export function PackageManagement({ packages, isLoading, onCreateNew, onEdit, onDelete, statusMap }: PackageManagementProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Package Management</h2>
        <Button onClick={onCreateNew} size="lg" className="gap-2">
          <Icon name="Plus" size={18} />
          New Package
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Package" size={20} />
            All Packages
          </CardTitle>
          <CardDescription>Manage and track all packages in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Icon name="Package" size={48} className="mx-auto mb-4 text-primary animate-pulse" />
              <p className="text-muted-foreground">Loading packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="PackageOpen" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No packages found. Create your first package to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-mono font-medium">
                        <button
                          onClick={() => navigate(`/track/${pkg.tracking_code}`)}
                          className="hover:text-primary hover:underline"
                        >
                          {pkg.tracking_code}
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusMap[pkg.status]?.variant || 'secondary'}>
                          {statusMap[pkg.status]?.label || pkg.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{pkg.sender_name}</p>
                          <p className="text-xs text-muted-foreground">{pkg.sender_address}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{pkg.recipient_name}</p>
                          <p className="text-xs text-muted-foreground">{pkg.recipient_address}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <CountryFlag countryName={pkg.origin} />
                            <span className="text-xs">{pkg.origin}</span>
                          </div>
                          <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
                          <div className="flex items-center gap-1">
                            <CountryFlag countryName={pkg.destination} />
                            <span className="text-xs">{pkg.destination}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{pkg.weight} kg</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(pkg)}
                          >
                            <Icon name="Edit" size={14} />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(pkg.id)}
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
