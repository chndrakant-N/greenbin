'use client';

import {Location, RecyclingCenter} from '@/services/google-maps';
import {useEffect, useState} from 'react';

interface GoogleMapsProps {
  apiKey: string;
  location: Location;
  recyclingCenters: RecyclingCenter[];
}

function GoogleMapsClient({apiKey, location, recyclingCenters}: GoogleMapsProps) {
  const [ReactGoogleMaps, setReactGoogleMaps] = useState<any>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      const {ReactGoogleMaps} = await import('@vis.gl/react-google-maps');
      setReactGoogleMaps(ReactGoogleMaps);
    };

    loadGoogleMaps();
  }, []);

  if (!ReactGoogleMaps) {
    return <p>Loading map...</p>;
  }

  return (
    <ReactGoogleMaps
      googleMapsApiKey={apiKey}
      width="100%"
      height="400px"
      defaultCenter={location}
      defaultZoom={12}
    >
      {recyclingCenters.map(center => (
        <ReactGoogleMaps.Marker
          key={center.name}
          position={center.location}
          title={center.name}
        />
      ))}
    </ReactGoogleMaps>
  );
}

export default GoogleMapsClient;
