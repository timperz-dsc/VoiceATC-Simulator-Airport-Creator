import React, { useState, useMemo } from 'react';
import { FlightRoute, SortField, SortDirection, SortConfig } from '../types/route';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Search, ArrowUpDown, Trash2 } from 'lucide-react';

const WAKE_CATEGORIES = ['L', 'M', 'H', 'J'] as const;
const STATUS_OPTIONS = ['Validated', 'Draft'] as const;

export function RouteManager() {
  const [routes, setRoutes] = useLocalStorage<FlightRoute[]>('flight-routes', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'createdAt', direction: 'desc' });

  // Form state
  const [formData, setFormData] = useState({
    airlines: '',
    popularity: '',
    route: '',
    acft: '',
    wake: 'L' as const,
    flBottom: '',
    flTop: '',
    status: 'Draft' as const,
  });

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Add new route
  const handleAddRoute = () => {
    if (!formData.airlines || !formData.route || !formData.acft) {
      alert('Please fill in all required fields');
      return;
    }

    const newRoute: FlightRoute = {
      id: generateId(),
      airlines: formData.airlines,
      popularity: parseInt(formData.popularity) || 0,
      route: formData.route,
      acft: formData.acft,
      wake: formData.wake,
      flBottom: parseInt(formData.flBottom) || 0,
      flTop: parseInt(formData.flTop) || 0,
      status: formData.status,
      createdAt: new Date(),
    };

    setRoutes(prev => [newRoute, ...prev]);
    
    // Reset form
    setFormData({
      airlines: '',
      popularity: '',
      route: '',
      acft: '',
      wake: 'L',
      flBottom: '',
      flTop: '',
      status: 'Draft',
    });
  };

  // Delete route
  const handleDeleteRoute = (id: string) => {
    setRoutes(prev => prev.filter(route => route.id !== id));
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Filter and sort routes
  const filteredAndSortedRoutes = useMemo(() => {
    let filtered = routes.filter(route =>
      route.airlines.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.acft.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      return 0;
    });

    return filtered;
  }, [routes, searchTerm, sortConfig]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Flight Route Manager</h1>
        <p className="text-gray-600">Manage and organize your flight routes</p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Route</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Airlines *</label>
              <Input
                placeholder="e.g., SAS, Norwegian"
                value={formData.airlines}
                onChange={(e) => handleInputChange('airlines', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Popularity</label>
              <Input
                type="number"
                placeholder="0-100"
                value={formData.popularity}
                onChange={(e) => handleInputChange('popularity', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Route *</label>
              <Input
                placeholder="e.g., ARN-CPH"
                value={formData.route}
                onChange={(e) => handleInputChange('route', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aircraft *</label>
              <Input
                placeholder="e.g., A320, B738"
                value={formData.acft}
                onChange={(e) => handleInputChange('acft', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wake Category</label>
              <Select value={formData.wake} onValueChange={(value) => handleInputChange('wake', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WAKE_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FL Bottom</label>
              <Input
                type="number"
                placeholder="e.g., 100"
                value={formData.flBottom}
                onChange={(e) => handleInputChange('flBottom', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FL Top</label>
              <Input
                type="number"
                placeholder="e.g., 430"
                value={formData.flTop}
                onChange={(e) => handleInputChange('flTop', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-6">
            <Button onClick={handleAddRoute} className="w-full md:w-auto">
              Add Route
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by Airlines, Route, or Aircraft..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Routes ({filteredAndSortedRoutes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('airlines')}
                  >
                    <div className="flex items-center gap-1">
                      Airlines
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('popularity')}
                  >
                    <div className="flex items-center gap-1">
                      Popularity
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('route')}
                  >
                    <div className="flex items-center gap-1">
                      Route
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('acft')}
                  >
                    <div className="flex items-center gap-1">
                      Aircraft
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('wake')}
                  >
                    <div className="flex items-center gap-1">
                      Wake
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('flBottom')}
                  >
                    <div className="flex items-center gap-1">
                      FL Bottom
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('flTop')}
                  >
                    <div className="flex items-center gap-1">
                      FL Top
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.airlines}</TableCell>
                    <TableCell>{route.popularity}</TableCell>
                    <TableCell>{route.route}</TableCell>
                    <TableCell>{route.acft}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{route.wake}</Badge>
                    </TableCell>
                    <TableCell>FL{route.flBottom}</TableCell>
                    <TableCell>FL{route.flTop}</TableCell>
                    <TableCell>
                      <Badge variant={route.status === 'Validated' ? 'default' : 'secondary'}>
                        {route.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteRoute(route.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAndSortedRoutes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                      No routes found. Add your first route above!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 