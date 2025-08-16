import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('airlines');
  const [sortDirection, setSortDirection] = useState('asc');
  const [formData, setFormData] = useState({
    airlines: '',
    popularity: '',
    route: '',
    acft: '',
    wake: 'L',
    flBottom: '',
    flTop: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

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

  // Validation functions
  const validateAirlines = (value) => {
    return /^[A-Za-z\s]+$/.test(value);
  };

  const validatePopularity = (value) => {
    return /^[0-9.]*$/.test(value);
  };

  const validateFL = (value) => {
    return /^[0-9]*$/.test(value);
  };

  const handleInputChange = (field, value) => {
    let filteredValue = value;
    
    // Apply real-time validation based on field type
    switch (field) {
      case 'airlines':
        // Only allow letters and spaces, convert to uppercase
        filteredValue = value.replace(/[^A-Za-z\s]/g, '').toUpperCase();
        break;
      case 'popularity':
        // Only allow numbers and decimal points
        filteredValue = value.replace(/[^0-9.]/g, '');
        // Prevent multiple decimal points
        const decimalCount = (filteredValue.match(/\./g) || []).length;
        if (decimalCount > 1) {
          const parts = filteredValue.split('.');
          filteredValue = parts[0] + '.' + parts.slice(1).join('');
        }
        break;
      case 'route':
        // Convert to uppercase for route field
        filteredValue = value.toUpperCase();
        break;
      case 'acft':
        // Convert to uppercase for aircraft field
        filteredValue = value.toUpperCase();
        break;
      case 'flBottom':
      case 'flTop':
        // Only allow numbers
        filteredValue = value.replace(/[^0-9]/g, '');
        break;
      default:
        // For other fields (wake), allow any input
        break;
    }
    
    setFormData(prev => ({ ...prev, [field]: filteredValue }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleAddRoute = () => {
    // Check if all required fields are filled
    const requiredFields = ['airlines', 'popularity', 'route', 'acft', 'wake', 'flBottom', 'flTop'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      // Set validation errors for empty fields
      const errors = {};
      emptyFields.forEach(field => {
        errors[field] = true;
      });
      setValidationErrors(errors);
      return;
    }

    // Additional validation for final check
    if (!validateAirlines(formData.airlines)) {
      alert('Airlines field can only contain letters and spaces');
      return;
    }

    if (!validatePopularity(formData.popularity)) {
      alert('Popularity field can only contain numbers and decimal points');
      return;
    }

    if (!validateFL(formData.flBottom)) {
      alert('FL Bottom field can only contain numbers');
      return;
    }

    if (!validateFL(formData.flTop)) {
      alert('FL Top field can only contain numbers');
      return;
    }

    const newRoute = {
      id: Math.random().toString(36).substr(2, 9),
      airlines: formData.airlines,
      popularity: parseFloat(formData.popularity) || 0,
      route: formData.route,
      acft: formData.acft,
      wake: formData.wake,
      flBottom: parseInt(formData.flBottom) || 0,
      flTop: parseInt(formData.flTop) || 0,
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
    });
    
    // Clear all validation errors
    setValidationErrors({});
  };

  const handleDeleteRoute = (id) => {
    setRoutes(prev => prev.filter(route => route.id !== id));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // If clicking the same field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new field, set it as sort field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedRoutes = (routesToSort) => {
    if (!sortField) return routesToSort;

    return [...routesToSort].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle numeric fields
      if (sortField === 'popularity' || sortField === 'flBottom' || sortField === 'flTop') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else {
        // Handle string fields
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const filteredRoutes = getSortedRoutes(routes.filter(route =>
    route.airlines.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.acft.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const getInputStyle = (fieldName) => {
    const baseStyle = {
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease-in-out',
    };
    
    if (validationErrors[fieldName]) {
      return {
        ...baseStyle,
        border: '2px solid #dc2626',
        boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1), 0 0 0 1px rgba(220, 38, 38, 0.2)',
        outline: 'none',
      };
    }
    
    return baseStyle;
  };

  const getSelectStyle = (fieldName) => {
    const baseStyle = {
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: 'white',
      fontFamily: 'Inter, sans-serif',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease-in-out',
    };
    
    if (validationErrors[fieldName]) {
      return {
        ...baseStyle,
        border: '2px solid #dc2626',
        boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1), 0 0 0 1px rgba(220, 38, 38, 0.2)',
        outline: 'none',
      };
    }
    
    return baseStyle;
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '16px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      boxSizing: 'border-box',
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    logo: {
      width: '64px',
      height: '64px',
      margin: '0 auto 16px',
      display: 'block',
    },
    title: {
      fontSize: 'clamp(24px, 4vw, 36px)',
      fontWeight: '700',
      color: '#0B1E39',
      marginBottom: '8px',
      fontFamily: 'Inter, sans-serif',
    },
    subtitle: {
      color: '#6b7280',
      fontSize: 'clamp(14px, 2.5vw, 18px)',
      fontFamily: 'Inter, sans-serif',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      padding: '20px',
      marginBottom: '24px',
      boxSizing: 'border-box',
      width: '100%',
    },
    cardTitle: {
      fontSize: 'clamp(18px, 3vw, 24px)',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#0B1E39',
      fontFamily: 'Inter, sans-serif',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: '0',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '4px',
      fontFamily: 'Inter, sans-serif',
    },
    input: {
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      width: '100%',
      boxSizing: 'border-box',
    },
    select: {
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: 'white',
      fontFamily: 'Inter, sans-serif',
      width: '100%',
      boxSizing: 'border-box',
    },
    button: {
      backgroundColor: '#0B1E39',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      width: 'fit-content',
    },
    searchContainer: {
      position: 'relative',
      width: '100%',
    },
    searchInput: {
      width: '100%',
      padding: '12px 12px 12px 48px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      boxSizing: 'border-box',
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      fontSize: '20px',
      pointerEvents: 'none',
    },
    tableContainer: {
      width: '100%',
      overflowX: 'auto',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '800px',
    },
    tableHeader: {
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #d1d5db',
    },
    tableCell: {
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      textAlign: 'left',
      fontFamily: 'Inter, sans-serif',
      whiteSpace: 'nowrap',
    },
    tableRow: {
      borderBottom: '1px solid #d1d5db',
    },
    tableRowHover: {
      backgroundColor: '#f9fafb',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '500',
      fontFamily: 'Inter, sans-serif',
    },
    badgeGray: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
    },
    deleteButton: {
      backgroundColor: '#dc2626',
      color: 'white',
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '12px',
      cursor: 'pointer',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      whiteSpace: 'nowrap',
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px',
      color: '#6b7280',
      fontFamily: 'Inter, sans-serif',
    },
    sortableHeader: {
      cursor: 'pointer',
      userSelect: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'color 0.2s ease-in-out',
    },
    sortableHeaderHover: {
      color: '#0B1E39',
    },
    sortIcon: {
      fontSize: '16px',
      color: '#9ca3af',
      transition: 'color 0.2s ease-in-out',
    },
    sortIconActive: {
      color: '#0B1E39',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <svg style={styles.logo} xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" role="img" aria-label="Route icon">
          <rect x="2" y="2" width="60" height="60" rx="14" fill="#0B1E39"/>
          <path d="M14 46 L28 32 L40 38 L50 18" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="14" cy="46" r="4" fill="#0B1E39" stroke="#FFFFFF" strokeWidth="4"/>
          <circle cx="28" cy="32" r="4" fill="#0B1E39" stroke="#FFFFFF" strokeWidth="4"/>
          <circle cx="50" cy="18" r="4" fill="#0B1E39" stroke="#FFFFFF" strokeWidth="4"/>
        </svg>
        <h1 style={styles.title}>VoiceATC Airport Creator</h1>
        <p style={styles.subtitle}>Manage and organize your flight routes</p>
      </div>

      {/* Input Section */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Add New Route</h2>
        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Airlines</label>
            <input
              type="text"
              placeholder="SAS, NOZ"
              value={formData.airlines}
              onChange={(e) => handleInputChange('airlines', e.target.value)}
              style={getInputStyle('airlines')}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Popularity</label>
            <input
              type="text"
              placeholder="0-100"
              value={formData.popularity}
              onChange={(e) => handleInputChange('popularity', e.target.value)}
              style={getInputStyle('popularity')}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Route</label>
            <input
              type="text"
              placeholder="BABAP T316 VSB"
              value={formData.route}
              onChange={(e) => handleInputChange('route', e.target.value)}
              style={getInputStyle('route')}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Aircraft</label>
            <input
              type="text"
              placeholder="e.g., A320, B738"
              value={formData.acft}
              onChange={(e) => handleInputChange('acft', e.target.value)}
              style={getInputStyle('acft')}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Wake Category</label>
            <select
              value={formData.wake}
              onChange={(e) => handleInputChange('wake', e.target.value)}
              style={getSelectStyle('wake')}
            >
              <option value="L">L</option>
              <option value="M">M</option>
              <option value="H">H</option>
              <option value="J">J</option>
            </select>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>FL Bottom</label>
            <input
              type="text"
              placeholder="e.g., 100"
              value={formData.flBottom}
              onChange={(e) => handleInputChange('flBottom', e.target.value)}
              style={getInputStyle('flBottom')}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>FL Top</label>
            <input
              type="text"
              placeholder="e.g., 430"
              value={formData.flTop}
              onChange={(e) => handleInputChange('flTop', e.target.value)}
              style={getInputStyle('flTop')}
            />
          </div>
        </div>
        
        <button onClick={handleAddRoute} style={styles.button}>
          <span className="material-icons">add</span>
          Add Route
        </button>
      </div>

      {/* Table Section */}
      <div style={styles.card}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '24px'}}>
          <h2 style={styles.cardTitle}>Routes</h2>
          <div style={styles.searchContainer}>
            <span className="material-icons" style={styles.searchIcon}>search</span>
            <input
              type="text"
              placeholder="Search by Airlines, Route, or Aircraft..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th 
                  style={styles.tableCell}
                  onClick={() => handleSort('airlines')}
                  onMouseEnter={(e) => e.target.style.color = styles.sortableHeaderHover.color}
                  onMouseLeave={(e) => e.target.style.color = ''}
                >
                  <div style={styles.sortableHeader}>
                    Airlines
                    <span 
                      className="material-icons" 
                      style={{
                        ...styles.sortIcon,
                        ...(sortField === 'airlines' ? styles.sortIconActive : {}),
                        transform: sortField === 'airlines' && sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                      }}
                    >
                      {sortField === 'airlines' ? 'keyboard_arrow_up' : 'unfold_more'}
                    </span>
                  </div>
                </th>
                <th 
                  style={styles.tableCell}
                  onClick={() => handleSort('popularity')}
                  onMouseEnter={(e) => e.target.style.color = styles.sortableHeaderHover.color}
                  onMouseLeave={(e) => e.target.style.color = ''}
                >
                  <div style={styles.sortableHeader}>
                    Popularity
                    <span 
                      className="material-icons" 
                      style={{
                        ...styles.sortIcon,
                        ...(sortField === 'popularity' ? styles.sortIconActive : {}),
                        transform: sortField === 'popularity' && sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                      }}
                    >
                      {sortField === 'popularity' ? 'keyboard_arrow_up' : 'unfold_more'}
                    </span>
                  </div>
                </th>
                <th 
                  style={styles.tableCell}
                  onClick={() => handleSort('route')}
                  onMouseEnter={(e) => e.target.style.color = styles.sortableHeaderHover.color}
                  onMouseLeave={(e) => e.target.style.color = ''}
                >
                  <div style={styles.sortableHeader}>
                    Route
                    <span 
                      className="material-icons" 
                      style={{
                        ...styles.sortIcon,
                        ...(sortField === 'route' ? styles.sortIconActive : {}),
                        transform: sortField === 'route' && sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                      }}
                    >
                      {sortField === 'route' ? 'keyboard_arrow_up' : 'unfold_more'}
                    </span>
                  </div>
                </th>
                <th 
                  style={styles.tableCell}
                  onClick={() => handleSort('acft')}
                  onMouseEnter={(e) => e.target.style.color = styles.sortableHeaderHover.color}
                  onMouseLeave={(e) => e.target.style.color = ''}
                >
                  <div style={styles.sortableHeader}>
                    Aircraft
                    <span 
                      className="material-icons" 
                      style={{
                        ...styles.sortIcon,
                        ...(sortField === 'acft' ? styles.sortIconActive : {}),
                        transform: sortField === 'acft' && sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                      }}
                    >
                      {sortField === 'acft' ? 'keyboard_arrow_up' : 'unfold_more'}
                    </span>
                  </div>
                </th>
                <th 
                  style={styles.tableCell}
                  onClick={() => handleSort('wake')}
                  onMouseEnter={(e) => e.target.style.color = styles.sortableHeaderHover.color}
                  onMouseLeave={(e) => e.target.style.color = ''}
                >
                  <div style={styles.sortableHeader}>
                    Wake
                    <span 
                      className="material-icons" 
                      style={{
                        ...styles.sortIcon,
                        ...(sortField === 'wake' ? styles.sortIconActive : {}),
                        transform: sortField === 'wake' && sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                      }}
                    >
                      {sortField === 'wake' ? 'keyboard_arrow_up' : 'unfold_more'}
                    </span>
                  </div>
                </th>
                <th 
                  style={styles.tableCell}
                  onClick={() => handleSort('flBottom')}
                  onMouseEnter={(e) => e.target.style.color = styles.sortableHeaderHover.color}
                  onMouseLeave={(e) => e.target.style.color = ''}
                >
                  <div style={styles.sortableHeader}>
                    FL Bottom
                    <span 
                      className="material-icons" 
                      style={{
                        ...styles.sortIcon,
                        ...(sortField === 'flBottom' ? styles.sortIconActive : {}),
                        transform: sortField === 'flBottom' && sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                      }}
                    >
                      {sortField === 'flBottom' ? 'keyboard_arrow_up' : 'unfold_more'}
                    </span>
                  </div>
                </th>
                <th 
                  style={styles.tableCell}
                  onClick={() => handleSort('flTop')}
                  onMouseEnter={(e) => e.target.style.color = styles.sortableHeaderHover.color}
                  onMouseLeave={(e) => e.target.style.color = ''}
                >
                  <div style={styles.sortableHeader}>
                    FL Top
                    <span 
                      className="material-icons" 
                      style={{
                        ...styles.sortIcon,
                        ...(sortField === 'flTop' ? styles.sortIconActive : {}),
                        transform: sortField === 'flTop' && sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                      }}
                    >
                      {sortField === 'flTop' ? 'keyboard_arrow_up' : 'unfold_more'}
                    </span>
                  </div>
                </th>
                <th style={styles.tableCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((route) => (
                <tr key={route.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{route.airlines}</td>
                  <td style={styles.tableCell}>{route.popularity}</td>
                  <td style={styles.tableCell}>{route.route}</td>
                  <td style={styles.tableCell}>{route.acft}</td>
                  <td style={styles.tableCell}>
                    <span style={{...styles.badge, ...styles.badgeGray}}>
                      {route.wake}
                    </span>
                  </td>
                  <td style={styles.tableCell}>FL{route.flBottom}</td>
                  <td style={styles.tableCell}>FL{route.flTop}</td>
                  <td style={styles.tableCell}>
                    <button
                      onClick={() => handleDeleteRoute(route.id)}
                      style={styles.deleteButton}
                    >
                      <span className="material-icons" style={{fontSize: '16px'}}>delete</span>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRoutes.length === 0 && (
                <tr>
                  <td colSpan={8} style={styles.emptyState}>
                    No routes found. Add your first route above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App; 