# VoiceATC Airport Creator

A comprehensive web application for managing and organizing flight routes, airport configurations, and navigation data for VoiceATC simulator.

## 🚀 Features

### Airport Management
- **Create Airports**: Add new airports with ICAO codes
- **Manage Airports**: View, rename, and delete existing airports
- **Airport-Specific Views**: Each airport has its own dedicated workspace

### Configuration Management
- **Default Configurations**: Pre-configured Config 1 and Config 2 for each airport
- **Custom Configurations**: Create unlimited custom configurations per airport
- **Configuration Hierarchy**: Each config includes:
  - **GLIDEPATH**: Glide path configurations
  - **SECTORS**: Airspace sector definitions
  - **NAVAIDS**: Navigation aids
    - **FIX**: Waypoints and fixes
    - **VOR**: VHF Omnidirectional Range stations
  - **PROCS**: Procedures
    - **IAC**: Instrument Approach Charts
    - **SID**: Standard Instrument Departures
    - **STAR**: Standard Terminal Arrival Routes
    - **TRANSITION**: Transition procedures

### Traffic Management
- **Route Management**: Add and manage flight routes
- **Airlines**: Specify operating airlines
- **Aircraft Types**: Define aircraft categories
- **Wake Categories**: L, M, H, J classifications
- **Flight Levels**: Set FL bottom and top
- **Popularity**: Route frequency indicators
- **Search & Sort**: Advanced filtering and sorting capabilities

### User Interface
- **Modern Design**: Clean, intuitive interface
- **Responsive Layout**: Works on desktop and mobile devices
- **Real-time Search**: Instant filtering of airports and configurations
- **Visual Feedback**: Hover effects and animations
- **Modal Dialogs**: Clean input forms for data entry

## 🛠️ Technology Stack

- **Frontend**: React.js
- **Styling**: CSS-in-JS with custom design system
- **Icons**: Material Icons
- **Storage**: Local Storage for data persistence
- **Build Tool**: Create React App

## 📁 Project Structure

```
voiceatc-simulator-airport-creator/
├── route-manager/          # Main React application
│   ├── src/
│   │   ├── App.js         # Main application component
│   │   ├── App.css        # Global styles
│   │   └── index.js       # Application entry point
│   ├── public/
│   │   ├── index.html     # HTML template
│   │   └── manifest.json  # PWA manifest
│   └── package.json       # Dependencies and scripts
├── README.md              # This file
└── package.json           # Root package configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/voiceatc-simulator-airport-creator.git
   cd voiceatc-simulator-airport-creator
   ```

2. **Install dependencies**
   ```bash
   cd route-manager
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### Creating an Airport
1. Click **"New Airport"** in the navigation bar
2. Enter a 4-letter ICAO code (e.g., ENTC, ESSA)
3. Click **"Create"** to add the airport

### Managing Configurations
1. Navigate to **Settings** → **Manage Configs**
2. Select an airport from the dropdown
3. View, rename, or delete configurations
4. Default configs (Config 1, Config 2) are always available

### Adding Traffic Routes
1. Navigate to **Your Airports** → **[ICAO]** → **General Files** → **TRAFFIC**
2. Fill in the route details:
   - **Airport**: Destination ICAO
   - **Airlines**: Operating carriers
   - **Route**: Navigation waypoints
   - **Aircraft**: Aircraft types
   - **Wake Category**: L/M/H/J
   - **FL Bottom/Top**: Flight levels
   - **Popularity**: Route frequency (0-100)
3. Click **"Add Route"** to save

### Creating Custom Configurations
1. Click **"New Config"** in the navigation bar
2. Select the target airport
3. Enter a configuration name (e.g., "Config ABC")
4. Click **"Create"** to add the configuration

## 🎯 Key Features Explained

### Airport-Specific Organization
Each airport maintains its own set of:
- **General Files**: Basic airport information
- **Configurations**: Multiple config sets for different scenarios
- **Traffic Routes**: Flight paths and schedules

### Configuration Hierarchy
Configurations are organized in a logical hierarchy:
```
Airport
├── Config 1 (Default)
├── Config 2 (Default)
├── Config ABC (Custom)
├── Config XYZ (Custom)
└── ...
    ├── GLIDEPATH
    ├── SECTORS
    ├── NAVAIDS
    │   ├── FIX
    │   └── VOR
    └── PROCS
        ├── IAC
        ├── SID
        ├── STAR
        └── TRANSITION
```

### Data Persistence
All data is automatically saved to local storage:
- **Airports**: ICAO codes and creation dates
- **Configurations**: Names, types, and airport associations
- **Traffic Routes**: Complete route information
- **Settings**: User preferences and selections

## 🔧 Development

### Available Scripts
- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run test suite
- `npm eject`: Eject from Create React App

### Code Structure
The application uses a single-page architecture with:
- **State Management**: React hooks for local state
- **Component Architecture**: Functional components with hooks
- **Styling**: Inline styles with consistent design system
- **Event Handling**: Comprehensive click and hover interactions

### Key Components
- **App.js**: Main application component with all logic
- **Navigation**: Dynamic dropdown system
- **Modals**: Input forms and confirmations
- **Settings**: Airport and configuration management

## 🎨 Design System

### Color Palette
- **Primary**: #0B1E39 (Dark Blue)
- **Secondary**: #3b82f6 (Blue)
- **Success**: #10b981 (Green)
- **Error**: #ef4444 (Red)
- **Neutral**: #6b7280 (Gray)

### Typography
- **Font Family**: Inter, sans-serif
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semi-bold)

### Spacing
- **Consistent**: 8px, 12px, 16px, 24px grid system
- **Responsive**: Adapts to different screen sizes

## 🔒 Data Security

- **Local Storage**: All data stored locally in browser
- **No External APIs**: No data transmitted to external servers
- **Privacy**: Complete user control over data

## 🚀 Deployment

### Production Build
```bash
cd route-manager
npm run build
```

### Static Hosting
The built application can be deployed to any static hosting service:
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Deploy from repository
- **AWS S3**: Upload build files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Issues**: Create an issue on GitHub
- **Documentation**: Check this README and inline code comments
- **Community**: Join our Discord server (if available)

## 🔄 Version History

### v1.0.0
- Initial release
- Airport management system
- Configuration hierarchy
- Traffic route management
- Modern UI/UX design

---

**VoiceATC Airport Creator** - Empowering flight simulation with comprehensive airport and route management tools. 
