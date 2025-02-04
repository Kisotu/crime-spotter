/* eslint-disable no-unused-vars */
// App.js
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const initialCrimes = [
  {
    id: 1,
    location: [51.505, -0.09],
    type: 'Theft',
    severity: 'Medium',
    date: '2023-07-15',
    description: 'Pickpocketing incident'
  },
  // Add more initial data points
];

function App() {
  const [crimes, setCrimes] = useState(initialCrimes);
  const [selectedPosition, setSelectedPosition] = useState([51.505, -0.09]);
  const [filters, setFilters] = useState({ type: '', date: '' });

  const handleAddCrime = (newCrime) => {
    setCrimes([...crimes, newCrime]);
  };

  const filteredCrimes = crimes.filter(crime => {
    return (!filters.type || crime.type === filters.type) &&
           (!filters.date || crime.date === filters.date);
  });

  return (
    <div className="app-container">
      <Sidebar 
        onLocationSelect={setSelectedPosition}
        onAddCrime={handleAddCrime}
        filters={filters}
        setFilters={setFilters}
      />
      <div className="map-container">
        <MapContainer center={selectedPosition} zoom={13}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredCrimes.map(crime => (
            <Marker key={crime.id} position={crime.location}>
              <Popup>
                <h3>{crime.type}</h3>
                <p>Severity: {crime.severity}</p>
                <p>Date: {crime.date}</p>
                <p>{crime.description}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar({ onLocationSelect, onAddCrime, filters, setFilters }) {
  const [newCrime, setNewCrime] = useState({
    type: '',
    severity: 'Low',
    date: '',
    description: '',
    location: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const [lat, lng] = newCrime.location.split(',').map(Number);
    onAddCrime({
      ...newCrime,
      id: Date.now(),
      location: [lat, lng]
    });
    setNewCrime({ ...newCrime, description: '', location: '' });
  };

  return (
    <div className="sidebar">
      <div className="filters">
        <select 
          // eslint-disable-next-line react/prop-types
          value={filters.type} 
          onChange={(e) => setFilters({...filters, type: e.target.value})}
        >
          <option value="">All Crime Types</option>
          <option value="Theft">Theft</option>
          <option value="Assault">Assault</option>
        </select>
        <input 
          type="date" 
          // eslint-disable-next-line react/prop-types
          value={filters.date}
          onChange={(e) => setFilters({...filters, date: e.target.value})}
        />
      </div>

      <form onSubmit={handleSubmit} className="crime-form">
        <h3>Report Incident</h3>
        <select
          value={newCrime.type}
          onChange={(e) => setNewCrime({...newCrime, type: e.target.value})}
          required
        >
          <option value="">Select Crime Type</option>
          <option value="Theft">Theft</option>
          <option value="Assault">Assault</option>
        </select>
        <input
          type="text"
          placeholder="Latitude,Longitude"
          value={newCrime.location}
          onChange={(e) => setNewCrime({...newCrime, location: e.target.value})}
          required
        />
        <textarea
          placeholder="Description"
          value={newCrime.description}
          onChange={(e) => setNewCrime({...newCrime, description: e.target.value})}
        />
        <button type="submit">Report Crime</button>
      </form>
    </div>
  );
}

export default App;