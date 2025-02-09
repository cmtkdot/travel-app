import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapComponentProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers?: { lat: number; lng: number }[];
}

const MapComponent: React.FC<MapComponentProps> = ({ center, zoom, markers = [] }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
      >
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
