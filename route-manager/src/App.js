import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('airport');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentView, setCurrentView] = useState('welcome');
  const [airports, setAirports] = useState([]);
  const [configs, setConfigs] = useState([
    { id: '1', name: 'Config 1', type: 'default' },
    { id: '2', name: 'Config 2', type: 'default' }
  ]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameInputType, setNameInputType] = useState('');
  const [nameInputValue, setNameInputValue] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [modalAnimating, setModalAnimating] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState('');
  const [settingsSearchTerm, setSettingsSearchTerm] = useState('');
  const [configSearchTerm, setConfigSearchTerm] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [airportToDelete, setAirportToDelete] = useState(null);
  const [showAirportsDropdown, setShowAirportsDropdown] = useState(false);
  const [showSubDropdown, setShowSubDropdown] = useState(null);
  const [clickedAirport, setClickedAirport] = useState(null);
  const [showGeneralFilesDropdown, setShowGeneralFilesDropdown] = useState(null);
  const [showConfig1Dropdown, setShowConfig1Dropdown] = useState(null);
  const [showConfig2Dropdown, setShowConfig2Dropdown] = useState(null);
  const [openConfigDropdowns, setOpenConfigDropdowns] = useState({});
  const [showNavAidsDropdown, setShowNavAidsDropdown] = useState(null);
  const [showProcsDropdown, setShowProcsDropdown] = useState(null);
  const [activeFourthLevelDropdown, setActiveFourthLevelDropdown] = useState(null);
  const [settingsPage, setSettingsPage] = useState('airports');
  const [showTrafficView, setShowTrafficView] = useState(null);
  const [currentAirportView, setCurrentAirportView] = useState(null);
  const [previousView, setPreviousView] = useState('welcome');
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateAirportName, setDuplicateAirportName] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [buttonHover, setButtonHover] = useState({ cancel: false, submit: false, delete: false, ok: false });
  const [showRenameConfig, setShowRenameConfig] = useState(false);
  const [configToRename, setConfigToRename] = useState('');
  const [newConfigName, setNewConfigName] = useState('');
  const [showDeleteConfigConfirm, setShowDeleteConfigConfirm] = useState(false);
  const [configToDelete, setConfigToDelete] = useState('');
  const [showRenameAirport, setShowRenameAirport] = useState(false);
  const [airportToRename, setAirportToRename] = useState(null);
  const [newAirportName, setNewAirportName] = useState('');
  const [selectedAirportForConfig, setSelectedAirportForConfig] = useState('');
  const [showAirportDropdownForConfig, setShowAirportDropdownForConfig] = useState(false);
  const [airportSearchForConfig, setAirportSearchForConfig] = useState('');
  const [selectedAirportForManageConfigs, setSelectedAirportForManageConfigs] = useState('');
  const [showAirportDropdownForManageConfigs, setShowAirportDropdownForManageConfigs] = useState(false);
  const [airportSearchForManageConfigs, setAirportSearchForManageConfigs] = useState('');
  const [showWakeCategoryDropdown, setShowWakeCategoryDropdown] = useState(false);
  const [showZoomTooltip, setShowZoomTooltip] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [infoDataSaved, setInfoDataSaved] = useState({});
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
  
  const [infoData, setInfoData] = useState({
    centerpoint: '',
    magneticVariation: '',
    elevation: '',
    name: '',
    defaultZoom: '',
    backgroundColour: '',
    transitionAltitude: '',
  });
  
  const [runwaysData, setRunwaysData] = useState({
    rwy1: '',
    rwy2: '',
    elevation1: '',
    elevation2: '',
    track1: '',
    track2: '',
    coordinate1: '',
    coordinate2: '',
  });
  
  const [runways, setRunways] = useState([]);
  const [runwaysSearchTerm, setRunwaysSearchTerm] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // GEO data state
  const [geoData, setGeoData] = useState({
    name: '',
    input: '',
  });
  
  const [geoEntries, setGeoEntries] = useState([]);
  const [geoSearchTerm, setGeoSearchTerm] = useState('');
  const [editingGeoEntry, setEditingGeoEntry] = useState(null);
  const [showConfirmDeleteGeo, setShowConfirmDeleteGeo] = useState(false);
  const [geoEntryToDelete, setGeoEntryToDelete] = useState(null);

  // MRVA data state
  const [mrvaData, setMrvaData] = useState({
    name: '',
    coordinates: '',
    altitude: '',
    labelCoordinate: '',
  });
  
  const [mrvaEntries, setMrvaEntries] = useState([]);
  const [mrvaSearchTerm, setMrvaSearchTerm] = useState('');
  const [editingMrvaEntry, setEditingMrvaEntry] = useState(null);
  const [showConfirmDeleteMrva, setShowConfirmDeleteMrva] = useState(false);
  const [mrvaEntryToDelete, setMrvaEntryToDelete] = useState(null);

  // GLIDEPATH data state
  const [glidepathData, setGlidepathData] = useState({
    rwy: '',
    angle: '',
    length: '',
  });
  
  const [glidepathEntries, setGlidepathEntries] = useState([]);
  const [glidepathSearchTerm, setGlidepathSearchTerm] = useState('');
  const [editingGlidepathEntry, setEditingGlidepathEntry] = useState(null);
  const [showConfirmDeleteGlidepath, setShowConfirmDeleteGlidepath] = useState(false);
  const [glidepathEntryToDelete, setGlidepathEntryToDelete] = useState(null);

  // Load routes from localStorage on component mount
  useEffect(() => {
    try {
      const savedRoutes = localStorage.getItem('flight-routes');
      if (savedRoutes && savedRoutes !== '[]' && savedRoutes !== 'null') {
        const parsedRoutes = JSON.parse(savedRoutes);
        if (Array.isArray(parsedRoutes) && parsedRoutes.length > 0) {
          setRoutes(parsedRoutes);
          console.log('Loaded routes from localStorage:', parsedRoutes);
        } else {
          console.log('Parsed data is not a valid routes array, using empty array');
          setRoutes([]);
        }
      } else {
        console.log('No valid saved routes found in localStorage');
        setRoutes([]);
      }
    } catch (error) {
      console.error('Error loading routes from localStorage:', error);
      setRoutes([]);
    }
  }, []);

  // Load airports from localStorage on component mount
  useEffect(() => {
    try {
      console.log('=== Loading airports from localStorage ===');
      const savedAirports = localStorage.getItem('airports');
      console.log('Raw savedAirports:', savedAirports);
      
      if (savedAirports && savedAirports !== '[]' && savedAirports !== 'null') {
        const parsedAirports = JSON.parse(savedAirports);
        console.log('Parsed airports:', parsedAirports);
        
        // Validate that it's actually an array with airport objects
        if (Array.isArray(parsedAirports) && parsedAirports.length > 0) {
          setAirports(parsedAirports);
          console.log('Set airports state to:', parsedAirports);
        } else {
          console.log('Parsed data is not a valid airports array, using empty array');
          setAirports([]);
        }
      } else {
        console.log('No valid saved airports found in localStorage');
        setAirports([]);
      }
    } catch (error) {
      console.error('Error loading airports from localStorage:', error);
      setAirports([]);
    }
  }, []);

  // Save routes to localStorage whenever routes change
  useEffect(() => {
    // Skip saving during initial load
    if (routes.length === 0) {
      console.log('Skipping save - routes array is empty (likely initial load)');
      return;
    }
    
    try {
      // Only save if there are actually routes
      if (routes && routes.length > 0) {
        localStorage.setItem('flight-routes', JSON.stringify(routes));
        console.log('Saved routes to localStorage:', routes);
      } else {
        // Remove the key if no routes
        localStorage.removeItem('flight-routes');
        console.log('Removed routes from localStorage (no routes)');
      }
    } catch (error) {
      console.error('Error saving routes to localStorage:', error);
    }
  }, [routes]);

  // Save airports to localStorage whenever airports change
  useEffect(() => {
    console.log('=== useEffect triggered for airports ===');
    console.log('airports state changed to:', airports);
    
    // Skip saving during initial load
    if (airports.length === 0) {
      console.log('Skipping save - airports array is empty (likely initial load)');
      return;
    }
    
    try {
      // Only save if there are actually airports
      if (airports && airports.length > 0) {
        localStorage.setItem('airports', JSON.stringify(airports));
        console.log('Saved airports to localStorage:', airports);
        
        // Verify it was saved
        const saved = localStorage.getItem('airports');
        console.log('Verified saved data:', saved);
      } else {
        // Remove the key if no airports
        localStorage.removeItem('airports');
        console.log('Removed airports from localStorage (no airports)');
      }
    } catch (error) {
      console.error('Error saving airports to localStorage:', error);
    }
  }, [airports]);

  // Load configs from localStorage on component mount
  useEffect(() => {
    try {
      const savedConfigs = localStorage.getItem('configs');
      if (savedConfigs) {
        const parsedConfigs = JSON.parse(savedConfigs);
        setConfigs(parsedConfigs);
        console.log('Loaded configs from localStorage:', parsedConfigs);
      }
    } catch (error) {
      console.error('Error loading configs from localStorage:', error);
    }
  }, []);

  // Save configs to localStorage whenever configs change
  useEffect(() => {
    try {
      localStorage.setItem('configs', JSON.stringify(configs));
      console.log('Saved configs to localStorage:', configs);
    } catch (error) {
      console.error('Error saving configs to localStorage:', error);
    }
  }, [configs]);

  // Load runways from localStorage on component mount
  useEffect(() => {
    try {
      const savedRunways = localStorage.getItem('runways');
      if (savedRunways && savedRunways !== '[]' && savedRunways !== 'null') {
        const parsedRunways = JSON.parse(savedRunways);
        if (Array.isArray(parsedRunways) && parsedRunways.length > 0) {
          setRunways(parsedRunways);
          console.log('Loaded runways from localStorage:', parsedRunways);
        } else {
          console.log('Parsed data is not a valid runways array, using empty array');
          setRunways([]);
        }
      } else {
        console.log('No valid saved runways found in localStorage');
        setRunways([]);
      }
    } catch (error) {
      console.error('Error loading runways from localStorage:', error);
      setRunways([]);
    }
  }, []);

  // Save runways to localStorage whenever runways change
  useEffect(() => {
    // Skip saving during initial load
    if (runways.length === 0) {
      console.log('Skipping save - runways array is empty (likely initial load)');
      return;
    }
    
    try {
      // Only save if there are actually runways
      if (runways && runways.length > 0) {
        localStorage.setItem('runways', JSON.stringify(runways));
        console.log('Saved runways to localStorage:', runways);
      } else {
        // Remove the key if no runways
        localStorage.removeItem('runways');
        console.log('Removed runways from localStorage (no runways)');
      }
    } catch (error) {
      console.error('Error saving runways to localStorage:', error);
    }
  }, [runways]);

  // Load geo entries from localStorage on component mount
  useEffect(() => {
    try {
      const savedGeoEntries = localStorage.getItem('geoEntries');
      if (savedGeoEntries && savedGeoEntries !== '[]' && savedGeoEntries !== 'null') {
        const parsedGeoEntries = JSON.parse(savedGeoEntries);
        if (Array.isArray(parsedGeoEntries) && parsedGeoEntries.length > 0) {
          setGeoEntries(parsedGeoEntries);
          console.log('Loaded geo entries from localStorage:', parsedGeoEntries);
        } else {
          console.log('Parsed data is not a valid geo entries array, using empty array');
          setGeoEntries([]);
        }
      } else {
        console.log('No valid saved geo entries found in localStorage');
        setGeoEntries([]);
      }
    } catch (error) {
      console.error('Error loading geo entries from localStorage:', error);
      setGeoEntries([]);
    }
  }, []);

  // Save geo entries to localStorage whenever geoEntries change
  useEffect(() => {
    // Skip saving during initial load
    if (geoEntries.length === 0) {
      console.log('Skipping save - geo entries array is empty (likely initial load)');
      return;
    }
    
    try {
      // Only save if there are actually geo entries
      if (geoEntries && geoEntries.length > 0) {
        localStorage.setItem('geoEntries', JSON.stringify(geoEntries));
        console.log('Saved geo entries to localStorage:', geoEntries);
      } else {
        // Remove the key if no geo entries
        localStorage.removeItem('geoEntries');
        console.log('Removed geo entries from localStorage (no geo entries)');
      }
    } catch (error) {
      console.error('Error saving geo entries to localStorage:', error);
    }
  }, [geoEntries]);

  // Load MRVA entries from localStorage on component mount
  useEffect(() => {
    try {
      const savedMrvaEntries = localStorage.getItem('mrvaEntries');
      if (savedMrvaEntries && savedMrvaEntries !== '[]' && savedMrvaEntries !== 'null') {
        const parsedMrvaEntries = JSON.parse(savedMrvaEntries);
        if (Array.isArray(parsedMrvaEntries) && parsedMrvaEntries.length > 0) {
          setMrvaEntries(parsedMrvaEntries);
          console.log('Loaded MRVA entries from localStorage:', parsedMrvaEntries);
        } else {
          console.log('Parsed data is not a valid MRVA entries array, using empty array');
          setMrvaEntries([]);
        }
      } else {
        console.log('No valid saved MRVA entries found in localStorage');
        setMrvaEntries([]);
      }
    } catch (error) {
      console.error('Error loading MRVA entries from localStorage:', error);
      setMrvaEntries([]);
    }
  }, []);

  // Save MRVA entries to localStorage whenever mrvaEntries change
  useEffect(() => {
    // Skip saving during initial load
    if (mrvaEntries.length === 0) {
      console.log('Skipping save - MRVA entries array is empty (likely initial load)');
      return;
    }
    
    try {
      // Only save if there are actually MRVA entries
      if (mrvaEntries && mrvaEntries.length > 0) {
        localStorage.setItem('mrvaEntries', JSON.stringify(mrvaEntries));
        console.log('Saved MRVA entries to localStorage:', mrvaEntries);
      } else {
        // Remove the key if no MRVA entries
        localStorage.removeItem('mrvaEntries');
        console.log('Removed MRVA entries from localStorage (no MRVA entries)');
      }
    } catch (error) {
      console.error('Error saving MRVA entries to localStorage:', error);
    }
  }, [mrvaEntries]);

  // Load GLIDEPATH entries from localStorage on component mount
  useEffect(() => {
    try {
      const savedGlidepathEntries = localStorage.getItem('glidepathEntries');
      if (savedGlidepathEntries && savedGlidepathEntries !== '[]' && savedGlidepathEntries !== 'null') {
        const parsedGlidepathEntries = JSON.parse(savedGlidepathEntries);
        if (Array.isArray(parsedGlidepathEntries) && parsedGlidepathEntries.length > 0) {
          setGlidepathEntries(parsedGlidepathEntries);
          console.log('Loaded GLIDEPATH entries from localStorage:', parsedGlidepathEntries);
        } else {
          console.log('Parsed data is not a valid GLIDEPATH entries array, using empty array');
          setGlidepathEntries([]);
        }
      } else {
        console.log('No valid saved GLIDEPATH entries found in localStorage');
        setGlidepathEntries([]);
      }
    } catch (error) {
      console.error('Error loading GLIDEPATH entries from localStorage:', error);
      setGlidepathEntries([]);
    }
  }, []);

  // Save GLIDEPATH entries to localStorage whenever glidepathEntries change
  useEffect(() => {
    // Skip saving during initial load
    if (glidepathEntries.length === 0) {
      console.log('Skipping save - GLIDEPATH entries array is empty (likely initial load)');
      return;
    }
    
    try {
      // Only save if there are actually GLIDEPATH entries
      if (glidepathEntries && glidepathEntries.length > 0) {
        localStorage.setItem('glidepathEntries', JSON.stringify(glidepathEntries));
        console.log('Saved GLIDEPATH entries to localStorage:', glidepathEntries);
      } else {
        // Remove the key if no GLIDEPATH entries
        localStorage.removeItem('glidepathEntries');
        console.log('Removed GLIDEPATH entries from localStorage (no GLIDEPATH entries)');
      }
    } catch (error) {
      console.error('Error saving GLIDEPATH entries to localStorage:', error);
    }
  }, [glidepathEntries]);

  // Load info data from localStorage on component mount
  useEffect(() => {
    try {
      const savedInfoData = localStorage.getItem('infoData');
      if (savedInfoData) {
        const parsedInfoData = JSON.parse(savedInfoData);
        setInfoDataSaved(parsedInfoData);
        console.log('Loaded info data from localStorage:', parsedInfoData);
      }
    } catch (error) {
      console.error('Error loading info data from localStorage:', error);
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showWakeCategoryDropdown) {
        setShowWakeCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWakeCategoryDropdown]);

  // Make functions available globally for debugging
  useEffect(() => {
    window.testLocalStorage = testLocalStorage;
    window.debugLocalStorage = debugLocalStorage;
    window.clearAllData = clearAllData;
    window.testCreateAirport = testCreateAirport;
    window.currentAppState = () => ({
      airports,
      routes,
      runways,
      configs,
      geoEntries,
      mrvaEntries,
      glidepathEntries
    });
  }, [airports, routes, runways, configs, geoEntries, mrvaEntries, glidepathEntries]);

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

  // Debug function to check localStorage
  const debugLocalStorage = () => {
    console.log('=== localStorage Debug ===');
    console.log('localStorage available:', typeof localStorage !== 'undefined');
    console.log('localStorage quota:', navigator.storage ? navigator.storage.estimate() : 'Not available');
    console.log('airports:', localStorage.getItem('airports'));
    console.log('flight-routes:', localStorage.getItem('flight-routes'));
    console.log('runways:', localStorage.getItem('runways'));
    console.log('configs:', localStorage.getItem('configs'));
    console.log('infoData:', localStorage.getItem('infoData'));
    console.log('geoEntries:', localStorage.getItem('geoEntries'));
    console.log('mrvaEntries:', localStorage.getItem('mrvaEntries'));
    console.log('glidepathEntries:', localStorage.getItem('glidepathEntries'));
    console.log('Current state airports:', airports);
    console.log('Current state routes:', routes);
    console.log('Current state runways:', runways);
    console.log('Current state configs:', configs);
    console.log('Current state infoData:', infoData);
    console.log('Current state geoEntries:', geoEntries);
    console.log('Current state mrvaEntries:', mrvaEntries);
    console.log('Current state glidepathEntries:', glidepathEntries);
    console.log('========================');
  };

  // Test localStorage function
  const testLocalStorage = () => {
    console.log('=== Testing localStorage ===');
    try {
      localStorage.setItem('test', 'Hello World');
      const testValue = localStorage.getItem('test');
      console.log('Test value:', testValue);
      localStorage.removeItem('test');
      console.log('localStorage is working!');
      return true;
    } catch (error) {
      console.error('localStorage test failed:', error);
      return false;
    }
  };

  // Test creating an airport manually
  const testCreateAirport = () => {
    console.log('=== Testing airport creation ===');
    const testAirport = {
      id: Date.now().toString(),
      name: 'TEST',
      createdAt: new Date().toISOString()
    };
    
    console.log('Creating test airport:', testAirport);
    setAirports([testAirport]);
    
    // Check if useEffect triggers
    setTimeout(() => {
      console.log('Checking localStorage after 1 second...');
      const saved = localStorage.getItem('airports');
      console.log('Saved airports:', saved);
    }, 1000);
  };



  // Function to clear all localStorage data
  const clearAllData = () => {
    localStorage.removeItem('airports');
    localStorage.removeItem('flight-routes');
    localStorage.removeItem('runways');
    localStorage.removeItem('configs');
    localStorage.removeItem('infoData');
    localStorage.removeItem('geoEntries');
    localStorage.removeItem('mrvaEntries');
    localStorage.removeItem('glidepathEntries');
    setAirports([]);
    setRoutes([]);
    setRunways([]);
    setConfigs([]);
    setInfoData({
      centerpoint: '',
      magneticVariation: '',
      elevation: '',
      name: '',
      defaultZoom: '',
      backgroundColour: '',
      transitionAltitude: '',
    });
    setInfoDataSaved({});
    setGeoEntries([]);
    setGeoData({
      name: '',
      input: '',
    });
    setMrvaEntries([]);
    setMrvaData({
      name: '',
      coordinates: '',
      altitude: '',
      labelCoordinate: '',
    });
    setGlidepathEntries([]);
    setGlidepathData({
      rwy: '',
      angle: '',
      length: '',
    });
    showNotification('All data cleared!', 'success');
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

  const handleInfoDataChange = (field, value) => {
    let filteredValue = value;
    
    // Apply validation based on field type
    switch (field) {
      case 'centerpoint':
        // Only allow numbers, dots, and commas
        filteredValue = value.replace(/[^0-9.,]/g, '');
        break;
        
            case 'magneticVariation':
        // No validation - allow any input
        filteredValue = value;
        break;
        
      case 'elevation':
        // Only allow numbers up to 4411
        filteredValue = value.replace(/[^0-9]/g, '');
        if (filteredValue && parseInt(filteredValue) > 4411) {
          filteredValue = '4411';
        }
        break;
        
      case 'name':
        // Only allow letters and spaces
        filteredValue = value.replace(/[^A-Za-z\s]/g, '');
        break;
        
      case 'defaultZoom':
        // Only allow numbers
        filteredValue = value.replace(/[^0-9]/g, '');
        break;
        
      case 'transitionAltitude':
        // Only allow numbers
        filteredValue = value.replace(/[^0-9]/g, '');
        break;
        
      case 'backgroundColour':
        // Must start with # and allow hex characters
        if (!value.startsWith('#')) {
          filteredValue = '#' + value.replace(/[^0-9A-Fa-f]/g, '');
        } else {
          filteredValue = value.replace(/[^#0-9A-Fa-f]/g, '');
        }
        // Limit to 7 characters (# + 6 hex digits)
        filteredValue = filteredValue.slice(0, 7);
        break;
        
      default:
        // For other fields, allow any input
        break;
    }
    
    setInfoData(prev => ({ ...prev, [field]: filteredValue }));
  };

  // Load info data when entering INFO view
  useEffect(() => {
    if (currentAirportView && currentAirportView.type === 'info') {
      try {
        const savedInfoData = localStorage.getItem('infoData');
        if (savedInfoData) {
          const parsedInfoData = JSON.parse(savedInfoData);
          setInfoData(parsedInfoData);
          console.log('Loaded saved info data:', parsedInfoData);
        } else {
          // Reset to empty if no saved data
          setInfoData({
            centerpoint: '',
            magneticVariation: '',
            elevation: '',
            name: '',
            defaultZoom: '',
            backgroundColour: '',
            transitionAltitude: '',
          });
        }
      } catch (error) {
        console.error('Error loading info data:', error);
      }
    }
  }, [currentAirportView]);

  const handleSaveInfoData = () => {
    try {
      // Save to localStorage
      localStorage.setItem('infoData', JSON.stringify(infoData));
      setInfoDataSaved(infoData);
      showNotification('INFO data saved successfully!', 'success');
      console.log('Saved info data to localStorage:', infoData);
    } catch (error) {
      console.error('Error saving info data to localStorage:', error);
      showNotification('Error saving INFO data!', 'error');
    }
  };

  const handleRunwaysDataChange = (field, value) => {
    setRunwaysData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddRunway = () => {
    // Check if all required fields are filled
    const requiredFields = ['rwy1', 'rwy2', 'elevation1', 'elevation2', 'track1', 'track2', 'coordinate1', 'coordinate2'];
    const emptyFields = requiredFields.filter(field => !runwaysData[field]);
    
    if (emptyFields.length > 0) {
      // Set validation errors for empty fields
      const errors = {};
      emptyFields.forEach(field => {
        errors[field] = true;
      });
      setValidationErrors(errors);
      return;
    }

    const newRunway = {
      id: Math.random().toString(36).substr(2, 9),
      rwy1: runwaysData.rwy1,
      rwy2: runwaysData.rwy2,
      elevation1: runwaysData.elevation1,
      elevation2: runwaysData.elevation2,
      track1: runwaysData.track1,
      track2: runwaysData.track2,
      coordinate1: runwaysData.coordinate1,
      coordinate2: runwaysData.coordinate2,
      createdAt: new Date().toISOString()
    };

    setRunways(prev => [...prev, newRunway]);
    
    // Clear form
    setRunwaysData({
      rwy1: '',
      rwy2: '',
      elevation1: '',
      elevation2: '',
      track1: '',
      track2: '',
      coordinate1: '',
      coordinate2: '',
    });
    
    // Clear validation errors
    setValidationErrors({});
    
    // Show success notification
    showNotification('Runway added successfully!', 'success');
  };

  const handleDeleteRunway = (id) => {
    setRunways(prev => prev.filter(runway => runway.id !== id));
    showNotification('Runway deleted successfully!', 'success');
  };

  // GEO data handling functions
  const handleGeoDataChange = (field, value) => {
    setGeoData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddGeoEntry = () => {
    // Check if all required fields are filled
    const requiredFields = ['name', 'input'];
    const emptyFields = requiredFields.filter(field => !geoData[field]);
    
    if (emptyFields.length > 0) {
      // Set validation errors for empty fields
      const errors = {};
      emptyFields.forEach(field => {
        errors[field] = true;
      });
      setValidationErrors(errors);
      return;
    }

    const newGeoEntry = {
      id: Math.random().toString(36).substr(2, 9),
      name: geoData.name,
      input: geoData.input,
      createdAt: new Date().toISOString()
    };

    setGeoEntries(prev => [...prev, newGeoEntry]);
    
    // Clear form
    setGeoData({
      name: '',
      input: '',
    });
    
    // Clear validation errors
    setValidationErrors({});
    
    // Reset resizable textareas to default height
    setTimeout(() => {
      const textareas = document.querySelectorAll('textarea[placeholder="Enter input..."], textarea[placeholder="Enter coordinates..."]');
      textareas.forEach(textarea => {
        textarea.style.height = '40px';
      });
    }, 10);
    
    // Show success notification
    showNotification('GEO entry added successfully!', 'success');
  };

  const handleDeleteGeoEntry = (entry) => {
    setGeoEntryToDelete(entry);
    setShowConfirmDeleteGeo(true);
  };

  const confirmDeleteGeoEntry = () => {
    if (geoEntryToDelete) {
      setGeoEntries(prev => prev.filter(entry => entry.id !== geoEntryToDelete.id));
      setShowConfirmDeleteGeo(false);
      setGeoEntryToDelete(null);
      showNotification(`GEO entry "${geoEntryToDelete.name}" deleted successfully!`, 'success');
    }
  };

  const cancelDeleteGeoEntry = () => {
    setShowConfirmDeleteGeo(false);
    setGeoEntryToDelete(null);
  };

  const handleEditGeoEntry = (entry) => {
    setEditingGeoEntry(entry);
    setGeoData({
      name: entry.name,
      input: entry.input,
    });
  };

  const handleUpdateGeoEntry = () => {
    // Check if all required fields are filled
    const requiredFields = ['name', 'input'];
    const emptyFields = requiredFields.filter(field => !geoData[field]);
    
    if (emptyFields.length > 0) {
      // Set validation errors for empty fields
      const errors = {};
      emptyFields.forEach(field => {
        errors[field] = true;
      });
      setValidationErrors(errors);
      return;
    }

    // Update the entry
    setGeoEntries(prev => prev.map(entry => 
      entry.id === editingGeoEntry.id 
        ? { ...entry, name: geoData.name, input: geoData.input }
        : entry
    ));
    
    // Clear form and editing state
    setGeoData({
      name: '',
      input: '',
    });
    setEditingGeoEntry(null);
    
    // Clear validation errors
    setValidationErrors({});
    
    // Reset resizable textareas to default height
    setTimeout(() => {
      const textareas = document.querySelectorAll('textarea[placeholder="Enter input..."], textarea[placeholder="Enter coordinates..."]');
      textareas.forEach(textarea => {
        textarea.style.height = '40px';
      });
    }, 10);
    
    // Show success notification
    showNotification('GEO entry updated successfully!', 'success');
  };

  const handleCancelEdit = () => {
    setEditingGeoEntry(null);
    setGeoData({
      name: '',
      input: '',
    });
    setValidationErrors({});
    
    // Reset resizable textareas to default height
    setTimeout(() => {
      const textareas = document.querySelectorAll('textarea[placeholder="Enter input..."], textarea[placeholder="Enter coordinates..."]');
      textareas.forEach(textarea => {
        textarea.style.height = '40px';
      });
    }, 10);
  };

  // MRVA data handling functions
  const handleMrvaDataChange = (field, value) => {
    setMrvaData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMrvaEntry = () => {
    // Check if all required fields are filled
    const requiredFields = ['name', 'coordinates', 'altitude', 'labelCoordinate'];
    const emptyFields = requiredFields.filter(field => !mrvaData[field]);
    
    if (emptyFields.length > 0) {
      // Set validation errors for empty fields
      const errors = {};
      emptyFields.forEach(field => {
        errors[field] = true;
      });
      setValidationErrors(errors);
      return;
    }

    const newMrvaEntry = {
      id: Math.random().toString(36).substr(2, 9),
      name: mrvaData.name,
      coordinates: mrvaData.coordinates,
      altitude: mrvaData.altitude,
      labelCoordinate: mrvaData.labelCoordinate,
      createdAt: new Date().toISOString()
    };

    setMrvaEntries(prev => [...prev, newMrvaEntry]);
    
    // Clear form
    setMrvaData({
      name: '',
      coordinates: '',
      altitude: '',
      labelCoordinate: '',
    });
    
    // Clear validation errors
    setValidationErrors({});
    
    // Reset resizable textareas to default height
    setTimeout(() => {
      const textareas = document.querySelectorAll('textarea[placeholder="Enter input..."], textarea[placeholder="Enter coordinates..."]');
      textareas.forEach(textarea => {
        textarea.style.height = '40px';
      });
    }, 10);
    
    // Show success notification
    showNotification('MRVA entry added successfully!', 'success');
  };

  const handleDeleteMrvaEntry = (entry) => {
    setMrvaEntryToDelete(entry);
    setShowConfirmDeleteMrva(true);
  };

  const confirmDeleteMrvaEntry = () => {
    if (mrvaEntryToDelete) {
      setMrvaEntries(prev => prev.filter(entry => entry.id !== mrvaEntryToDelete.id));
      setShowConfirmDeleteMrva(false);
      setMrvaEntryToDelete(null);
      showNotification(`MRVA entry "${mrvaEntryToDelete.name}" deleted successfully!`, 'success');
    }
  };

  const cancelDeleteMrvaEntry = () => {
    setShowConfirmDeleteMrva(false);
    setMrvaEntryToDelete(null);
  };

  const handleEditMrvaEntry = (entry) => {
    setEditingMrvaEntry(entry);
    setMrvaData({
      name: entry.name,
      coordinates: entry.coordinates,
      altitude: entry.altitude,
      labelCoordinate: entry.labelCoordinate,
    });
  };

  const handleUpdateMrvaEntry = () => {
    // Check if all required fields are filled
    const requiredFields = ['name', 'coordinates', 'altitude', 'labelCoordinate'];
    const emptyFields = requiredFields.filter(field => !mrvaData[field]);
    
    if (emptyFields.length > 0) {
      // Set validation errors for empty fields
      const errors = {};
      emptyFields.forEach(field => {
        errors[field] = true;
      });
      setValidationErrors(errors);
      return;
    }

    // Update the entry
    setMrvaEntries(prev => prev.map(entry => 
      entry.id === editingMrvaEntry.id 
        ? { ...entry, name: mrvaData.name, coordinates: mrvaData.coordinates, altitude: mrvaData.altitude, labelCoordinate: mrvaData.labelCoordinate }
        : entry
    ));
    
    // Clear form and editing state
    setMrvaData({
      name: '',
      coordinates: '',
      altitude: '',
      labelCoordinate: '',
    });
    setEditingMrvaEntry(null);
    
    // Clear validation errors
    setValidationErrors({});
    
    // Reset resizable textareas to default height
    setTimeout(() => {
      const textareas = document.querySelectorAll('textarea[placeholder="Enter input..."], textarea[placeholder="Enter coordinates..."]');
      textareas.forEach(textarea => {
        textarea.style.height = '40px';
      });
    }, 10);
    
    // Show success notification
    showNotification('MRVA entry updated successfully!', 'success');
  };

  const handleCancelEditMrva = () => {
    setEditingMrvaEntry(null);
    setMrvaData({
      name: '',
      coordinates: '',
      altitude: '',
      labelCoordinate: '',
    });
    setValidationErrors({});
    
    // Reset resizable textareas to default height
    setTimeout(() => {
      const textareas = document.querySelectorAll('textarea[placeholder="Enter input..."], textarea[placeholder="Enter coordinates..."]');
      textareas.forEach(textarea => {
        textarea.style.height = '40px';
      });
    }, 10);
  };

  // GLIDEPATH data handling functions
  const handleGlidepathDataChange = (field, value) => {
    setGlidepathData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddGlidepathEntry = () => {
    // Check if all required fields are filled
    const requiredFields = ['rwy', 'angle', 'length'];
    const emptyFields = requiredFields.filter(field => !glidepathData[field]);
    
    if (emptyFields.length > 0) {
      // Set validation errors for empty fields
      const errors = {};
      emptyFields.forEach(field => {
        errors[field] = true;
      });
      setValidationErrors(errors);
      return;
    }

    const newGlidepathEntry = {
      id: Math.random().toString(36).substr(2, 9),
      rwy: glidepathData.rwy,
      angle: glidepathData.angle,
      length: glidepathData.length,
      createdAt: new Date().toISOString()
    };

    setGlidepathEntries(prev => [...prev, newGlidepathEntry]);
    
    // Clear form
    setGlidepathData({
      rwy: '',
      angle: '',
      length: '',
    });
    
    // Clear validation errors
    setValidationErrors({});
    
    // Show success notification
    showNotification('GLIDEPATH entry added successfully!', 'success');
  };

  const handleDeleteGlidepathEntry = (id) => {
    setGlidepathEntries(prev => prev.filter(entry => entry.id !== id));
    showNotification('GLIDEPATH entry deleted successfully!', 'success');
  };

  const handleEditGlidepathEntry = (entry) => {
    setEditingGlidepathEntry(entry);
    setGlidepathData({
      rwy: entry.rwy,
      angle: entry.angle,
      length: entry.length,
    });
  };

  const handleUpdateGlidepathEntry = () => {
    // Check if all required fields are filled
    const requiredFields = ['rwy', 'angle', 'length'];
    const emptyFields = requiredFields.filter(field => !glidepathData[field]);
    
    if (emptyFields.length > 0) {
      // Set validation errors for empty fields
      const errors = {};
      emptyFields.forEach(field => {
        errors[field] = true;
      });
      setValidationErrors(errors);
      return;
    }

    // Update the entry
    setGlidepathEntries(prev => prev.map(entry => 
      entry.id === editingGlidepathEntry.id 
        ? { ...entry, rwy: glidepathData.rwy, angle: glidepathData.angle, length: glidepathData.length }
        : entry
    ));
    
    // Clear form and editing state
    setGlidepathData({
      rwy: '',
      angle: '',
      length: '',
    });
    setEditingGlidepathEntry(null);
    
    // Clear validation errors
    setValidationErrors({});
    
    // Show success notification
    showNotification('GLIDEPATH entry updated successfully!', 'success');
  };

  const handleCancelEditGlidepath = () => {
    setEditingGlidepathEntry(null);
    setGlidepathData({
      rwy: '',
      angle: '',
      length: '',
    });
    setValidationErrors({});
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
    // Check if we're in welcome view and no airport view is active
    if (currentView === 'welcome' && !currentAirportView) return;
    
    // Close all dropdowns and objects
    setShowAirportsDropdown(false);
    setClickedAirport(null);
    setShowSubDropdown(null);
    setShowGeneralFilesDropdown(null);
    setShowConfig1Dropdown(null);
    setShowConfig2Dropdown(null);
    setShowNavAidsDropdown(null);
    setShowProcsDropdown(null);
    setShowTrafficView(null);
    setActiveFourthLevelDropdown(null);
    setOpenConfigDropdowns({});
    setCurrentAirportView(null);
    setShowNameInput(false);
    setNameInputValue('');
    setNameInputType('');
    setSelectedAirportForConfig('');
    setShowAirportDropdownForConfig(false);
    setAirportSearchForConfig('');
    setSelectedAirportForManageConfigs('');
    setShowAirportDropdownForManageConfigs(false);
    setAirportSearchForManageConfigs('');
    setShowWakeCategoryDropdown(false);
    setShowZoomTooltip(false);
    setLogoHovered(false);
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView('welcome');
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
      setClickedAirport(null);
      setShowSubDropdown(null);
      setShowGeneralFilesDropdown(null);
      setShowConfig1Dropdown(null);
      setShowConfig2Dropdown(null);
      setShowNavAidsDropdown(null);
      setShowProcsDropdown(null);
      setShowTrafficView(null);
      setActiveFourthLevelDropdown(null);
    }
  };

  const handleFourthLevelDropdown = (dropdownType, airportId) => {
    if (activeFourthLevelDropdown === dropdownType) {
      // Close the current dropdown
      setActiveFourthLevelDropdown(null);
      setShowNavAidsDropdown(null);
      setShowProcsDropdown(null);
    } else {
      // Close all fourth-level dropdowns first, then open the selected one
      setActiveFourthLevelDropdown(dropdownType);
      setShowNavAidsDropdown(dropdownType === 'navAids' ? airportId : null);
      setShowProcsDropdown(dropdownType === 'procs' ? airportId : null);
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
    if (nameInputType === 'new-config') {
      // For new-config, validate airport selection and create config
      if (!selectedAirportForConfig) {
        showNotification('Please select an airport!', 'error');
        return;
      }
      
      const configName = `Config ${nameInputValue.trim()}`;
      
      // Add the new config to the configs array
      const newConfig = {
        id: Date.now().toString(),
        name: configName,
        airport: selectedAirportForConfig,
        type: 'custom'
      };
      
      const updatedConfigs = [...configs, newConfig];
      setConfigs(updatedConfigs);
      localStorage.setItem('configs', JSON.stringify(updatedConfigs));
      
      showNotification(`Config ${configName} created for ${selectedAirportForConfig} successfully!`);
      
      setShowNameInput(false);
      setNameInputValue('');
      setNameInputType('');
      setSelectedAirportForConfig('');
      setShowAirportDropdownForConfig(false);
      setAirportSearchForConfig('');
    } else {
      // For new airport
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
      console.log('=== Creating new airport ===');
      console.log('Current airports:', airports);
      console.log('New airport:', newAirport);
      console.log('Updated airports:', updatedAirports);
      
      setAirports(updatedAirports);
      
      try {
        localStorage.setItem('airports', JSON.stringify(updatedAirports));
        console.log('Successfully saved to localStorage');
        
        // Verify it was saved
        const saved = localStorage.getItem('airports');
        console.log('Verified saved data:', saved);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
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
    }
  };

  const handleNameCancel = () => {
    setShowNameInput(false);
    setNameInputValue('');
    setNameInputType('');
    setSelectedAirportForConfig('');
    setShowAirportDropdownForConfig(false);
    setAirportSearchForConfig('');
  };

  const handleDeleteAirport = (airportId) => {
    const airport = airports.find(a => a.id === airportId);
    setAirportToDelete(airport);
    setShowConfirmDelete(true);
  };

  const confirmDeleteAirport = () => {
    if (airportToDelete) {
      const updatedAirports = airports.filter(airport => airport.id !== airportToDelete.id);
      setAirports(updatedAirports);
      localStorage.setItem('airports', JSON.stringify(updatedAirports));
      
      if (selectedAirport === airportToDelete.id) {
        setSelectedAirport('');
      }
      setShowConfirmDelete(false);
      setAirportToDelete(null);
      
      showNotification(`Airport ${airportToDelete.name} deleted successfully!`);
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

  // Config management functions
  const handleRenameConfig = (configName) => {
    setConfigToRename(configName);
    // Extract the part after "Config " for editing
    const afterConfig = configName.replace(/^Config /, '');
    setNewConfigName(`Config ${afterConfig}`);
    setShowRenameConfig(true);
  };

  const handleDeleteConfig = (configName) => {
    setConfigToDelete(configName);
    setShowDeleteConfigConfirm(true);
  };

  const confirmRenameConfig = () => {
    if (!newConfigName.trim()) {
      showNotification('Please enter a config name!', 'error');
      return;
    }
    
    // Update the config name in the configs array
    const updatedConfigs = configs.map(config => 
      config.name === configToRename 
        ? { ...config, name: newConfigName }
        : config
    );
    
    setConfigs(updatedConfigs);
    
    showNotification(`Config renamed from "${configToRename}" to "${newConfigName}" successfully!`);
    
    setShowRenameConfig(false);
    setConfigToRename('');
    setNewConfigName('');
  };

  const cancelRenameConfig = () => {
    setShowRenameConfig(false);
    setConfigToRename('');
    setNewConfigName('');
  };

  const confirmDeleteConfig = () => {
    // Remove the config from the configs array
    const updatedConfigs = configs.filter(config => config.name !== configToDelete);
    setConfigs(updatedConfigs);
    
    showNotification(`Config "${configToDelete}" deleted successfully!`);
    
    setShowDeleteConfigConfirm(false);
    setConfigToDelete('');
  };

  const cancelDeleteConfig = () => {
    setShowDeleteConfigConfirm(false);
    setConfigToDelete('');
  };

  // Airport rename functions
  const handleRenameAirport = (airport) => {
    setAirportToRename(airport);
    setNewAirportName(airport.name);
    setShowRenameAirport(true);
  };

  const confirmRenameAirport = () => {
    if (!newAirportName.trim()) {
      showNotification('Please enter an airport name!', 'error');
      return;
    }
    
    const airportName = newAirportName.trim().toUpperCase();
    
    // Check if airport with this ICAO already exists (excluding the current one being renamed)
    const existingAirport = airports.find(airport => 
      airport.name === airportName && airport.id !== airportToRename.id
    );
    if (existingAirport) {
      showNotification(`Airport with ICAO "${airportName}" already exists!`, 'error');
      return;
    }
    
    // Update the airport name
    const updatedAirports = airports.map(airport => 
      airport.id === airportToRename.id 
        ? { ...airport, name: airportName }
        : airport
    );
    
    setAirports(updatedAirports);
    localStorage.setItem('airports', JSON.stringify(updatedAirports));
    
    showNotification(`Airport renamed to "${airportName}" successfully!`);
    
    setShowRenameAirport(false);
    setAirportToRename(null);
    setNewAirportName('');
  };

  const cancelRenameAirport = () => {
    setShowRenameAirport(false);
    setAirportToRename(null);
    setNewAirportName('');
  };

  // Helper function to get config name by ID
  const getConfigName = (configId) => {
    const config = configs.find(c => c.id === configId);
    return config ? config.name : `Config ${configId}`;
  };

  // Helper function to handle config dropdown toggle
  const toggleConfigDropdown = (configId, airportId) => {
    setOpenConfigDropdowns(prev => ({
      ...prev,
      [configId]: prev[configId] === airportId ? null : airportId
    }));
  };

  // Helper function to check if config dropdown is open
  const isConfigDropdownOpen = (configId, airportId) => {
    return openConfigDropdowns[configId] === airportId;
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
    textarea: {
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      width: '100%',
      boxSizing: 'border-box',
      resize: 'vertical',
      minHeight: '40px',
      maxHeight: '400px', // Increased for longer content
      overflowY: 'auto',
      lineHeight: '1.4',
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
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      fontFamily: 'Inter, sans-serif',
      minWidth: '80px',
    },
    nameInputButtonCancel: {
      backgroundColor: '#ffffff',
      color: '#374151',
      border: '1px solid #d1d5db',
      transition: 'all 0.2s ease',
    },
    nameInputButtonSubmit: {
      backgroundColor: '#0B1E39',
      color: 'white',
      border: '1px solid #0B1E39',
      transition: 'all 0.2s ease',
    },
    nameInputButtonCancelHover: {
      backgroundColor: '#f9fafb',
      borderColor: '#9ca3af',
    },
    nameInputButtonSubmitHover: {
      backgroundColor: '#1e3a8a',
      borderColor: '#1e3a8a',
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
    navDropdownItemWithArrow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
    },
    navDropdownArrow: {
      fontSize: '18px',
      color: 'inherit',
      transition: 'transform 0.2s ease',
      display: 'flex',
      alignItems: 'center',
    },
    navSubDropdownContainer: {
      position: 'absolute',
      left: '100%',
      top: '0',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      minWidth: '140px',
      zIndex: 10000,
    },
    navSubDropdownItem: {
      padding: '12px 16px',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      cursor: 'pointer',
      borderBottom: '1px solid #f3f4f6',
      transition: 'background-color 0.15s ease-out',
      color: '#374151',
    },
    navSubDropdownItemHover: {
      backgroundColor: '#f9fafb',
    },
    navSubDropdownItemSelected: {
      backgroundColor: '#f3f4f6',
      color: '#0B1E39',
      fontWeight: '500',
    },
    navSubDropdownItemWithArrow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
    },
    navGeneralFilesDropdownContainer: {
      position: 'absolute',
      left: '100%',
      top: '0',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      minWidth: '120px',
      zIndex: 10001,
    },
    navConfigDropdownContainer: {
      position: 'absolute',
      left: '100%',
      top: '0',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      minWidth: '120px',
      zIndex: 10001,
    },
    navFourthLevelDropdownContainer: {
      position: 'absolute',
      left: '100%',
      top: '0',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      minWidth: '120px',
      zIndex: 10002,
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
            transform: isTransitioning ? 'scale(0.95)' : logoHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.2s ease-in-out',
          }} 
          xmlns="http://www.w3.org/2000/svg" 
          width="64" 
          height="64" 
          viewBox="0 0 64 64" 
          role="img" 
          aria-label="Route icon" 
          onClick={handleLogoClick}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
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
            onClick={() => {
              setShowAirportsDropdown(!showAirportsDropdown);
              if (showAirportsDropdown) {
                setShowSubDropdown(null);
                setClickedAirport(null);
              }
            }}
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
                        ...styles.navDropdownItemWithArrow,
                        ...(selectedAirport === airport.id ? styles.navDropdownItemSelected : {}),
                      }}
                      onClick={() => {
                        console.log('Airport clicked:', airport.name, 'Current clickedAirport:', clickedAirport);
                        if (clickedAirport === airport.id) {
                          setClickedAirport(null);
                          setShowSubDropdown(null);
                        } else {
                          setClickedAirport(airport.id);
                          setShowSubDropdown(airport.id);
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (selectedAirport !== airport.id && clickedAirport !== airport.id) {
                          e.target.style.backgroundColor = styles.navDropdownItemHover.backgroundColor;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedAirport !== airport.id && clickedAirport !== airport.id) {
                          e.target.style.backgroundColor = '';
                        }
                      }}
                    >
                      <span>{airport.name}</span>
                      <span className="material-symbols-outlined" style={styles.navDropdownArrow}>arrow_forward_ios</span>
                      
                      {/* Sub-dropdown */}
                      {console.log('Rendering sub-dropdown for:', airport.name, 'showSubDropdown:', showSubDropdown, 'airport.id:', airport.id)}
                      {showSubDropdown === airport.id && (
                        <div 
                          style={styles.navSubDropdownContainer}
                        >
                          <div 
                            style={{
                              ...styles.navSubDropdownItem,
                              ...styles.navSubDropdownItemWithArrow,
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                            onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event from bubbling up to parent
                              console.log('General Files clicked for:', airport.name, 'Current showGeneralFilesDropdown:', showGeneralFilesDropdown, 'airport.id:', airport.id);
                              if (showGeneralFilesDropdown === airport.id) {
                                setShowGeneralFilesDropdown(null);
                              } else {
                                // Close all other third-level dropdowns first
                                setShowGeneralFilesDropdown(null);
                                setShowConfig1Dropdown(null);
                                setShowConfig2Dropdown(null);
                                setShowNavAidsDropdown(null);
                                setShowProcsDropdown(null);
                                setShowTrafficView(null);
                                // Then open this one
                                setShowGeneralFilesDropdown(airport.id);
                              }
                            }}
                          >
                            <span>General Files</span>
                            <span className="material-symbols-outlined" style={styles.navDropdownArrow}>arrow_forward_ios</span>
                            
                            {/* General Files Sub-dropdown */}
                            {console.log('Rendering General Files dropdown for:', airport.name, 'showGeneralFilesDropdown:', showGeneralFilesDropdown, 'airport.id:', airport.id)}
                            {showGeneralFilesDropdown === airport.id && (
                              <div style={styles.navGeneralFilesDropdownContainer}>
                                <div 
                                  style={{
                                    ...styles.navSubDropdownItem,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('INFO clicked for', airport.name);
                                    // Toggle the view
                                    if (currentAirportView && currentAirportView.type === 'info' && currentAirportView.airport.id === airport.id) {
                                      setCurrentAirportView(null);
                                    } else {
                                      setCurrentAirportView({ type: 'info', airport: airport });
                                    }
                                    setShowAirportsDropdown(false);
                                    setClickedAirport(null);
                                    setShowGeneralFilesDropdown(null);
                                    setShowConfig1Dropdown(null);
                                    setShowConfig2Dropdown(null);
                                    setShowNavAidsDropdown(null);
                                    setShowProcsDropdown(null);
                                    setShowTrafficView(null);
                                    setActiveFourthLevelDropdown(null);
                                  }}
                                >
                                  <span>INFO</span>
                                  {currentAirportView && currentAirportView.type === 'info' && currentAirportView.airport.id === airport.id && (
                                    <span className="material-icons" style={{color: '#10b981', fontSize: '18px'}}>check</span>
                                  )}
                                </div>
                                <div 
                                  style={{
                                    ...styles.navSubDropdownItem,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('RUNWAYS clicked for', airport.name);
                                    // Toggle the view
                                    if (currentAirportView && currentAirportView.type === 'runways' && currentAirportView.airport.id === airport.id) {
                                      setCurrentAirportView(null);
                                    } else {
                                      setCurrentAirportView({ type: 'runways', airport: airport });
                                    }
                                    setShowAirportsDropdown(false);
                                    setClickedAirport(null);
                                    setShowGeneralFilesDropdown(null);
                                    setShowConfig1Dropdown(null);
                                    setShowConfig2Dropdown(null);
                                    setShowNavAidsDropdown(null);
                                    setShowProcsDropdown(null);
                                    setShowTrafficView(null);
                                    setActiveFourthLevelDropdown(null);
                                  }}
                                >
                                  <span>RUNWAYS</span>
                                  {currentAirportView && currentAirportView.type === 'runways' && currentAirportView.airport.id === airport.id && (
                                    <span className="material-icons" style={{color: '#10b981', fontSize: '18px'}}>check</span>
                                  )}
                                </div>
                                <div 
                                  style={{
                                    ...styles.navSubDropdownItem,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('GEO clicked for', airport.name);
                                    // Toggle the view
                                    if (currentAirportView && currentAirportView.type === 'geo' && currentAirportView.airport.id === airport.id) {
                                      setCurrentAirportView(null);
                                    } else {
                                      setCurrentAirportView({ type: 'geo', airport: airport });
                                    }
                                    setShowAirportsDropdown(false);
                                    setClickedAirport(null);
                                    setShowGeneralFilesDropdown(null);
                                    setShowConfig1Dropdown(null);
                                    setShowConfig2Dropdown(null);
                                    setShowNavAidsDropdown(null);
                                    setShowProcsDropdown(null);
                                    setShowTrafficView(null);
                                    setActiveFourthLevelDropdown(null);
                                  }}
                                >
                                  <span>GEO</span>
                                  {currentAirportView && currentAirportView.type === 'geo' && currentAirportView.airport.id === airport.id && (
                                    <span className="material-icons" style={{color: '#10b981', fontSize: '18px'}}>check</span>
                                  )}
                                </div>
                                <div 
                                  style={{
                                    ...styles.navSubDropdownItem,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('MRVA clicked for', airport.name);
                                    // Toggle the view
                                    if (currentAirportView && currentAirportView.type === 'mrva' && currentAirportView.airport.id === airport.id) {
                                      setCurrentAirportView(null);
                                    } else {
                                      setCurrentAirportView({ type: 'mrva', airport: airport });
                                    }
                                    setShowAirportsDropdown(false);
                                    setClickedAirport(null);
                                    setShowGeneralFilesDropdown(null);
                                    setShowConfig1Dropdown(null);
                                    setShowConfig2Dropdown(null);
                                    setShowNavAidsDropdown(null);
                                    setShowProcsDropdown(null);
                                    setShowTrafficView(null);
                                    setActiveFourthLevelDropdown(null);
                                  }}
                                >
                                  <span>MRVA</span>
                                  {currentAirportView && currentAirportView.type === 'mrva' && currentAirportView.airport.id === airport.id && (
                                    <span className="material-icons" style={{color: '#10b981', fontSize: '18px'}}>check</span>
                                  )}
                                </div>
                                <div 
                                  style={{
                                    ...styles.navSubDropdownItem,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Toggle the view
                                    if (currentAirportView && currentAirportView.type === 'traffic' && currentAirportView.airport.id === airport.id) {
                                      setCurrentAirportView(null);
                                    } else {
                                      setCurrentAirportView({ type: 'traffic', airport: airport });
                                    }
                                    setShowAirportsDropdown(false);
                                    setClickedAirport(null);
                                    setShowGeneralFilesDropdown(null);
                                    setShowConfig1Dropdown(null);
                                    setShowConfig2Dropdown(null);
                                    setShowNavAidsDropdown(null);
                                    setShowProcsDropdown(null);
                                    setActiveFourthLevelDropdown(null);
                                  }}
                                >
                                  <span>TRAFFIC</span>
                                  {currentAirportView && currentAirportView.type === 'traffic' && currentAirportView.airport.id === airport.id && (
                                    <span className="material-icons" style={{color: '#10b981', fontSize: '18px'}}>check</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div 
                            style={{
                              ...styles.navSubDropdownItem,
                              ...styles.navSubDropdownItemWithArrow,
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                            onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (showConfig1Dropdown === airport.id) {
                                setShowConfig1Dropdown(null);
                              } else {
                                // Close all other third-level dropdowns first
                                setShowGeneralFilesDropdown(null);
                                setShowConfig1Dropdown(null);
                                setShowConfig2Dropdown(null);
                                setShowNavAidsDropdown(null);
                                setShowProcsDropdown(null);
                                setShowTrafficView(null);
                                // Then open this one
                                setShowConfig1Dropdown(airport.id);
                              }
                            }}
                          >
                            <span>{getConfigName('1')}</span>
                            <span className="material-symbols-outlined" style={styles.navDropdownArrow}>arrow_forward_ios</span>
                            
                            {/* Config 1 Sub-dropdown */}
                            {showConfig1Dropdown === airport.id && (
                              <div style={styles.navConfigDropdownContainer}>
                                <div 
                                  style={styles.navSubDropdownItem}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(`GLIDEPATH clicked for ${getConfigName('1')}`, airport.name);
                                    // Toggle the view
                                    if (currentAirportView && currentAirportView.type === 'glidepath' && currentAirportView.airport.id === airport.id) {
                                      setCurrentAirportView(null);
                                    } else {
                                      setCurrentAirportView({ type: 'glidepath', airport: airport });
                                    }
                                    // Close all dropdowns
                                    setShowAirportsDropdown(false);
                                    setClickedAirport(null);
                                    setShowGeneralFilesDropdown(null);
                                    setShowConfig1Dropdown(null);
                                    setShowConfig2Dropdown(null);
                                    setShowNavAidsDropdown(null);
                                    setShowProcsDropdown(null);
                                    setShowTrafficView(null);
                                    setActiveFourthLevelDropdown(null);
                                  }}
                                >
                                  <span>GLIDEPATH</span>
                                  {currentAirportView && currentAirportView.type === 'glidepath' && currentAirportView.airport.id === airport.id && (
                                    <span className="material-icons" style={{color: '#10b981', fontSize: '18px'}}>check</span>
                                  )}
                                </div>
                                <div 
                                  style={styles.navSubDropdownItem}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(`SECTORS clicked for ${getConfigName('1')}`, airport.name);
                                    // Close all dropdowns
                                    setShowAirportsDropdown(false);
                                    setClickedAirport(null);
                                    setShowGeneralFilesDropdown(null);
                                    setShowConfig1Dropdown(null);
                                    setShowConfig2Dropdown(null);
                                    setShowNavAidsDropdown(null);
                                    setShowProcsDropdown(null);
                                    setShowTrafficView(null);
                                    setActiveFourthLevelDropdown(null);
                                  }}
                                >
                                  SECTORS
                                </div>
                                <div 
                                  style={{
                                    ...styles.navSubDropdownItem,
                                    ...styles.navSubDropdownItemWithArrow,
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (showNavAidsDropdown === airport.id) {
                                      setShowNavAidsDropdown(null);
                                    } else {
                                      setShowNavAidsDropdown(airport.id);
                                      setShowProcsDropdown(null); // Close PROCS dropdown when opening NAVAIDS
                                    }
                                  }}
                                >
                                  <span>NAVAIDS</span>
                                  <span className="material-symbols-outlined" style={styles.navDropdownArrow}>arrow_forward_ios</span>
                                  
                                  {/* NAVAIDS Sub-dropdown */}
                                  {showNavAidsDropdown === airport.id && (
                                    <div style={styles.navFourthLevelDropdownContainer}>
                                      <div 
                                        style={styles.navSubDropdownItem}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(`FIX clicked for NAVAIDS ${getConfigName('1')}`, airport.name);
                                          // Close all dropdowns
                                          setShowAirportsDropdown(false);
                                          setClickedAirport(null);
                                          setShowGeneralFilesDropdown(null);
                                          setShowConfig1Dropdown(null);
                                          setShowConfig2Dropdown(null);
                                          setShowNavAidsDropdown(null);
                                          setShowProcsDropdown(null);
                                          setShowTrafficView(null);
                                          setActiveFourthLevelDropdown(null);
                                        }}
                                      >
                                        FIX
                                      </div>
                                      <div 
                                        style={styles.navSubDropdownItem}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(`VOR clicked for NAVAIDS ${getConfigName('1')}`, airport.name);
                                          // Close all dropdowns
                                          setShowAirportsDropdown(false);
                                          setClickedAirport(null);
                                          setShowGeneralFilesDropdown(null);
                                          setShowConfig1Dropdown(null);
                                          setShowConfig2Dropdown(null);
                                          setShowNavAidsDropdown(null);
                                          setShowProcsDropdown(null);
                                          setShowTrafficView(null);
                                          setActiveFourthLevelDropdown(null);
                                        }}
                                      >
                                        VOR
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div 
                                  style={{
                                    ...styles.navSubDropdownItem,
                                    ...styles.navSubDropdownItemWithArrow,
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (showProcsDropdown === airport.id) {
                                      setShowProcsDropdown(null);
                                    } else {
                                      setShowProcsDropdown(airport.id);
                                      setShowNavAidsDropdown(null); // Close NAVAIDS dropdown when opening PROCS
                                    }
                                  }}
                                >
                                  <span>PROCS</span>
                                  <span className="material-symbols-outlined" style={styles.navDropdownArrow}>arrow_forward_ios</span>
                                  
                                  {/* PROCS Sub-dropdown */}
                                  {showProcsDropdown === airport.id && (
                                    <div style={styles.navFourthLevelDropdownContainer}>
                                      <div 
                                        style={styles.navSubDropdownItem}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(`IAC clicked for PROCS ${getConfigName('1')}`, airport.name);
                                          // Close all dropdowns
                                          setShowAirportsDropdown(false);
                                          setClickedAirport(null);
                                          setShowGeneralFilesDropdown(null);
                                          setShowConfig1Dropdown(null);
                                          setShowConfig2Dropdown(null);
                                          setShowNavAidsDropdown(null);
                                          setShowProcsDropdown(null);
                                          setShowTrafficView(null);
                                          setActiveFourthLevelDropdown(null);
                                        }}
                                      >
                                        IAC
                                      </div>
                                      <div 
                                        style={styles.navSubDropdownItem}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(`SID clicked for PROCS ${getConfigName('1')}`, airport.name);
                                          // Close all dropdowns
                                          setShowAirportsDropdown(false);
                                          setClickedAirport(null);
                                          setShowGeneralFilesDropdown(null);
                                          setShowConfig1Dropdown(null);
                                          setShowConfig2Dropdown(null);
                                          setShowNavAidsDropdown(null);
                                          setShowProcsDropdown(null);
                                          setShowTrafficView(null);
                                          setActiveFourthLevelDropdown(null);
                                        }}
                                      >
                                        SID
                                      </div>
                                      <div 
                                        style={styles.navSubDropdownItem}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(`STAR clicked for PROCS ${getConfigName('1')}`, airport.name);
                                          // Close all dropdowns
                                          setShowAirportsDropdown(false);
                                          setClickedAirport(null);
                                          setShowGeneralFilesDropdown(null);
                                          setShowConfig1Dropdown(null);
                                          setShowConfig2Dropdown(null);
                                          setShowNavAidsDropdown(null);
                                          setShowProcsDropdown(null);
                                          setShowTrafficView(null);
                                          setActiveFourthLevelDropdown(null);
                                        }}
                                      >
                                        STAR
                                      </div>
                                      <div 
                                        style={styles.navSubDropdownItem}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(`TRANSITION clicked for PROCS ${getConfigName('1')}`, airport.name);
                                          // Close all dropdowns
                                          setShowAirportsDropdown(false);
                                          setClickedAirport(null);
                                          setShowGeneralFilesDropdown(null);
                                          setShowConfig1Dropdown(null);
                                          setShowConfig2Dropdown(null);
                                          setShowNavAidsDropdown(null);
                                          setShowProcsDropdown(null);
                                          setShowTrafficView(null);
                                          setActiveFourthLevelDropdown(null);
                                        }}
                                      >
                                        TRANSITION
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div 
                            style={{
                              ...styles.navSubDropdownItem,
                              ...styles.navSubDropdownItemWithArrow,
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                            onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (showConfig2Dropdown === airport.id) {
                                setShowConfig2Dropdown(null);
                              } else {
                                // Close all other third-level dropdowns first
                                setShowGeneralFilesDropdown(null);
                                setShowConfig1Dropdown(null);
                                setShowConfig2Dropdown(null);
                                setShowNavAidsDropdown(null);
                                setShowProcsDropdown(null);
                                setShowTrafficView(null);
                                // Then open this one
                                setShowConfig2Dropdown(airport.id);
                              }
                            }}
                          >
                            <span>{getConfigName('2')}</span>
                            <span className="material-symbols-outlined" style={styles.navDropdownArrow}>arrow_forward_ios</span>
                            
                            {/* Config 2 Sub-dropdown */}
                            {showConfig2Dropdown === airport.id && (
                              <div style={styles.navConfigDropdownContainer}>
                                <div 
                                  style={styles.navSubDropdownItem}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(`GLIDEPATH clicked for ${getConfigName('2')}`, airport.name);
                                    // Toggle the view
                                    if (currentAirportView && currentAirportView.type === 'glidepath' && currentAirportView.airport.id === airport.id) {
                                      setCurrentAirportView(null);
                                    } else {
                                      setCurrentAirportView({ type: 'glidepath', airport: airport });
                                    }
                                    // Close all dropdowns
                                    setShowAirportsDropdown(false);
                                    setClickedAirport(null);
                                    setShowGeneralFilesDropdown(null);
                                    setShowConfig1Dropdown(null);
                                    setShowConfig2Dropdown(null);
                                    setShowNavAidsDropdown(null);
                                    setShowProcsDropdown(null);
                                    setShowTrafficView(null);
                                    setActiveFourthLevelDropdown(null);
                                  }}
                                >
                                  <span>GLIDEPATH</span>
                                  {currentAirportView && currentAirportView.type === 'glidepath' && currentAirportView.airport.id === airport.id && (
                                    <span className="material-icons" style={{color: '#10b981', fontSize: '18px'}}>check</span>
                                  )}
                                </div>
                                <div 
                                  style={styles.navSubDropdownItem}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(`SECTORS clicked for ${getConfigName('2')}`, airport.name);
                                    // Close all dropdowns
                                    setShowAirportsDropdown(false);
                                    setClickedAirport(null);
                                    setShowGeneralFilesDropdown(null);
                                    setShowConfig1Dropdown(null);
                                    setShowConfig2Dropdown(null);
                                    setShowNavAidsDropdown(null);
                                    setShowProcsDropdown(null);
                                    setShowTrafficView(null);
                                    setActiveFourthLevelDropdown(null);
                                  }}
                                >
                                  SECTORS
                                </div>
                                <div 
                                  style={{
                                    ...styles.navSubDropdownItem,
                                    ...styles.navSubDropdownItemWithArrow,
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (showNavAidsDropdown === airport.id) {
                                      setShowNavAidsDropdown(null);
                                    } else {
                                      setShowNavAidsDropdown(airport.id);
                                      setShowProcsDropdown(null); // Close PROCS dropdown when opening NAVAIDS
                                    }
                                  }}
                                >
                                  <span>NAVAIDS</span>
                                  <span className="material-symbols-outlined" style={styles.navDropdownArrow}>arrow_forward_ios</span>
                                  
                                  {/* NAVAIDS Sub-dropdown */}
                                  {showNavAidsDropdown === airport.id && (
                                    <div style={styles.navFourthLevelDropdownContainer}>
                                      <div 
                                        style={styles.navSubDropdownItem}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(`FIX clicked for NAVAIDS ${getConfigName('2')}`, airport.name);
                                          // Close all dropdowns
                                          setShowAirportsDropdown(false);
                                          setClickedAirport(null);
                                          setShowGeneralFilesDropdown(null);
                                          setShowConfig1Dropdown(null);
                                          setShowConfig2Dropdown(null);
                                          setShowNavAidsDropdown(null);
                                          setShowProcsDropdown(null);
                                          setShowTrafficView(null);
                                          setActiveFourthLevelDropdown(null);
                                        }}
                                      >
                                        FIX
                                      </div>
                                      <div 
                                        style={styles.navSubDropdownItem}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(`VOR clicked for NAVAIDS ${getConfigName('2')}`, airport.name);
                                          // Close all dropdowns
                                          setShowAirportsDropdown(false);
                                          setClickedAirport(null);
                                          setShowGeneralFilesDropdown(null);
                                          setShowConfig1Dropdown(null);
                                          setShowConfig2Dropdown(null);
                                          setShowNavAidsDropdown(null);
                                          setShowProcsDropdown(null);
                                          setShowTrafficView(null);
                                          setActiveFourthLevelDropdown(null);
                                        }}
                                      >
                                        VOR
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div 
                                  style={{
                                    ...styles.navSubDropdownItem,
                                    ...styles.navSubDropdownItemWithArrow,
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (showProcsDropdown === airport.id) {
                                      setShowProcsDropdown(null);
                                    } else {
                                      setShowProcsDropdown(airport.id);
                                      setShowNavAidsDropdown(null); // Close NAVAIDS dropdown when opening PROCS
                                    }
                                  }}
                                >
                                  <span>PROCS</span>
                                  <span className="material-symbols-outlined" style={styles.navDropdownArrow}>arrow_forward_ios</span>
                                  
                                  {/* PROCS Sub-dropdown */}
                                  {showProcsDropdown === airport.id && (
                                    <div style={styles.navFourthLevelDropdownContainer}>
                                      <div 
                                        style={styles.navSubDropdownItem}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(`IAC clicked for PROCS ${getConfigName('2')}`, airport.name);
                                          // Close all dropdowns
                                          setShowAirportsDropdown(false);
                                          setClickedAirport(null);
                                          setShowGeneralFilesDropdown(null);
                                          setShowConfig1Dropdown(null);
                                          setShowConfig2Dropdown(null);
                                          setShowNavAidsDropdown(null);
                                          setShowProcsDropdown(null);
                                          setShowTrafficView(null);
                                          setActiveFourthLevelDropdown(null);
                                        }}
                                      >
                                        IAC
                                      </div>
                                      <div 
                                        style={styles.navSubDropdownItem}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(`SID clicked for PROCS ${getConfigName('2')}`, airport.name);
                                          // Close all dropdowns
                                          setShowAirportsDropdown(false);
                                          setClickedAirport(null);
                                          setShowGeneralFilesDropdown(null);
                                          setShowConfig1Dropdown(null);
                                          setShowConfig2Dropdown(null);
                                          setShowNavAidsDropdown(null);
                                          setShowProcsDropdown(null);
                                          setShowTrafficView(null);
                                          setActiveFourthLevelDropdown(null);
                                        }}
                                      >
                                        SID
                                      </div>
                                      <div 
                                        style={styles.navSubDropdownItem}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(`STAR clicked for PROCS ${getConfigName('2')}`, airport.name);
                                          // Close all dropdowns
                                          setShowAirportsDropdown(false);
                                          setClickedAirport(null);
                                          setShowGeneralFilesDropdown(null);
                                          setShowConfig1Dropdown(null);
                                          setShowConfig2Dropdown(null);
                                          setShowNavAidsDropdown(null);
                                          setShowProcsDropdown(null);
                                          setShowTrafficView(null);
                                          setActiveFourthLevelDropdown(null);
                                        }}
                                      >
                                        STAR
                                      </div>
                                      <div 
                                        style={styles.navSubDropdownItem}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(`TRANSITION clicked for PROCS ${getConfigName('2')}`, airport.name);
                                          // Close all dropdowns
                                          setShowAirportsDropdown(false);
                                          setClickedAirport(null);
                                          setShowGeneralFilesDropdown(null);
                                          setShowConfig1Dropdown(null);
                                          setShowConfig2Dropdown(null);
                                          setShowNavAidsDropdown(null);
                                          setShowProcsDropdown(null);
                                          setShowTrafficView(null);
                                          setActiveFourthLevelDropdown(null);
                                        }}
                                      >
                                        TRANSITION
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Dynamic Custom Configs */}
                          {configs
                            .filter(config => config.type === 'custom' && config.airport === airport.name)
                            .map((config) => (
                              <div key={config.id}>
                                <div 
                                  style={{
                                    ...styles.navSubDropdownItem,
                                    ...styles.navSubDropdownItemWithArrow,
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (openConfigDropdowns[config.id] === airport.id) {
                                      setOpenConfigDropdowns(prev => ({ ...prev, [config.id]: null }));
                                    } else {
                                      // Close all other third-level dropdowns first
                                      setShowGeneralFilesDropdown(null);
                                      setShowConfig1Dropdown(null);
                                      setShowConfig2Dropdown(null);
                                      setShowNavAidsDropdown(null);
                                      setShowProcsDropdown(null);
                                      setShowTrafficView(null);
                                      // Then open this one
                                      setOpenConfigDropdowns(prev => ({ ...prev, [config.id]: airport.id }));
                                    }
                                  }}
                                >
                                  <span>{config.name}</span>
                                  <span className="material-symbols-outlined" style={styles.navDropdownArrow}>arrow_forward_ios</span>
                                  
                                  {/* Custom Config Sub-dropdown */}
                                  {openConfigDropdowns[config.id] === airport.id && (
                                    <div style={styles.navConfigDropdownContainer}>
                                      <div 
                                        style={styles.navSubDropdownItem}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(`GLIDEPATH clicked for ${config.name}`, airport.name);
                                          // Toggle the view
                                          if (currentAirportView && currentAirportView.type === 'glidepath' && currentAirportView.airport.id === airport.id) {
                                            setCurrentAirportView(null);
                                          } else {
                                            setCurrentAirportView({ type: 'glidepath', airport: airport });
                                          }
                                          // Close all dropdowns
                                          setShowAirportsDropdown(false);
                                          setClickedAirport(null);
                                          setShowGeneralFilesDropdown(null);
                                          setShowConfig1Dropdown(null);
                                          setShowConfig2Dropdown(null);
                                          setShowNavAidsDropdown(null);
                                          setShowProcsDropdown(null);
                                          setShowTrafficView(null);
                                          setActiveFourthLevelDropdown(null);
                                          setOpenConfigDropdowns({});
                                        }}
                                      >
                                        <span>GLIDEPATH</span>
                                        {currentAirportView && currentAirportView.type === 'glidepath' && currentAirportView.airport.id === airport.id && (
                                          <span className="material-icons" style={{color: '#10b981', fontSize: '18px'}}>check</span>
                                        )}
                                      </div>
                                      <div 
                                        style={styles.navSubDropdownItem}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(`SECTORS clicked for ${config.name}`, airport.name);
                                          // Close all dropdowns
                                          setShowAirportsDropdown(false);
                                          setClickedAirport(null);
                                          setShowGeneralFilesDropdown(null);
                                          setShowConfig1Dropdown(null);
                                          setShowConfig2Dropdown(null);
                                          setShowNavAidsDropdown(null);
                                          setShowProcsDropdown(null);
                                          setShowTrafficView(null);
                                          setActiveFourthLevelDropdown(null);
                                          setOpenConfigDropdowns({});
                                        }}
                                      >
                                        SECTORS
                                      </div>
                                      <div 
                                        style={{
                                          ...styles.navSubDropdownItem,
                                          ...styles.navSubDropdownItemWithArrow,
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (showNavAidsDropdown === airport.id) {
                                            setShowNavAidsDropdown(null);
                                          } else {
                                            setShowNavAidsDropdown(airport.id);
                                            setShowProcsDropdown(null); // Close PROCS dropdown when opening NAVAIDS
                                          }
                                        }}
                                      >
                                        <span>NAVAIDS</span>
                                        <span className="material-symbols-outlined" style={styles.navDropdownArrow}>arrow_forward_ios</span>
                                        
                                        {/* NAVAIDS Sub-dropdown */}
                                        {showNavAidsDropdown === airport.id && (
                                          <div style={styles.navFourthLevelDropdownContainer}>
                                            <div 
                                              style={styles.navSubDropdownItem}
                                              onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                              onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                console.log(`FIX clicked for NAVAIDS ${config.name}`, airport.name);
                                                // Close all dropdowns
                                                setShowAirportsDropdown(false);
                                                setClickedAirport(null);
                                                setShowGeneralFilesDropdown(null);
                                                setShowConfig1Dropdown(null);
                                                setShowConfig2Dropdown(null);
                                                setShowNavAidsDropdown(null);
                                                setShowProcsDropdown(null);
                                                setShowTrafficView(null);
                                                setActiveFourthLevelDropdown(null);
                                                setOpenConfigDropdowns({});
                                              }}
                                            >
                                              FIX
                                            </div>
                                            <div 
                                              style={styles.navSubDropdownItem}
                                              onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                              onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                console.log(`VOR clicked for NAVAIDS ${config.name}`, airport.name);
                                                // Close all dropdowns
                                                setShowAirportsDropdown(false);
                                                setClickedAirport(null);
                                                setShowGeneralFilesDropdown(null);
                                                setShowConfig1Dropdown(null);
                                                setShowConfig2Dropdown(null);
                                                setShowNavAidsDropdown(null);
                                                setShowProcsDropdown(null);
                                                setShowTrafficView(null);
                                                setActiveFourthLevelDropdown(null);
                                                setOpenConfigDropdowns({});
                                              }}
                                            >
                                              VOR
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div 
                                        style={{
                                          ...styles.navSubDropdownItem,
                                          ...styles.navSubDropdownItemWithArrow,
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (showProcsDropdown === airport.id) {
                                            setShowProcsDropdown(null);
                                          } else {
                                            setShowProcsDropdown(airport.id);
                                            setShowNavAidsDropdown(null); // Close NAVAIDS dropdown when opening PROCS
                                          }
                                        }}
                                      >
                                        <span>PROCS</span>
                                        <span className="material-symbols-outlined" style={styles.navDropdownArrow}>arrow_forward_ios</span>
                                        
                                        {/* PROCS Sub-dropdown */}
                                        {showProcsDropdown === airport.id && (
                                          <div style={styles.navFourthLevelDropdownContainer}>
                                            <div 
                                              style={styles.navSubDropdownItem}
                                              onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                              onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                console.log(`IAC clicked for PROCS ${config.name}`, airport.name);
                                                // Close all dropdowns
                                                setShowAirportsDropdown(false);
                                                setClickedAirport(null);
                                                setShowGeneralFilesDropdown(null);
                                                setShowConfig1Dropdown(null);
                                                setShowConfig2Dropdown(null);
                                                setShowNavAidsDropdown(null);
                                                setShowProcsDropdown(null);
                                                setShowTrafficView(null);
                                                setActiveFourthLevelDropdown(null);
                                                setOpenConfigDropdowns({});
                                              }}
                                            >
                                              IAC
                                            </div>
                                            <div 
                                              style={styles.navSubDropdownItem}
                                              onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                              onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                console.log(`SID clicked for PROCS ${config.name}`, airport.name);
                                                // Close all dropdowns
                                                setShowAirportsDropdown(false);
                                                setClickedAirport(null);
                                                setShowGeneralFilesDropdown(null);
                                                setShowConfig1Dropdown(null);
                                                setShowConfig2Dropdown(null);
                                                setShowNavAidsDropdown(null);
                                                setShowProcsDropdown(null);
                                                setShowTrafficView(null);
                                                setActiveFourthLevelDropdown(null);
                                                setOpenConfigDropdowns({});
                                              }}
                                            >
                                              SID
                                            </div>
                                            <div 
                                              style={styles.navSubDropdownItem}
                                              onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                              onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                console.log(`STAR clicked for PROCS ${config.name}`, airport.name);
                                                // Close all dropdowns
                                                setShowAirportsDropdown(false);
                                                setClickedAirport(null);
                                                setShowGeneralFilesDropdown(null);
                                                setShowConfig1Dropdown(null);
                                                setShowConfig2Dropdown(null);
                                                setShowNavAidsDropdown(null);
                                                setShowProcsDropdown(null);
                                                setShowTrafficView(null);
                                                setActiveFourthLevelDropdown(null);
                                                setOpenConfigDropdowns({});
                                              }}
                                            >
                                              STAR
                                            </div>
                                            <div 
                                              style={styles.navSubDropdownItem}
                                              onMouseEnter={(e) => e.target.style.backgroundColor = styles.navSubDropdownItemHover.backgroundColor}
                                              onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                console.log(`TRANSITION clicked for PROCS ${config.name}`, airport.name);
                                                // Close all dropdowns
                                                setShowAirportsDropdown(false);
                                                setClickedAirport(null);
                                                setShowGeneralFilesDropdown(null);
                                                setShowConfig1Dropdown(null);
                                                setShowConfig2Dropdown(null);
                                                setShowNavAidsDropdown(null);
                                                setShowProcsDropdown(null);
                                                setShowTrafficView(null);
                                                setActiveFourthLevelDropdown(null);
                                                setOpenConfigDropdowns({});
                                              }}
                                            >
                                              TRANSITION
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <button
            style={{
              ...styles.navButton,
              ...(currentView === 'settings' ? styles.navButtonActive : {}),
            }}
            onClick={() => {
              // Navigate to settings first, then close airport views
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentView('settings');
                // Close all airport views and dropdowns after navigation
                setCurrentAirportView(null);
                setShowAirportsDropdown(false);
                setClickedAirport(null);
                setShowSubDropdown(null);
                setShowGeneralFilesDropdown(null);
                setShowConfig1Dropdown(null);
                setShowConfig2Dropdown(null);
                setShowNavAidsDropdown(null);
                setShowProcsDropdown(null);
                setShowTrafficView(null);
                setActiveFourthLevelDropdown(null);
                setOpenConfigDropdowns({});
                setShowNameInput(false);
                setNameInputValue('');
                setNameInputType('');
                setSelectedAirportForConfig('');
                setShowAirportDropdownForConfig(false);
                setAirportSearchForConfig('');
                setSelectedAirportForManageConfigs('');
                setShowAirportDropdownForManageConfigs(false);
                setAirportSearchForManageConfigs('');
                setShowWakeCategoryDropdown(false);
                setShowZoomTooltip(false);
                setLogoHovered(false);
                setIsTransitioning(false);
              }, 100);
            }}
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
            {nameInputType === 'new-config' && (
              <>
                <h3 style={{marginBottom: '16px', fontFamily: 'Inter, sans-serif', color: '#0B1E39'}}>
                  Create New Configuration
                </h3>
                
                {/* Airport Selection */}
                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#374151', fontSize: '14px', fontWeight: '500'}}>
                    Select Airport
                  </label>
                  <div style={{position: 'relative'}}>
                    <div
                      style={{
                        ...styles.nameInputField,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                      onClick={() => setShowAirportDropdownForConfig(!showAirportDropdownForConfig)}
                    >
                      <span style={{color: selectedAirportForConfig ? '#0B1E39' : '#9ca3af'}}>
                        {selectedAirportForConfig || 'Select an airport...'}
                      </span>
                      <span className="material-icons" style={{fontSize: '20px', color: '#6b7280'}}>
                        {showAirportDropdownForConfig ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                      </span>
                    </div>
                    
                    {/* Airport Dropdown */}
                    {showAirportDropdownForConfig && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 1000,
                        maxHeight: '200px',
                        overflow: 'auto',
                        overflowX: 'hidden'
                      }}>
                        {/* Search Input */}
                        <div style={{padding: '8px', borderBottom: '1px solid #e5e7eb'}}>
                          <input
                            type="text"
                            placeholder="Search airports..."
                            value={airportSearchForConfig}
                            onChange={(e) => setAirportSearchForConfig(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontFamily: 'Inter, sans-serif',
                              boxSizing: 'border-box'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        
                        {/* Airport List */}
                        {airports.length === 0 ? (
                          <div style={{padding: '12px', color: '#6b7280', fontFamily: 'Inter, sans-serif', fontSize: '14px'}}>
                            No airports available
                          </div>
                        ) : (
                          airports
                            .filter(airport => 
                              airport.name.toLowerCase().includes(airportSearchForConfig.toLowerCase())
                            )
                            .map((airport) => (
                                                             <div
                                 key={airport.id}
                                 style={{
                                   padding: '12px',
                                   cursor: 'pointer',
                                   fontFamily: 'Inter, sans-serif',
                                   fontSize: '14px',
                                   color: '#0B1E39',
                                   borderBottom: '1px solid #f3f4f6',
                                   backgroundColor: selectedAirportForConfig === airport.name ? '#f3f4f6' : 'white',
                                   whiteSpace: 'nowrap',
                                   overflow: 'hidden',
                                   textOverflow: 'ellipsis'
                                 }}
                                onClick={() => {
                                  setSelectedAirportForConfig(airport.name);
                                  setShowAirportDropdownForConfig(false);
                                  setAirportSearchForConfig('');
                                }}
                                onMouseEnter={(e) => {
                                  if (selectedAirportForConfig !== airport.name) {
                                    e.target.style.backgroundColor = '#f9fafb';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (selectedAirportForConfig !== airport.name) {
                                    e.target.style.backgroundColor = 'white';
                                  }
                                }}
                              >
                                {airport.name}
                              </div>
                            ))
                        )}
                        {airports.length > 0 && airports.filter(airport => 
                          airport.name.toLowerCase().includes(airportSearchForConfig.toLowerCase())
                        ).length === 0 && (
                          <div style={{padding: '12px', color: '#6b7280', fontFamily: 'Inter, sans-serif', fontSize: '14px'}}>
                            No airports found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Config Name Input */}
                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#374151', fontSize: '14px', fontWeight: '500'}}>
                    Configuration Name
                  </label>
                  <input
                    type="text"
                    placeholder="Config "
                    value={nameInputType === 'new-config' ? `Config ${nameInputValue}` : nameInputValue}
                    onChange={(e) => {
                      if (nameInputType === 'new-config') {
                        // For new-config, only allow editing the part after "Config "
                        const fullValue = e.target.value;
                        if (fullValue.startsWith('Config ')) {
                          const afterConfig = fullValue.substring(7); // Remove "Config " (7 characters including space)
                          const filtered = afterConfig.replace(/[^A-Za-z0-9]/g, '').slice(0, 10);
                          setNameInputValue(filtered);
                        } else {
                          // If user tries to delete "Config ", keep it
                          setNameInputValue(nameInputValue);
                        }
                      } else {
                        handleNameInputChange(e.target.value);
                      }
                    }}
                    style={styles.nameInputField}
                    onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                  />
                </div>
              </>
            )}
            
            {nameInputType !== 'new-config' && (
              <>
                <h3 style={{marginBottom: '16px', fontFamily: 'Inter, sans-serif', color: '#0B1E39'}}>
                  Create New Airport
                </h3>
                
                {/* Airport Name Input */}
                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#374151', fontSize: '14px', fontWeight: '500'}}>
                    Airport ICAO Code
                  </label>
            <input
              type="text"
              placeholder="Enter ICAO..."
              value={nameInputValue}
              onChange={(e) => handleNameInputChange(e.target.value)}
              style={styles.nameInputField}
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
            />
                </div>
              </>
            )}
            <div style={styles.nameInputButtons}>
              <button
                onClick={handleNameCancel}
                onMouseEnter={() => setButtonHover({...buttonHover, cancel: true})}
                onMouseLeave={() => setButtonHover({...buttonHover, cancel: false})}
                style={{
                  ...styles.nameInputButton, 
                  ...styles.nameInputButtonCancel,
                  ...(buttonHover.cancel ? styles.nameInputButtonCancelHover : {})
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleNameSubmit}
                onMouseEnter={() => setButtonHover({...buttonHover, submit: true})}
                onMouseLeave={() => setButtonHover({...buttonHover, submit: false})}
                style={{
                  ...styles.nameInputButton, 
                  ...styles.nameInputButtonSubmit,
                  ...(buttonHover.submit ? styles.nameInputButtonSubmitHover : {})
                }}
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
                onMouseEnter={() => setButtonHover({...buttonHover, cancel: true})}
                onMouseLeave={() => setButtonHover({...buttonHover, cancel: false})}
                style={{
                  ...styles.nameInputButton, 
                  ...styles.nameInputButtonCancel,
                  ...(buttonHover.cancel ? styles.nameInputButtonCancelHover : {})
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAirport}
                onMouseEnter={() => setButtonHover({...buttonHover, delete: true})}
                onMouseLeave={() => setButtonHover({...buttonHover, delete: false})}
                style={{
                  ...styles.nameInputButton, 
                  ...styles.nameInputButtonSubmit,
                  ...(buttonHover.delete ? styles.nameInputButtonSubmitHover : {})
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete GEO Entry Modal */}
      {showConfirmDeleteGeo && (
        <div style={styles.nameInputOverlay}>
          <div style={styles.nameInputModal}>
            <h3 style={{marginBottom: '16px', fontFamily: 'Inter, sans-serif', color: '#0B1E39'}}>
              Delete GEO Entry
            </h3>
            <p style={{marginBottom: '24px', fontFamily: 'Inter, sans-serif', color: '#6b7280'}}>
              Are you sure you want to delete "{geoEntryToDelete?.name}"? This action cannot be undone.
            </p>
            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
              <button
                onClick={cancelDeleteGeoEntry}
                onMouseEnter={() => setButtonHover({...buttonHover, cancel: true})}
                onMouseLeave={() => setButtonHover({...buttonHover, cancel: false})}
                style={{
                  ...styles.nameInputButton, 
                  ...styles.nameInputButtonCancel,
                  ...(buttonHover.cancel ? styles.nameInputButtonCancelHover : {})
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteGeoEntry}
                onMouseEnter={() => setButtonHover({...buttonHover, delete: true})}
                onMouseLeave={() => setButtonHover({...buttonHover, delete: false})}
                style={{
                  ...styles.nameInputButton, 
                  ...styles.nameInputButtonSubmit,
                  ...(buttonHover.delete ? styles.nameInputButtonSubmitHover : {})
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete MRVA Entry Modal */}
      {showConfirmDeleteMrva && (
        <div style={styles.nameInputOverlay}>
          <div style={styles.nameInputModal}>
            <h3 style={{marginBottom: '16px', fontFamily: 'Inter, sans-serif', color: '#0B1E39'}}>
              Delete MRVA Entry
            </h3>
            <p style={{marginBottom: '24px', fontFamily: 'Inter, sans-serif', color: '#6b7280'}}>
              Are you sure you want to delete "{mrvaEntryToDelete?.name}"? This action cannot be undone.
            </p>
            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
              <button
                onClick={cancelDeleteMrvaEntry}
                onMouseEnter={() => setButtonHover({...buttonHover, cancel: true})}
                onMouseLeave={() => setButtonHover({...buttonHover, cancel: false})}
                style={{
                  ...styles.nameInputButton, 
                  ...styles.nameInputButtonCancel,
                  ...(buttonHover.cancel ? styles.nameInputButtonCancelHover : {})
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteMrvaEntry}
                onMouseEnter={() => setButtonHover({...buttonHover, delete: true})}
                onMouseLeave={() => setButtonHover({...buttonHover, delete: false})}
                style={{
                  ...styles.nameInputButton, 
                  ...styles.nameInputButtonSubmit,
                  ...(buttonHover.delete ? styles.nameInputButtonSubmitHover : {})
                }}
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
                onMouseEnter={() => setButtonHover({...buttonHover, ok: true})}
                onMouseLeave={() => setButtonHover({...buttonHover, ok: false})}
                style={{
                  ...styles.nameInputButton, 
                  ...styles.nameInputButtonSubmit,
                  ...(buttonHover.ok ? styles.nameInputButtonSubmitHover : {})
                }}
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
        {currentView === 'welcome' && !currentAirportView && (
          <div style={styles.welcomeContainer}>
            <h2 style={styles.welcomeTitle}>Welcome to VoiceATC Airport Creator</h2>
            <p style={styles.welcomeSubtitle}>
              {airports.length === 0 
                ? "Navigate to New Airport to begin!" 
                : "Navigate to Your Airports to begin!"
              }
            </p>
          </div>
        )}

        {/* Airport Views */}
        {currentAirportView && (
          <div style={{flex: '1', overflow: 'auto', padding: '24px'}}>
            {currentAirportView.type === 'traffic' && (
              <div>
                <h2 style={styles.cardTitle}>Traffic Management for {currentAirportView.airport.name}</h2>
                
            {/* Input Section */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Add New Route</h2>
              <div style={styles.grid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Airport</label>
                  <input
                    type="text"
                                            placeholder="ESSA"
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
                  <div style={{position: 'relative', width: '100%'}}>
                    <div
                      style={{
                        ...styles.input,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                      onClick={() => setShowWakeCategoryDropdown(!showWakeCategoryDropdown)}
                    >
                      <span style={{color: formData.wake ? '#0B1E39' : '#9ca3af'}}>
                        {formData.wake || 'Select wake category...'}
                      </span>
                      <span className="material-icons" style={{fontSize: '20px', color: '#6b7280'}}>
                        {showWakeCategoryDropdown ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                      </span>
                    </div>
                    
                    {/* Wake Category Dropdown */}
                    {showWakeCategoryDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 1000,
                        maxHeight: '200px',
                        overflow: 'auto'
                      }}>
                        {['L', 'M', 'H', 'J'].map((category) => (
                          <div
                            key={category}
                            style={{
                              padding: '12px',
                              cursor: 'pointer',
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '14px',
                              color: '#0B1E39',
                              borderBottom: '1px solid #f3f4f6',
                              backgroundColor: formData.wake === category ? '#f3f4f6' : 'white'
                            }}
                            onClick={() => {
                              handleInputChange('wake', category);
                              setShowWakeCategoryDropdown(false);
                            }}
                            onMouseEnter={(e) => {
                              if (formData.wake !== category) {
                                e.target.style.backgroundColor = '#f9fafb';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (formData.wake !== category) {
                                e.target.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            {category}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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

            {currentAirportView.type === 'info' && (
              <div>
                <h2 style={styles.cardTitle}>INFO for {currentAirportView.airport.name}</h2>
                
                {/* Input Section */}
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>Airport Information</h2>
                  <div style={styles.grid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>CENTERPOINT</label>
                      <input
                        type="text"
                        placeholder="e.g., 59.6498, 17.9238"
                        value={infoData.centerpoint}
                        onChange={(e) => handleInfoDataChange('centerpoint', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>MAGNETIC VARIATION</label>
                      <input
                        type="text"
                        placeholder="e.g., 7E"
                        value={infoData.magneticVariation}
                        onChange={(e) => handleInfoDataChange('magneticVariation', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>ELEVATION (M)</label>
                      <input
                        type="text"
                        placeholder="e.g., 42"
                        value={infoData.elevation}
                        onChange={(e) => handleInfoDataChange('elevation', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>NAME</label>
                      <input
                        type="text"
                        placeholder="e.g., Stockholm Arlanda Airport"
                        value={infoData.name}
                        onChange={(e) => handleInfoDataChange('name', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <div style={{position: 'relative', display: 'inline-block'}}>
                        <label style={styles.label}>DEFAULT ZOOM</label>
                        <span 
                          className="material-symbols-outlined" 
                          style={{
                            fontSize: '16px',
                            color: '#6b7280',
                            marginLeft: '4px',
                            cursor: 'default',
                            verticalAlign: 'middle'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = '#0B1E39';
                            setShowZoomTooltip(true);
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = '#6b7280';
                            setShowZoomTooltip(false);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setShowZoomTooltip(!showZoomTooltip);
                            }
                          }}
                        >
                          help
                        </span>
                        
                        {/* Custom Tooltip */}
                        {showZoomTooltip && (
                          <div 
                            style={{
                              position: 'absolute',
                              bottom: '100%',
                              left: '0',
                              backgroundColor: 'white',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              padding: '12px',
                              fontSize: '14px',
                              fontFamily: 'Inter, sans-serif',
                              color: '#0B1E39',
                              zIndex: 1000,
                              whiteSpace: 'nowrap',
                              marginBottom: '4px',
                              pointerEvents: 'none'
                            }}
                            role="tooltip"
                            aria-hidden="true"
                          >
                            Low Number = Zoomed Out
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="e.g., 12"
                        value={infoData.defaultZoom}
                        onChange={(e) => handleInfoDataChange('defaultZoom', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>BACKGROUND COLOUR</label>
                      <input
                        type="text"
                        value={infoData.backgroundColour}
                        onChange={(e) => handleInfoDataChange('backgroundColour', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>TRANSITION ALTITUDE</label>
                      <input
                        type="text"
                        placeholder="e.g., 5000"
                        value={infoData.transitionAltitude}
                        onChange={(e) => handleInfoDataChange('transitionAltitude', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                  </div>
                  
                  <button onClick={handleSaveInfoData} style={styles.button}>
                    <span className="material-icons">save</span>
                    Save Data
                  </button>
                </div>
              </div>
            )}

            {currentAirportView.type === 'runways' && (
              <div>
                <h2 style={styles.cardTitle}>RUNWAYS for {currentAirportView.airport.name}</h2>
                
                {/* Input Section */}
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>Add New Runway</h2>
                  <div style={styles.grid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>RWY 1</label>
                      <input
                        type="text"
                        placeholder="e.g., 01L"
                        value={runwaysData.rwy1}
                        onChange={(e) => handleRunwaysDataChange('rwy1', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>RWY 2</label>
                      <input
                        type="text"
                        placeholder="e.g., 19R"
                        value={runwaysData.rwy2}
                        onChange={(e) => handleRunwaysDataChange('rwy2', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>ELEVATION 1</label>
                      <input
                        type="text"
                        placeholder="e.g., 45"
                        value={runwaysData.elevation1}
                        onChange={(e) => handleRunwaysDataChange('elevation1', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>ELEVATION 2</label>
                      <input
                        type="text"
                        placeholder="e.g., 45"
                        value={runwaysData.elevation2}
                        onChange={(e) => handleRunwaysDataChange('elevation2', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>TRACK 1</label>
                      <input
                        type="text"
                        placeholder="e.g., 015"
                        value={runwaysData.track1}
                        onChange={(e) => handleRunwaysDataChange('track1', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>TRACK 2</label>
                      <input
                        type="text"
                        placeholder="e.g., 195"
                        value={runwaysData.track2}
                        onChange={(e) => handleRunwaysDataChange('track2', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>COORDINATE 1</label>
                      <input
                        type="text"
                        placeholder="e.g., 59.6498, 17.9238"
                        value={runwaysData.coordinate1}
                        onChange={(e) => handleRunwaysDataChange('coordinate1', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>COORDINATE 2</label>
                      <input
                        type="text"
                        placeholder="e.g., 59.6498, 17.9238"
                        value={runwaysData.coordinate2}
                        onChange={(e) => handleRunwaysDataChange('coordinate2', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                  </div>
                  
                  <button onClick={handleAddRunway} style={styles.button}>
                    <span className="material-icons">add</span>
                    Add Runway
                  </button>
                </div>

                {/* Table Section */}
                <div style={styles.card}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '24px'}}>
                    <h2 style={styles.cardTitle}>Runways</h2>
                    <div style={styles.searchContainer}>
                      <span className="material-icons" style={styles.searchIcon}>search</span>
                      <input
                        type="text"
                        placeholder="Search by RWY 1, RWY 2, Track, or Coordinates..."
                        value={runwaysSearchTerm}
                        onChange={(e) => setRunwaysSearchTerm(e.target.value)}
                        style={styles.searchInput}
                      />
                    </div>
                  </div>
                  <div style={styles.tableContainer}>
                    <table style={styles.table}>
                      <thead style={styles.tableHeader}>
                        <tr>
                          <th style={styles.tableCell}>RWY 1</th>
                          <th style={styles.tableCell}>RWY 2</th>
                          <th style={styles.tableCell}>ELEVATION 1</th>
                          <th style={styles.tableCell}>ELEVATION 2</th>
                          <th style={styles.tableCell}>TRACK 1</th>
                          <th style={styles.tableCell}>TRACK 2</th>
                          <th style={styles.tableCell}>COORDINATE 1</th>
                          <th style={styles.tableCell}>COORDINATE 2</th>
                          <th style={styles.tableCell}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const filteredRunways = runways.filter(runway => 
                            runway.rwy1.toLowerCase().includes(runwaysSearchTerm.toLowerCase()) ||
                            runway.rwy2.toLowerCase().includes(runwaysSearchTerm.toLowerCase()) ||
                            runway.track1.toLowerCase().includes(runwaysSearchTerm.toLowerCase()) ||
                            runway.track2.toLowerCase().includes(runwaysSearchTerm.toLowerCase()) ||
                            runway.coordinate1.toLowerCase().includes(runwaysSearchTerm.toLowerCase()) ||
                            runway.coordinate2.toLowerCase().includes(runwaysSearchTerm.toLowerCase())
                          );
                          
                          return filteredRunways.map((runway) => (
                            <tr key={runway.id} style={styles.tableRow}>
                              <td style={styles.tableCell}>{runway.rwy1}</td>
                              <td style={styles.tableCell}>{runway.rwy2}</td>
                              <td style={styles.tableCell}>{runway.elevation1}</td>
                              <td style={styles.tableCell}>{runway.elevation2}</td>
                              <td style={styles.tableCell}>{runway.track1}</td>
                              <td style={styles.tableCell}>{runway.track2}</td>
                              <td style={styles.tableCell}>{runway.coordinate1}</td>
                              <td style={styles.tableCell}>{runway.coordinate2}</td>
                              <td style={styles.tableCell}>
                                <button
                                  onClick={() => handleDeleteRunway(runway.id)}
                                  style={styles.deleteButton}
                                >
                                  <span className="material-icons" style={{fontSize: '16px'}}>delete</span>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                  {runways.length === 0 && (
                    <div style={styles.emptyState}>
                      <p>No runways added yet. Add your first runway above!</p>
                    </div>
                  )}
                  {runways.length > 0 && runways.filter(runway => 
                    runway.rwy1.toLowerCase().includes(runwaysSearchTerm.toLowerCase()) ||
                    runway.rwy2.toLowerCase().includes(runwaysSearchTerm.toLowerCase()) ||
                    runway.track1.toLowerCase().includes(runwaysSearchTerm.toLowerCase()) ||
                    runway.track2.toLowerCase().includes(runwaysSearchTerm.toLowerCase()) ||
                    runway.coordinate1.toLowerCase().includes(runwaysSearchTerm.toLowerCase()) ||
                    runway.coordinate2.toLowerCase().includes(runwaysSearchTerm.toLowerCase())
                  ).length === 0 && (
                    <div style={styles.emptyState}>
                      <p>No runways found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentAirportView.type === 'geo' && (
              <div>
                <h2 style={styles.cardTitle}>GEO for {currentAirportView.airport.name}</h2>
                
                {/* New Entry Form - Always at the top */}
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>
                    {editingGeoEntry ? `Edit GEO Entry: ${editingGeoEntry.name}` : 'Add New GEO Entry'}
                  </h2>
                  <div style={styles.grid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Name</label>
                      <input
                        type="text"
                        placeholder="Enter name..."
                        value={geoData.name}
                        onChange={(e) => handleGeoDataChange('name', e.target.value)}
                        style={getInputStyle('name')}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Coordinates</label>
                      <textarea
                        placeholder="Enter input..."
                        value={geoData.input}
                        onChange={(e) => handleGeoDataChange('input', e.target.value)}
                        style={{
                          ...styles.textarea,
                          minHeight: '40px',
                          maxHeight: '400px', // Increased max height for longer content
                          ...(validationErrors['input'] ? {
                            border: '2px solid #dc2626',
                            boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1), 0 0 0 1px rgba(220, 38, 38, 0.2)',
                            outline: 'none',
                          } : {})
                        }}
                        rows={1}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            // Allow Enter to create new line, don't prevent default
                            // Auto-resize the textarea
                            const textarea = e.target;
                            textarea.style.height = 'auto';
                            textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px';
                          }
                        }}
                        onInput={(e) => {
                          // Auto-resize on input
                          const textarea = e.target;
                          textarea.style.height = 'auto';
                          textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px';
                        }}
                      />
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', gap: '12px'}}>
                    {editingGeoEntry ? (
                      <>
                        <button onClick={handleUpdateGeoEntry} style={styles.button}>
                          <span className="material-icons">save</span>
                          Update Entry
                        </button>
                        <button 
                          onClick={handleCancelEdit} 
                          style={{
                            ...styles.button,
                            backgroundColor: '#6b7280',
                            color: 'white'
                          }}
                        >
                          <span className="material-icons">cancel</span>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button onClick={handleAddGeoEntry} style={styles.button}>
                        <span className="material-icons">add</span>
                        Add Entry
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Section */}
                <div style={styles.card}>
                  <div style={styles.searchContainer}>
                    <span className="material-icons" style={styles.searchIcon}>search</span>
                    <input
                      type="text"
                      placeholder="Search by Name or Input..."
                      value={geoSearchTerm}
                      onChange={(e) => setGeoSearchTerm(e.target.value)}
                      style={styles.searchInput}
                    />
                  </div>
                </div>

                {/* GEO Entries as Individual Cards */}
                {(() => {
                  const filteredGeoEntries = geoEntries.filter(entry => 
                    entry.name.toLowerCase().includes(geoSearchTerm.toLowerCase()) ||
                    entry.input.toLowerCase().includes(geoSearchTerm.toLowerCase())
                  );
                  
                  return filteredGeoEntries.map((entry) => (
                    <div key={entry.id} style={styles.card}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
                        <h3 style={{...styles.cardTitle, marginBottom: '0', fontSize: '18px'}}>{entry.name}</h3>
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button
                            onClick={() => handleEditGeoEntry(entry)}
                            style={{
                              ...styles.deleteButton,
                              backgroundColor: '#3b82f6',
                              color: 'white'
                            }}
                          >
                            <span className="material-icons" style={{fontSize: '16px'}}>edit</span>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteGeoEntry(entry)}
                            style={styles.deleteButton}
                          >
                            <span className="material-icons" style={{fontSize: '16px'}}>delete</span>
                            Delete
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={entry.input}
                        readOnly
                        style={{
                          padding: '12px',
                          backgroundColor: '#f9fafb',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          minHeight: '40px',
                          maxHeight: '200px', // Max 10 rader (20px per rad)
                          overflowY: 'auto',
                          overflowX: 'hidden',
                          resize: 'vertical',
                          width: '100%',
                          boxSizing: 'border-box',
                          cursor: 'default'
                        }}
                        rows={Math.min(entry.input.split('\n').length, 10)}
                      />
                    </div>
                  ));
                })()}

                {/* Empty State */}
                {geoEntries.length === 0 && (
                  <div style={styles.card}>
                    <div style={styles.emptyState}>
                      <p>No GEO entries added yet. Add your first entry above!</p>
                    </div>
                  </div>
                )}
                {geoEntries.length > 0 && geoEntries.filter(entry => 
                  entry.name.toLowerCase().includes(geoSearchTerm.toLowerCase()) ||
                  entry.input.toLowerCase().includes(geoSearchTerm.toLowerCase())
                ).length === 0 && (
                  <div style={styles.card}>
                    <div style={styles.emptyState}>
                      <p>No GEO entries found matching your search.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentAirportView.type === 'glidepath' && (
              <div>
                <h2 style={styles.cardTitle}>GLIDEPATH for {currentAirportView.airport.name}</h2>
                
                {/* Input Section */}
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>
                    {editingGlidepathEntry ? `Edit GLIDEPATH Entry: ${editingGlidepathEntry.rwy}` : 'Add New GLIDEPATH Entry'}
                  </h2>
                  <div style={styles.grid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>RWY</label>
                      <input
                        type="text"
                        placeholder="e.g., 01L"
                        value={glidepathData.rwy}
                        onChange={(e) => handleGlidepathDataChange('rwy', e.target.value)}
                        style={getInputStyle('rwy')}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>ANGLE</label>
                      <input
                        type="text"
                        placeholder="e.g., 3.0"
                        value={glidepathData.angle}
                        onChange={(e) => handleGlidepathDataChange('angle', e.target.value)}
                        style={getInputStyle('angle')}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>LENGTH (M)</label>
                      <input
                        type="text"
                        placeholder="e.g., 3000"
                        value={glidepathData.length}
                        onChange={(e) => handleGlidepathDataChange('length', e.target.value)}
                        style={getInputStyle('length')}
                      />
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', gap: '12px'}}>
                    {editingGlidepathEntry ? (
                      <>
                        <button onClick={handleUpdateGlidepathEntry} style={styles.button}>
                          <span className="material-icons">save</span>
                          Update Entry
                        </button>
                        <button 
                          onClick={handleCancelEditGlidepath} 
                          style={{
                            ...styles.button,
                            backgroundColor: '#6b7280',
                            color: 'white'
                          }}
                        >
                          <span className="material-icons">cancel</span>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button onClick={handleAddGlidepathEntry} style={styles.button}>
                        <span className="material-icons">add</span>
                        Add Entry
                      </button>
                    )}
                  </div>
                </div>

                {/* Table Section */}
                <div style={styles.card}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '24px'}}>
                    <h2 style={styles.cardTitle}>GLIDEPATH Entries</h2>
                    <div style={styles.searchContainer}>
                      <span className="material-icons" style={styles.searchIcon}>search</span>
                      <input
                        type="text"
                        placeholder="Search by RWY, Angle, or Length..."
                        value={glidepathSearchTerm}
                        onChange={(e) => setGlidepathSearchTerm(e.target.value)}
                        style={styles.searchInput}
                      />
                    </div>
                  </div>
                  <div style={styles.tableContainer}>
                    <table style={styles.table}>
                      <thead style={styles.tableHeader}>
                        <tr>
                          <th style={styles.tableCell}>RWY</th>
                          <th style={styles.tableCell}>ANGLE</th>
                          <th style={styles.tableCell}>LENGTH (M)</th>
                          <th style={styles.tableCell}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const filteredGlidepathEntries = glidepathEntries.filter(entry => 
                            entry.rwy.toLowerCase().includes(glidepathSearchTerm.toLowerCase()) ||
                            entry.angle.toLowerCase().includes(glidepathSearchTerm.toLowerCase()) ||
                            entry.length.toLowerCase().includes(glidepathSearchTerm.toLowerCase())
                          );
                          
                          return filteredGlidepathEntries.map((entry) => (
                            <tr key={entry.id} style={styles.tableRow}>
                              <td style={styles.tableCell}>{entry.rwy}</td>
                              <td style={styles.tableCell}>{entry.angle}</td>
                              <td style={styles.tableCell}>{entry.length}</td>
                              <td style={styles.tableCell}>
                                <div style={{display: 'flex', gap: '8px'}}>
                                  <button
                                    onClick={() => handleEditGlidepathEntry(entry)}
                                    style={{
                                      ...styles.deleteButton,
                                      backgroundColor: '#3b82f6',
                                      color: 'white'
                                    }}
                                  >
                                    <span className="material-icons" style={{fontSize: '16px'}}>edit</span>
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteGlidepathEntry(entry.id)}
                                    style={styles.deleteButton}
                                  >
                                    <span className="material-icons" style={{fontSize: '16px'}}>delete</span>
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                  {glidepathEntries.length === 0 && (
                    <div style={styles.emptyState}>
                      <p>No GLIDEPATH entries added yet. Add your first entry above!</p>
                    </div>
                  )}
                  {glidepathEntries.length > 0 && glidepathEntries.filter(entry => 
                    entry.rwy.toLowerCase().includes(glidepathSearchTerm.toLowerCase()) ||
                    entry.angle.toLowerCase().includes(glidepathSearchTerm.toLowerCase()) ||
                    entry.length.toLowerCase().includes(glidepathSearchTerm.toLowerCase())
                  ).length === 0 && (
                    <div style={styles.emptyState}>
                      <p>No GLIDEPATH entries found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentAirportView.type === 'mrva' && (
              <div>
                <h2 style={styles.cardTitle}>MRVA for {currentAirportView.airport.name}</h2>
                
                {/* Input Section */}
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>
                    {editingMrvaEntry ? `Edit MRVA Entry: ${editingMrvaEntry.name}` : 'Add New MRVA Entry'}
                  </h2>
                  <div style={styles.grid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Name</label>
                      <input
                        type="text"
                        placeholder="Enter name..."
                        value={mrvaData.name}
                        onChange={(e) => handleMrvaDataChange('name', e.target.value)}
                        style={getInputStyle('name')}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Coordinates</label>
                      <textarea
                        placeholder="Enter coordinates..."
                        value={mrvaData.coordinates}
                        onChange={(e) => handleMrvaDataChange('coordinates', e.target.value)}
                        style={{
                          ...styles.textarea,
                          minHeight: '40px',
                          maxHeight: '400px',
                          ...(validationErrors['coordinates'] ? {
                            border: '2px solid #dc2626',
                            boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1), 0 0 0 1px rgba(220, 38, 38, 0.2)',
                            outline: 'none',
                          } : {})
                        }}
                        rows={1}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            // Allow Enter to create new line, don't prevent default
                            // Auto-resize the textarea
                            const textarea = e.target;
                            textarea.style.height = 'auto';
                            textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px';
                          }
                        }}
                        onInput={(e) => {
                          // Auto-resize on input
                          const textarea = e.target;
                          textarea.style.height = 'auto';
                          textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px';
                        }}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Altitude</label>
                      <input
                        type="text"
                        placeholder="Enter altitude..."
                        value={mrvaData.altitude}
                        onChange={(e) => handleMrvaDataChange('altitude', e.target.value)}
                        style={getInputStyle('altitude')}
                      />
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Label Coordinate</label>
                      <input
                        type="text"
                        placeholder="Enter label coordinate..."
                        value={mrvaData.labelCoordinate}
                        onChange={(e) => handleMrvaDataChange('labelCoordinate', e.target.value)}
                        style={getInputStyle('labelCoordinate')}
                      />
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', gap: '12px'}}>
                    {editingMrvaEntry ? (
                      <>
                        <button onClick={handleUpdateMrvaEntry} style={styles.button}>
                          <span className="material-icons">save</span>
                          Update Entry
                        </button>
                        <button 
                          onClick={handleCancelEditMrva} 
                          style={{
                            ...styles.button,
                            backgroundColor: '#6b7280',
                            color: 'white'
                          }}
                        >
                          <span className="material-icons">cancel</span>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button onClick={handleAddMrvaEntry} style={styles.button}>
                        <span className="material-icons">add</span>
                        Add Entry
                      </button>
                    )}
                  </div>
                </div>

                {/* Table Section */}
                <div style={styles.card}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '24px'}}>
                    <h2 style={styles.cardTitle}>MRVA Entries</h2>
                    <div style={styles.searchContainer}>
                      <span className="material-icons" style={styles.searchIcon}>search</span>
                      <input
                        type="text"
                        placeholder="Search by Name, Coordinates, Altitude, or Label Coordinate..."
                        value={mrvaSearchTerm}
                        onChange={(e) => setMrvaSearchTerm(e.target.value)}
                        style={styles.searchInput}
                      />
                    </div>
                  </div>
                  <div style={styles.tableContainer}>
                    <table style={styles.table}>
                      <thead style={styles.tableHeader}>
                        <tr>
                          <th style={styles.tableCell}>Name</th>
                          <th style={styles.tableCell}>Coordinates</th>
                          <th style={styles.tableCell}>Altitude</th>
                          <th style={styles.tableCell}>Label Coordinate</th>
                          <th style={styles.tableCell}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const filteredMrvaEntries = mrvaEntries.filter(entry => 
                            entry.name.toLowerCase().includes(mrvaSearchTerm.toLowerCase()) ||
                            entry.coordinates.toLowerCase().includes(mrvaSearchTerm.toLowerCase()) ||
                            entry.altitude.toLowerCase().includes(mrvaSearchTerm.toLowerCase()) ||
                            entry.labelCoordinate.toLowerCase().includes(mrvaSearchTerm.toLowerCase())
                          );
                          
                          return filteredMrvaEntries.map((entry) => (
                            <tr key={entry.id} style={styles.tableRow}>
                              <td style={styles.tableCell}>{entry.name}</td>
                              <td style={styles.tableCell}>
                                <textarea
                                  value={entry.coordinates}
                                  readOnly
                                  style={{
                                    padding: '8px',
                                    backgroundColor: 'white',
                                    border: 'none',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    height: '200px',
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    resize: 'none',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    cursor: 'default',
                                    outline: 'none'
                                  }}
                                />
                              </td>
                              <td style={styles.tableCell}>
                                <div style={{
                                  maxWidth: '150px',
                                  wordWrap: 'break-word',
                                  whiteSpace: 'pre-wrap'
                                }}>
                                  {entry.altitude}
                                </div>
                              </td>
                              <td style={styles.tableCell}>
                                <div style={{
                                  maxWidth: '200px',
                                  wordWrap: 'break-word',
                                  whiteSpace: 'pre-wrap'
                                }}>
                                  {entry.labelCoordinate}
                                </div>
                              </td>
                              <td style={styles.tableCell}>
                                <div style={{display: 'flex', gap: '8px'}}>
                                  <button
                                    onClick={() => handleEditMrvaEntry(entry)}
                                    style={{
                                      ...styles.deleteButton,
                                      backgroundColor: '#3b82f6',
                                      color: 'white'
                                    }}
                                  >
                                    <span className="material-icons" style={{fontSize: '16px'}}>edit</span>
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMrvaEntry(entry)}
                                    style={styles.deleteButton}
                                  >
                                    <span className="material-icons" style={{fontSize: '16px'}}>delete</span>
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                  {mrvaEntries.length === 0 && (
                    <div style={styles.emptyState}>
                      <p>No MRVA entries added yet. Add your first entry above!</p>
                    </div>
                  )}
                  {mrvaEntries.length > 0 && mrvaEntries.filter(entry => 
                    entry.name.toLowerCase().includes(mrvaSearchTerm.toLowerCase()) ||
                    entry.coordinates.toLowerCase().includes(mrvaSearchTerm.toLowerCase()) ||
                    entry.altitude.toLowerCase().includes(mrvaSearchTerm.toLowerCase()) ||
                    entry.labelCoordinate.toLowerCase().includes(mrvaSearchTerm.toLowerCase())
                  ).length === 0 && (
                    <div style={styles.emptyState}>
                      <p>No MRVA entries found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}



        {currentView === 'settings' && (
          <div style={{
            ...styles.settingsContainer,
            overflowY: showAirportDropdownForManageConfigs ? 'visible' : 'auto'
          }}>
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
                          <div style={{display: 'flex', gap: '8px'}}>
                            <button
                              onClick={() => handleRenameAirport(airport)}
                              style={{
                                ...styles.deleteButton,
                                backgroundColor: '#3b82f6',
                                color: 'white'
                              }}
                            >
                              <span className="material-icons" style={{fontSize: '16px'}}>edit</span>
                              Rename
                            </button>
                          <button
                            onClick={() => handleDeleteAirport(airport.id)}
                            style={styles.deleteButton}
                          >
                            <span className="material-icons" style={{fontSize: '16px'}}>delete</span>
                            Delete
                          </button>
                          </div>
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
                <h3 style={{...styles.airportDropdownLabel, marginBottom: '16px'}}>Manage Configs</h3>
                
                {/* Airport Selection */}
                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#374151', fontSize: '14px', fontWeight: '500'}}>
                    Select Airport
                  </label>
                  <div style={{position: 'relative', maxWidth: '300px', zIndex: 1001}}>
                    <div
                      style={{
                        ...styles.settingsSearchInput,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                      onClick={() => setShowAirportDropdownForManageConfigs(!showAirportDropdownForManageConfigs)}
                    >
                      <span style={{color: selectedAirportForManageConfigs ? '#0B1E39' : '#9ca3af'}}>
                        {selectedAirportForManageConfigs || 'Select an airport...'}
                      </span>
                      <span className="material-icons" style={{fontSize: '20px', color: '#6b7280'}}>
                        {showAirportDropdownForManageConfigs ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                      </span>
              </div>
                    
                    {/* Airport Dropdown */}
                    {showAirportDropdownForManageConfigs && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 9999,
                        maxHeight: '300px',
                        overflow: 'auto',
                        overflowX: 'hidden'
                      }}>
                        {/* Search Input */}
                        <div style={{padding: '8px', borderBottom: '1px solid #e5e7eb'}}>
                          <input
                            type="text"
                            placeholder="Search airports..."
                            value={airportSearchForManageConfigs}
                            onChange={(e) => setAirportSearchForManageConfigs(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontFamily: 'Inter, sans-serif',
                              boxSizing: 'border-box'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        
                        {/* Airport List */}
                        {airports.length === 0 ? (
                          <div style={{padding: '12px', color: '#6b7280', fontFamily: 'Inter, sans-serif', fontSize: '14px'}}>
                            No airports available
                          </div>
                        ) : (
                          airports
                            .filter(airport => 
                              airport.name.toLowerCase().includes(airportSearchForManageConfigs.toLowerCase())
                            )
                            .map((airport) => (
                              <div
                                key={airport.id}
                                style={{
                                  padding: '12px',
                                  cursor: 'pointer',
                                  fontFamily: 'Inter, sans-serif',
                                  fontSize: '14px',
                                  color: '#0B1E39',
                                  borderBottom: '1px solid #f3f4f6',
                                  backgroundColor: selectedAirportForManageConfigs === airport.name ? '#f3f4f6' : 'white',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                                onClick={() => {
                                  setSelectedAirportForManageConfigs(airport.name);
                                  setShowAirportDropdownForManageConfigs(false);
                                  setAirportSearchForManageConfigs('');
                                }}
                                onMouseEnter={(e) => {
                                  if (selectedAirportForManageConfigs !== airport.name) {
                                    e.target.style.backgroundColor = '#f9fafb';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (selectedAirportForManageConfigs !== airport.name) {
                                    e.target.style.backgroundColor = 'white';
                                  }
                                }}
                              >
                                {airport.name}
                              </div>
                            ))
                        )}
                        {airports.length > 0 && airports.filter(airport => 
                          airport.name.toLowerCase().includes(airportSearchForManageConfigs.toLowerCase())
                        ).length === 0 && (
                          <div style={{padding: '12px', color: '#6b7280', fontFamily: 'Inter, sans-serif', fontSize: '14px'}}>
                            No airports found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Configs List */}
                {selectedAirportForManageConfigs ? (
                  <div>
                    <div style={styles.settingsSearchContainer}>
                      <span className="material-icons" style={styles.settingsSearchIcon}>search</span>
                      <input
                        type="text"
                        placeholder="Search configs..."
                        value={configSearchTerm}
                        onChange={(e) => setConfigSearchTerm(e.target.value)}
                        style={styles.settingsSearchInput}
                      />
                    </div>
                    <div>
                      {(() => {
                        const airportConfigs = configs.filter(config => 
                          config.airport === selectedAirportForManageConfigs || config.type === 'default'
                        );
                        const filteredConfigs = airportConfigs.filter(config => 
                          config.name.toLowerCase().includes(configSearchTerm.toLowerCase())
                        );
                        
                        return (
                          <>
                            {airportConfigs.length === 0 ? (
                              <p style={{color: '#6b7280', fontFamily: 'Inter, sans-serif'}}>No configurations available for {selectedAirportForManageConfigs}.</p>
                            ) : (
                              filteredConfigs.map((config) => (
                                <div key={config.id} style={styles.airportListItem}>
                                  <div style={styles.airportListInfo}>
                                    <span style={styles.airportListName}>{config.name}</span>
                                    <span style={styles.airportListDate}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;{config.type === 'default' ? 'Default Configuration' : `Airport: ${config.airport}`}
                                    </span>
                                  </div>
                                  <div style={{display: 'flex', gap: '8px'}}>
                                    <button
                                      onClick={() => handleRenameConfig(config.name)}
                                      style={{
                                        ...styles.deleteButton,
                                        backgroundColor: '#3b82f6',
                                        color: 'white'
                                      }}
                                    >
                                      <span className="material-icons" style={{fontSize: '16px'}}>edit</span>
                                      Rename
                                    </button>
                                    <button
                                      onClick={() => handleDeleteConfig(config.name)}
                                      style={styles.deleteButton}
                                    >
                                      <span className="material-icons" style={{fontSize: '16px'}}>delete</span>
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                            {airportConfigs.length > 0 && filteredConfigs.length === 0 && (
                              <p style={{color: '#6b7280', fontFamily: 'Inter, sans-serif'}}>No configurations found matching your search.</p>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  <p style={{color: '#6b7280', fontFamily: 'Inter, sans-serif'}}>Please select an airport to view its configurations.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Rename Config Modal */}
        {showRenameConfig && (
          <div style={styles.nameInputOverlay}>
            <div style={styles.nameInputModal}>
              <h3 style={{marginBottom: '16px', fontFamily: 'Inter, sans-serif', color: '#0B1E39'}}>
                Rename Configuration
              </h3>
              <input
                type="text"
                placeholder="Config "
                value={newConfigName}
                onChange={(e) => {
                  // For rename config, only allow editing the part after "Config "
                  const fullValue = e.target.value;
                  if (fullValue.startsWith('Config ')) {
                    const afterConfig = fullValue.substring(7); // Remove "Config " (7 characters including space)
                    const filtered = afterConfig.replace(/[^A-Za-z0-9]/g, '').slice(0, 10);
                    setNewConfigName(`Config ${filtered}`);
                  } else {
                    // If user tries to delete "Config ", keep it
                    setNewConfigName(newConfigName);
                  }
                }}
                style={styles.nameInputField}
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && confirmRenameConfig()}
              />
              <div style={styles.nameInputButtons}>
                <button
                  onClick={cancelRenameConfig}
                  onMouseEnter={() => setButtonHover({...buttonHover, cancel: true})}
                  onMouseLeave={() => setButtonHover({...buttonHover, cancel: false})}
                  style={{
                    ...styles.nameInputButton, 
                    ...styles.nameInputButtonCancel,
                    ...(buttonHover.cancel ? styles.nameInputButtonCancelHover : {})
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRenameConfig}
                  onMouseEnter={() => setButtonHover({...buttonHover, submit: true})}
                  onMouseLeave={() => setButtonHover({...buttonHover, submit: false})}
                  style={{
                    ...styles.nameInputButton, 
                    ...styles.nameInputButtonSubmit,
                    ...(buttonHover.submit ? styles.nameInputButtonSubmitHover : {})
                  }}
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Config Confirmation Modal */}
        {showDeleteConfigConfirm && (
          <div style={styles.nameInputOverlay}>
            <div style={styles.nameInputModal}>
              <h3 style={{marginBottom: '16px', fontFamily: 'Inter, sans-serif', color: '#0B1E39'}}>
                Delete Configuration
              </h3>
              <p style={{marginBottom: '24px', fontFamily: 'Inter, sans-serif', color: '#6b7280'}}>
                Are you sure you want to delete "{configToDelete}"? This action cannot be undone.
              </p>
              <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
                <button
                  onClick={cancelDeleteConfig}
                  onMouseEnter={() => setButtonHover({...buttonHover, cancel: true})}
                  onMouseLeave={() => setButtonHover({...buttonHover, cancel: false})}
                  style={{
                    ...styles.nameInputButton, 
                    ...styles.nameInputButtonCancel,
                    ...(buttonHover.cancel ? styles.nameInputButtonCancelHover : {})
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteConfig}
                  onMouseEnter={() => setButtonHover({...buttonHover, delete: true})}
                  onMouseLeave={() => setButtonHover({...buttonHover, delete: false})}
                  style={{
                    ...styles.nameInputButton, 
                    ...styles.nameInputButtonSubmit,
                    ...(buttonHover.delete ? styles.nameInputButtonSubmitHover : {})
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rename Airport Modal */}
        {showRenameAirport && (
          <div style={styles.nameInputOverlay}>
            <div style={styles.nameInputModal}>
              <h3 style={{marginBottom: '16px', fontFamily: 'Inter, sans-serif', color: '#0B1E39'}}>
                Rename Airport
              </h3>
              <input
                type="text"
                placeholder="Enter ICAO..."
                value={newAirportName}
                onChange={(e) => {
                  // Only allow letters, convert to uppercase, max 4 characters
                  const filteredValue = e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4);
                  setNewAirportName(filteredValue);
                }}
                style={styles.nameInputField}
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && confirmRenameAirport()}
              />
              <div style={styles.nameInputButtons}>
                <button
                  onClick={cancelRenameAirport}
                  onMouseEnter={() => setButtonHover({...buttonHover, cancel: true})}
                  onMouseLeave={() => setButtonHover({...buttonHover, cancel: false})}
                  style={{
                    ...styles.nameInputButton, 
                    ...styles.nameInputButtonCancel,
                    ...(buttonHover.cancel ? styles.nameInputButtonCancelHover : {})
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRenameAirport}
                  onMouseEnter={() => setButtonHover({...buttonHover, submit: true})}
                  onMouseLeave={() => setButtonHover({...buttonHover, submit: false})}
                  style={{
                    ...styles.nameInputButton, 
                    ...styles.nameInputButtonSubmit,
                    ...(buttonHover.submit ? styles.nameInputButtonSubmitHover : {})
                  }}
                >
                  Rename
                </button>
              </div>
            </div>
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