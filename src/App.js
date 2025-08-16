import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    airlines: '',
    popularity: '',
    route: '',
    acft: '',
    wake: 'L',
    flBottom: '',
    flTop: '',
    status: 'Draft',
  });

  // Load routes from localStorage on component mount
  useEffect(() => {
    const savedRoutes = localStorage.getItem('flight-routes');
    if (savedRoutes) {
      setRoutes(JSON.parse(savedRoutes));
    }
  }, []);

  // Save routes to localStorage whenever routes change
  useEffect(() => {
    localStorage.setItem('flight-routes', JSON.stringify(routes));
  }, [routes]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddRoute = () => {
    if (!formData.airlines || !formData.route || !formData.acft) {
      alert('Please fill in all required fields');
      return;
    }

    const newRoute = {
      id: Math.random().toString(36).substr(2, 9),
      airlines: formData.airlines,
      popularity: parseInt(formData.popularity) || 0,
      route: formData.route,
      acft: formData.acft,
      wake: formData.wake,
      flBottom: parseInt(formData.flBottom) || 0,
      flTop: parseInt(formData.flTop) || 0,
      status: formData.status,
      createdAt: new Date().toISOString(),
    };

    setRoutes(prev => [newRoute, ...prev]);
    
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

  const handleDeleteRoute = (id) => {
    setRoutes(prev => prev.filter(route => route.id !== id));
  };

  const filteredRoutes = routes.filter(route =>
    route.airlines.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.acft.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Flight Route Manager</h1>
          <p className="text-gray-600">Manage and organize your flight routes</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4">Add New Route</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Airlines *</label>
              <input
                type="text"
                placeholder="e.g., SAS, NOZ"
                value={formData.airlines}
                onChange={(e) => handleInputChange('airlines', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Popularity</label>
              <input
                type="number"
                placeholder="0-100"
                value={formData.popularity}
                onChange={(e) => handleInputChange('popularity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Route *</label>
              <input
                type="text"
                placeholder="e.g., ARS N623 BEDLA N866 MOXAM"
                value={formData.route}
                onChange={(e) => handleInputChange('route', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aircraft *</label>
              <input
                type="text"
                placeholder="e.g., A320, B738"
                value={formData.acft}
                onChange={(e) => handleInputChange('acft', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wake Category</label>
              <select
                value={formData.wake}
                onChange={(e) => handleInputChange('wake', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="L">L</option>
                <option value="M">M</option>
                <option value="H">H</option>
                <option value="J">J</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FL Bottom</label>
              <input
                type="number"
                placeholder="e.g., 100"
                value={formData.flBottom}
                onChange={(e) => handleInputChange('flBottom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FL Top</label>
              <input
                type="number"
                placeholder="e.g., 430"
                value={formData.flTop}
                onChange={(e) => handleInputChange('flTop', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Draft">Draft</option>
                <option value="Validated">Validated</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleAddRoute}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Route
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by Airlines, Route, or Aircraft..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4">Routes ({filteredRoutes.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Airlines</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Popularity</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Route</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Aircraft</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Wake</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">FL Bottom</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">FL Top</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">{route.airlines}</td>
                    <td className="border border-gray-300 px-4 py-2">{route.popularity}</td>
                    <td className="border border-gray-300 px-4 py-2">{route.route}</td>
                    <td className="border border-gray-300 px-4 py-2">{route.acft}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {route.wake}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">FL{route.flBottom}</td>
                    <td className="border border-gray-300 px-4 py-2">FL{route.flTop}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        route.status === 'Validated' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {route.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleDeleteRoute(route.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRoutes.length === 0 && (
                  <tr>
                    <td colSpan={9} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      No routes found. Add your first route above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 