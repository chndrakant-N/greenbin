'use client';

import {useState, useEffect} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Location, RecyclingCenter, getNearbyRecyclingCenters} from '@/services/google-maps';

interface GoogleMapsProps {
  apiKey: string;
  location: Location;
  recyclingCenters: RecyclingCenter[];
}

async function GoogleMaps({apiKey, location, recyclingCenters}: GoogleMapsProps) {
  const {ReactGoogleMaps} = await import('@vis.gl/react-google-maps');
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

export default function RecyclingLocatorPage() {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [recyclingCenters, setRecyclingCenters] = useState<RecyclingCenter[]>([]);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        error => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }

    // Load Google Maps API Key from .env file
    setGoogleMapsApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null);
  }, []);

  useEffect(() => {
    async function loadRecyclingCenters() {
      if (userLocation) {
        const centers = await getNearbyRecyclingCenters(userLocation);
        setRecyclingCenters(centers);
      }
    }

    loadRecyclingCenters();
  }, [userLocation]);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Recycling Center Locator</CardTitle>
          <CardDescription>Find the nearest recycling centers and waste collection points.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {userLocation ? (
            <>
              {googleMapsApiKey ? (
                <GoogleMaps
                  apiKey={googleMapsApiKey}
                  location={userLocation}
                  recyclingCenters={recyclingCenters}
                />
              ) : (
                <p>Error: Google Maps API Key not found.</p>
              )}
              <ul className="list-disc pl-5">
                {recyclingCenters.map(center => (
                  <li key={center.name}>
                    <strong>{center.name}</strong> - {center.details}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>Loading your location...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
