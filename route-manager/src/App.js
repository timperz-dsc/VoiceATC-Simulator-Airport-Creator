import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('airlines');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentView, setCurrentView] = useState('welcome');
  const [airports, setAirports] = useState([]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameInputType, setNameInputType] = useState('');
  const [nameInputValue, setNameInputValue] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [modalAnimating, setModalAnimating] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState('');
  const [settingsSearchTerm, setSettingsSearchTerm] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [airportToDelete, setAirportToDelete] = useState(null);
  const [showAirportsDropdown, setShowAirportsDropdown] = useState(false);
  const [settingsPage, setSettingsPage] = useState('airports');
  const [previousView, setPreviousView] = useState('welcome');
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateAirportName, setDuplicateAirportName] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    airlines: '',
    airport: '',
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

  // Load airports from localStorage on component mount
  useEffect(() => {
    const savedAirports = localStorage.getItem('airports');
    if (savedAirports) {
      setAirports(JSON.parse(savedAirports));
    }
  }, []);

  // Save routes to localStorage whenever routes change
  useEffect(() => {
    localStorage.setItem('flight-routes', JSON.stringify(routes));
  }, [routes]);

  // Save airports to localStorage whenever airports change
  useEffect(() => {
    localStorage.setItem('airports', JSON.stringify(airports));
  }, [airports]);

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

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleInputChange = (field, value) => {
    let filteredValue = value;
    
    // Apply real-time validation based on field type
    switch (field) {
      case 'airlines':
        // Only allow letters and spaces, convert to uppercase
        filteredValue = value.replace(/[^A-Za-z\s]/g, '').toUpperCase();
        break;
      case 'airport':
        // Only allow letters and numbers, convert to uppercase
        filteredValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
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
    const requiredFields = ['airlines', 'airport', 'popularity', 'route', 'acft', 'wake', 'flBottom', 'flTop'];
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
      airport: formData.airport,
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
      airport: '',
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

  const handleNavigation = (view) => {
    if (currentView === view) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setShowNameInput(false);
      setNameInputValue('');
      setIsTransitioning(false);
    }, 100); // Shorter delay for better feel
  };

  const handleLogoClick = () => {
    if (currentView === 'welcome') return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView('welcome');
      setShowNameInput(false);
      setNameInputValue('');
      setIsTransitioning(false);
    }, 150);
  };

  const handleNameInput = (type) => {
    setModalAnimating(true);
    setTimeout(() => {
      setShowNameInput(true);
      setTimeout(() => {
        setModalAnimating(false);
      }, 150);
    }, 50);
    setNameInputType(type);
    setNameInputValue('');
    setPreviousView(currentView);
  };

  const handleNameInputChange = (value) => {
    // Only allow letters, convert to uppercase, max 4 characters
    const filteredValue = value.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4);
    setNameInputValue(filteredValue);
  };

  const handleClickOutside = (event) => {
    // Close dropdown if clicking outside
    if (showAirportsDropdown && !event.target.closest('[data-dropdown]')) {
      setShowAirportsDropdown(false);
    }
  };

  // Add click outside listener
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showAirportsDropdown]);

  // Test function to verify button animation works
  // const testButtonAnimation = (type) => { // Removed
  //   setButtonAnimating(type); // Removed
  //   setTimeout(() => { // Removed
  //     setButtonAnimating(''); // Removed
  //   }, 200); // Removed
  // }; // Removed

  const handleNameSubmit = () => {
    if (!nameInputValue.trim()) {
      showNotification('Please enter an airport name!', 'error');
      return;
    }
    
    if (nameInputValue.trim()) {
      const airportName = nameInputValue.trim().toUpperCase();
      
      // Check if airport with this ICAO already exists
      const existingAirport = airports.find(airport => airport.name === airportName);
      if (existingAirport) {
        handleDuplicateWarning(airportName);
        return;
      }
      
      const newAirport = {
        id: Date.now().toString(),
        name: airportName,
        createdAt: new Date().toISOString()
      };
      
      const updatedAirports = [...airports, newAirport];
      setAirports(updatedAirports);
      localStorage.setItem('airports', JSON.stringify(updatedAirports));
      
      setShowNameInput(false);
      setNameInputValue('');
      setSelectedAirport(newAirport.id);
      
      // Show success notification
      showNotification(`Airport ${airportName} created successfully!`);
      
      // Only show animation if going to a different view
      if (currentView !== previousView) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentView(previousView);
          setIsTransitioning(false);
        }, 150);
      } else {
        // If staying on the same page, just update the view without animation
        setCurrentView(previousView);
      }
    }
  };

  const handleNameCancel = () => {
    setShowNameInput(false);
    setNameInputValue('');
  };

  const handleDeleteAirport = (airportId) => {
    const airport = airports.find(a => a.id === airportId);
    setAirportToDelete(airport);
    setShowConfirmDelete(true);
  };

  const confirmDeleteAirport = () => {
    if (airportToDelete) {
      setAirports(prev => prev.filter(airport => airport.id !== airportToDelete.id));
      if (selectedAirport === airportToDelete.id) {
        setSelectedAirport('');
      }
      setShowConfirmDelete(false);
      setAirportToDelete(null);
    }
  };

  const cancelDeleteAirport = () => {
    setShowConfirmDelete(false);
    setAirportToDelete(null);
  };

  const handleDuplicateWarning = (airportName) => {
    setShowDuplicateWarning(true);
    setDuplicateAirportName(airportName);
  };

  const cancelDuplicateWarning = () => {
    setShowDuplicateWarning(false);
    setDuplicateAirportName('');
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
    route.airport.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      width: '100vw',
      height: '100vh',
      margin: '0',
      padding: '0',
      backgroundColor: '#f8fafc',
      fontFamily: 'Inter, sans-serif',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px 24px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    logo: {
      width: '48px',
      height: '48px',
      margin: '0 16px 0 0',
      display: 'block',
      cursor: 'pointer',
      transition: 'transform 0.2s ease-in-out',
      flexShrink: 0,
    },
    title: {
      fontSize: 'clamp(20px, 3vw, 28px)',
      fontWeight: '700',
      color: '#0B1E39',
      margin: '0',
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
    navigationBar: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '12px 0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      zIndex: 100,
    },
    navigationContainer: {
      padding: '0 24px',
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
    },
    navButton: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      fontFamily: 'Inter, sans-serif',
      transition: 'all 0.2s ease-out',
      backgroundColor: 'transparent',
      color: '#6b7280',
    },
    navButtonActive: {
      backgroundColor: '#0B1E39',
      color: 'white',
    },
    navButtonHover: {
      backgroundColor: '#f3f4f6',
      color: '#0B1E39',
    },
    nameInputOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      opacity: 1,
      transition: 'opacity 0.15s ease-out',
    },
    nameInputModal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      minWidth: '300px',
      transform: 'scale(1)',
      transition: 'transform 0.15s ease-out',
    },
    nameInputTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#0B1E39',
      fontFamily: 'Inter, sans-serif',
    },
    nameInputField: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      marginBottom: '16px',
      boxSizing: 'border-box',
    },
    nameInputButtons: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
    },
    nameInputButton: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      fontFamily: 'Inter, sans-serif',
    },
    nameInputButtonCancel: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
    },
    nameInputButtonSubmit: {
      backgroundColor: '#0B1E39',
      color: 'white',
    },
    airportsList: {
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      padding: '20px',
      margin: '24px',
      flex: '1',
      overflow: 'auto',
    },
    airportsListTitle: {
      fontSize: 'clamp(18px, 3vw, 24px)',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#0B1E39',
      fontFamily: 'Inter, sans-serif',
    },
    airportItem: {
      padding: '12px 16px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'Inter, sans-serif',
    },
    airportName: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#0B1E39',
    },
    airportDate: {
      fontSize: '14px',
      color: '#6b7280',
    },
    airportDropdown: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: 'white',
      cursor: 'pointer',
      marginBottom: '16px',
    },
    airportDropdownOption: {
      padding: '8px 12px',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
    },
    airportDropdownLabel: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#0B1E39',
      marginBottom: '8px',
      fontFamily: 'Inter, sans-serif',
    },
    welcomeContainer: {
      textAlign: 'center',
      padding: '48px 20px',
      maxWidth: '600px',
      margin: '0 auto',
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    welcomeTitle: {
      fontSize: 'clamp(28px, 5vw, 42px)',
      fontWeight: '700',
      color: '#0B1E39',
      marginBottom: '24px',
      fontFamily: 'Inter, sans-serif',
    },
    welcomeSubtitle: {
      fontSize: 'clamp(18px, 3vw, 24px)',
      color: '#6b7280',
      fontFamily: 'Inter, sans-serif',
      lineHeight: '1.5',
    },
    contentContainer: {
      flex: '1',
      opacity: 1,
      transform: 'translateY(0)',
      transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
    },
    contentContainerTransitioning: {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    settingsContainer: {
      padding: '24px',
      flex: '1',
      overflowY: 'auto',
    },
    settingsTitle: {
      fontSize: 'clamp(20px, 3vw, 24px)',
      fontWeight: '600',
      marginBottom: '24px',
      color: '#0B1E39',
      fontFamily: 'Inter, sans-serif',
    },
    airportListItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      marginBottom: '8px',
      backgroundColor: '#f9fafb',
    },
    airportListInfo: {
      flex: '1',
    },
    airportListName: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#0B1E39',
      marginBottom: '4px',
      fontFamily: 'Inter, sans-serif',
    },
    airportListDate: {
      fontSize: '14px',
      color: '#6b7280',
      fontFamily: 'Inter, sans-serif',
    },
    settingsSearchContainer: {
      position: 'relative',
      marginBottom: '24px',
      width: '100%',
    },
    settingsSearchInput: {
      width: '100%',
      padding: '12px 12px 12px 48px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      boxSizing: 'border-box',
    },
    settingsSearchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      fontSize: '20px',
      pointerEvents: 'none',
    },
    navDropdownContainer: {
      position: 'absolute',
      top: '100%',
      left: '19.9%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'block',
    },
    navDropdown: {
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      minWidth: '200px',
      maxHeight: '300px',
      overflowY: 'auto',
      marginTop: '4px',
      position: 'relative',
      zIndex: 9999,
    },
    navDropdownItem: {
      padding: '12px 16px',
      borderBottom: '1px solid #f3f4f6',
      cursor: 'pointer',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      transition: 'background-color 0.15s ease-out',
    },
    navDropdownItemHover: {
      backgroundColor: '#f9fafb',
    },
    navDropdownItemSelected: {
      backgroundColor: '#f3f4f6',
      color: '#0B1E39',
    },
    navDropdownEmpty: {
      padding: '12px 16px',
      color: '#6b7280',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      fontStyle: 'italic',
    },
    settingsNav: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: '16px',
    },
    settingsNavButton: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      fontFamily: 'Inter, sans-serif',
      transition: 'all 0.15s ease-out',
      backgroundColor: 'transparent',
      color: '#6b7280',
    },
    settingsNavButtonActive: {
      backgroundColor: '#0B1E39',
      color: 'white',
    },
    settingsNavButtonHover: {
      backgroundColor: '#f3f4f6',
      color: '#0B1E39',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header - Always visible */}
      <div style={styles.header}>
        <svg 
          style={{
            ...styles.logo,
            transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
          }} 
          xmlns="http://www.w3.org/2000/svg" 
          width="64" 
          height="64" 
          viewBox="0 0 64 64" 
          role="img" 
          aria-label="Route icon" 
          onClick={handleLogoClick}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = isTransitioning ? 'scale(0.95)' : 'scale(1)'}
        >
          <rect x="2" y="2" width="60" height="60" rx="14" fill="#0B1E39"/>
          <path d="M14 46 L28 32 L40 38 L50 18" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="14" cy="46" r="4" fill="#0B1E39" stroke="#FFFFFF" strokeWidth="4"/>
          <circle cx="28" cy="32" r="4" fill="#0B1E39" stroke="#FFFFFF" strokeWidth="4"/>
          <circle cx="50" cy="18" r="4" fill="#0B1E39" stroke="#FFFFFF" strokeWidth="4"/>
        </svg>
        <h1 style={styles.title}>VoiceATC Airport Creator</h1>
      </div>

      {/* Navigation Bar */}
      <div style={styles.navigationBar}>
        <div style={styles.navigationContainer}>
          <button
            style={{
              ...styles.navButton,
              ...(currentView === 'new' ? styles.navButtonActive : {}),
              // ...(buttonAnimating === 'new' ? styles.navButtonAnimating : {}), // Removed
            }}
            onClick={() => handleNameInput('new')}
            onMouseEnter={(e) => !e.target.style.backgroundColor.includes('#0B1E39') && (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor, e.target.style.color = styles.navButtonHover.color)}
            onMouseLeave={(e) => !e.target.style.backgroundColor.includes('#0B1E39') && (e.target.style.backgroundColor = styles.navButton.backgroundColor, e.target.style.color = styles.navButton.color)}
          >
            New Airport
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(currentView === 'new-config' ? styles.navButtonActive : {}),
              // ...(buttonAnimating === 'new-config' ? styles.navButtonAnimating : {}), // Removed
            }}
            onClick={() => handleNameInput('new-config')}
            onMouseEnter={(e) => !e.target.style.backgroundColor.includes('#0B1E39') && (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor, e.target.style.color = styles.navButtonHover.color)}
            onMouseLeave={(e) => !e.target.style.backgroundColor.includes('#0B1E39') && (e.target.style.backgroundColor = styles.navButton.backgroundColor, e.target.style.color = styles.navButton.color)}
          >
            New Config
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(currentView === 'your-airports' ? styles.navButtonActive : {}),
              position: 'relative',
              // ...(buttonAnimating === 'your-airports' ? styles.navButtonAnimating : {}), // Removed
            }}
            onClick={() => setShowAirportsDropdown(!showAirportsDropdown)}
            onMouseEnter={(e) => !e.target.style.backgroundColor.includes('#0B1E39') && (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor, e.target.style.color = styles.navButtonHover.color)}
            onMouseLeave={(e) => !e.target.style.backgroundColor.includes('#0B1E39') && (e.target.style.backgroundColor = styles.navButton.backgroundColor, e.target.style.color = styles.navButton.color)}
            data-dropdown
          >
            Your Airports
          </button>
          {showAirportsDropdown && (
            <div style={styles.navDropdownContainer} data-dropdown>
              <div style={styles.navDropdown}>
                {airports.length === 0 ? (
                  <div style={styles.navDropdownEmpty}>
                    No airports created yet
                  </div>
                ) : (
                  airports.map((airport) => (
                    <div
                      key={airport.id}
                      style={{
                        ...styles.navDropdownItem,
                        ...(selectedAirport === airport.id ? styles.navDropdownItemSelected : {}),
                      }}
                      onClick={() => {
                        setSelectedAirport(airport.id);
                        setShowAirportsDropdown(false);
                      }}
                      onMouseEnter={(e) => {
                        if (selectedAirport !== airport.id) {
                          e.target.style.backgroundColor = styles.navDropdownItemHover.backgroundColor;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedAirport !== airport.id) {
                          e.target.style.backgroundColor = '';
                        }
                      }}
                    >
                      {airport.name}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          <button
            style={{
              ...styles.navButton,
              ...(currentView === 'traffic' ? styles.navButtonActive : {}),
              // ...(buttonAnimating === 'traffic' ? styles.navButtonAnimating : {}), // Removed
            }}
            onClick={() => handleNavigation('traffic')}
            onMouseEnter={(e) => !e.target.style.backgroundColor.includes('#0B1E39') && (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor, e.target.style.color = styles.navButtonHover.color)}
            onMouseLeave={(e) => !e.target.style.backgroundColor.includes('#0B1E39') && (e.target.style.backgroundColor = styles.navButton.backgroundColor, e.target.style.color = styles.navButton.color)}
          >
            Traffic
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(currentView === 'settings' ? styles.navButtonActive : {}),
            }}
            onClick={() => handleNavigation('settings')}
            onMouseEnter={(e) => !e.target.style.backgroundColor.includes('#0B1E39') && (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor, e.target.style.color = styles.navButtonHover.color)}
            onMouseLeave={(e) => !e.target.style.backgroundColor.includes('#0B1E39') && (e.target.style.backgroundColor = styles.navButton.backgroundColor, e.target.style.color = styles.navButton.color)}
          >
            Settings
          </button>
          {/* Test buttons for animation */}
          {/* <button // Removed
            style={{ // Removed
              ...styles.navButton, // Removed
              backgroundColor: '#dc2626', // Removed
              color: 'white', // Removed
            }} // Removed
            onClick={() => testButtonAnimation('new')} // Removed
          > // Removed
            Test New // Removed
          </button> // Removed
          <button // Removed
            style={{ // Removed
              ...styles.navButton, // Removed
              backgroundColor: '#dc2626', // Removed
              color: 'white', // Removed
            }} // Removed
            onClick={() => testButtonAnimation('new-config')} // Removed
          > // Removed
            Test Config // Removed
          </button> // Removed */}
        </div>
      </div>

      {/* Name Input Modal */}
      {showNameInput && (
        <div style={{
          ...styles.nameInputOverlay,
          opacity: modalAnimating ? 0 : 1,
        }}>
          <div style={{
            ...styles.nameInputModal,
            transform: modalAnimating ? 'scale(0.8)' : 'scale(1)',
          }}>
            <input
              type="text"
              placeholder="Enter ICAO..."
              value={nameInputValue}
              onChange={(e) => handleNameInputChange(e.target.value)}
              style={styles.nameInputField}
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
            />
            <div style={styles.nameInputButtons}>
              <button
                onClick={handleNameCancel}
                style={{...styles.nameInputButton, ...styles.nameInputButtonCancel}}
              >
                Cancel
              </button>
              <button
                onClick={handleNameSubmit}
                style={{...styles.nameInputButton, ...styles.nameInputButtonSubmit}}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div style={styles.nameInputOverlay}>
          <div style={styles.nameInputModal}>
            <h3 style={{marginBottom: '16px', fontFamily: 'Inter, sans-serif', color: '#0B1E39'}}>
              Delete Airport
            </h3>
            <p style={{marginBottom: '24px', fontFamily: 'Inter, sans-serif', color: '#6b7280'}}>
              Are you sure you want to delete "{airportToDelete?.name}"? This action cannot be undone.
            </p>
            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
              <button
                onClick={cancelDeleteAirport}
                style={styles.nameInputButtonCancel}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAirport}
                style={styles.nameInputButtonSubmit}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Warning Modal */}
      {showDuplicateWarning && (
        <div style={styles.nameInputOverlay}>
          <div style={styles.nameInputModal}>
            <h3 style={{marginBottom: '16px', fontFamily: 'Inter, sans-serif', color: '#0B1E39'}}>
              Airport Already Exists
            </h3>
            <p style={{marginBottom: '24px', fontFamily: 'Inter, sans-serif', color: '#6b7280'}}>
              An airport with ICAO "{duplicateAirportName}" already exists. Please choose a different ICAO code.
            </p>
            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
              <button
                onClick={cancelDuplicateWarning}
                style={styles.nameInputButtonSubmit}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content based on current view */}
      <div style={{
        ...styles.contentContainer,
        ...(isTransitioning ? styles.contentContainerTransitioning : {}),
      }}>
        {currentView === 'welcome' && (
          <div style={styles.welcomeContainer}>
            <h2 style={styles.welcomeTitle}>Welcome to VoiceATC Airport Creator</h2>
            <p style={styles.welcomeSubtitle}>Navigate to Your Airports to begin!</p>
          </div>
        )}

        {currentView === 'traffic' && (
          <div style={{flex: '1', overflow: 'auto', padding: '24px'}}>
            {/* Input Section */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Add New Route</h2>
              <div style={styles.grid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Airport</label>
                  <input
                    type="text"
                    placeholder="ENGM"
                    value={formData.airport}
                    onChange={(e) => handleInputChange('airport', e.target.value)}
                    style={getInputStyle('airport')}
                  />
                </div>
                
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
                    placeholder="Search by Airlines, Airport, Route, or Aircraft..."
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
                        onClick={() => handleSort('airport')}
                        onMouseEnter={(e) => e.target.style.color = styles.sortableHeaderHover.color}
                        onMouseLeave={(e) => e.target.style.color = ''}
                      >
                        <div style={styles.sortableHeader}>
                          Airport
                          <span 
                            className="material-icons" 
                            style={{
                              ...styles.sortIcon,
                              ...(sortField === 'airport' ? styles.sortIconActive : {}),
                              transform: sortField === 'airport' && sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                            }}
                          >
                            {sortField === 'airport' ? 'keyboard_arrow_up' : 'unfold_more'}
                          </span>
                        </div>
                      </th>
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
                        <td style={styles.tableCell}>{route.airport}</td>
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
                        <td colSpan={9} style={styles.emptyState}>
                          No routes found. Add your first route above!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {currentView === 'settings' && (
          <div style={styles.settingsContainer}>
            <h2 style={styles.settingsTitle}>Settings</h2>
            
            {/* Settings Navigation */}
            <div style={styles.settingsNav}>
              <button
                style={{
                  ...styles.settingsNavButton,
                  ...(settingsPage === 'airports' ? styles.settingsNavButtonActive : {}),
                }}
                onClick={() => setSettingsPage('airports')}
                onMouseEnter={(e) => !e.target.style.backgroundColor.includes('#0B1E39') && (e.target.style.backgroundColor = styles.settingsNavButtonHover.backgroundColor, e.target.style.color = styles.settingsNavButtonHover.color)}
                onMouseLeave={(e) => !e.target.style.backgroundColor.includes('#0B1E39') && (e.target.style.backgroundColor = styles.settingsNavButton.backgroundColor, e.target.style.color = styles.settingsNavButton.color)}
              >
                Manage Airports
              </button>
              <button
                style={{
                  ...styles.settingsNavButton,
                  ...(settingsPage === 'configs' ? styles.settingsNavButtonActive : {}),
                }}
                onClick={() => setSettingsPage('configs')}
                onMouseEnter={(e) => !e.target.style.backgroundColor.includes('#0B1E39') && (e.target.style.backgroundColor = styles.settingsNavButtonHover.backgroundColor, e.target.style.color = styles.settingsNavButtonHover.color)}
                onMouseLeave={(e) => !e.target.style.backgroundColor.includes('#0B1E39') && (e.target.style.backgroundColor = styles.settingsNavButton.backgroundColor, e.target.style.color = styles.settingsNavButton.color)}
              >
                Manage Configs
              </button>
            </div>

            {/* Manage Airports Page */}
            {settingsPage === 'airports' && (
              <div>
                <div style={styles.settingsSearchContainer}>
                  <span className="material-icons" style={styles.settingsSearchIcon}>search</span>
                  <input
                    type="text"
                    placeholder="Search airports..."
                    value={settingsSearchTerm}
                    onChange={(e) => setSettingsSearchTerm(e.target.value)}
                    style={styles.settingsSearchInput}
                  />
                </div>
                <div>
                  <h3 style={{...styles.airportDropdownLabel, marginBottom: '16px'}}>Manage Airports</h3>
                  {airports.length === 0 ? (
                    <p style={{color: '#6b7280', fontFamily: 'Inter, sans-serif'}}>No airports created yet.</p>
                  ) : (
                    airports
                      .filter(airport => 
                        airport.name.toLowerCase().includes(settingsSearchTerm.toLowerCase())
                      )
                      .map((airport) => (
                        <div key={airport.id} style={styles.airportListItem}>
                          <div style={styles.airportListInfo}>
                            <span style={styles.airportListName}>{airport.name}</span>
                            <span style={styles.airportListDate}>
                              &nbsp;&nbsp;&nbsp;&nbsp;Created {new Date(airport.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteAirport(airport.id)}
                            style={styles.deleteButton}
                          >
                            <span className="material-icons" style={{fontSize: '16px'}}>delete</span>
                            Delete
                          </button>
                        </div>
                      ))
                  )}
                  {airports.length > 0 && airports.filter(airport => 
                    airport.name.toLowerCase().includes(settingsSearchTerm.toLowerCase())
                  ).length === 0 && (
                    <p style={{color: '#6b7280', fontFamily: 'Inter, sans-serif'}}>No airports found matching your search.</p>
                  )}
                </div>
              </div>
            )}

            {/* Manage Configs Page */}
            {settingsPage === 'configs' && (
              <div>
                <h3 style={{...styles.airportDropdownLabel, marginBottom: '16px'}}>Manage Configurations</h3>
                <p style={{color: '#6b7280', fontFamily: 'Inter, sans-serif'}}>Configuration management coming soon...</p>
              </div>
            )}
          </div>
        )}

        {/* Notification Toast */}
        {notification.show && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: notification.type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'slideInRight 0.3s ease-out',
            maxWidth: '300px',
            wordWrap: 'break-word'
          }}>
            <span className="material-icons" style={{ fontSize: '20px' }}>
              {notification.type === 'success' ? 'check_circle' : 'error'}
            </span>
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 