'use server';

import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Location, RecyclingCenter, getNearbyRecyclingCenters } from '@/services/google-maps';

interface GoogleMapsProps {
  apiKey: string;
  location: Location;
  recyclingCenters: RecyclingCenter[];
}

async function GoogleMaps({ apiKey, location, recyclingCenters }: GoogleMapsProps) {
  const { ReactGoogleMaps } = await import('@vis.gl/react-google-maps');
  return (
    <ReactGoogleMaps
      googleMapsApiKey={apiKey}
      width="100%"
      height="400px"
      defaultCenter={location}
      defaultZoom={12}
    >
      {recyclingCenters.map((center) => (
        <ReactGoogleMaps.Marker
          key={center.name}
          position={center.location}
          title={center.name}
        />
      ))}
    </ReactGoogleMaps>
  );
}

async function RecyclingLocatorPage() {
  const userLocation: Location = { lat: 34.0522, lng: -118.2437 }; // Hardcoded location for now
  const recyclingCenters = await getNearbyRecyclingCenters(userLocation);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Recycling Center Locator</CardTitle>
          <CardDescription>Find the nearest recycling centers and waste collection points.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {googleMapsApiKey ? (
            <Suspense fallback={<p>Loading map...</p>}>
              <GoogleMaps
                apiKey={googleMapsApiKey}
                location={userLocation}
                recyclingCenters={recyclingCenters}
              />
            </Suspense>
          ) : (
            <p>Error: Google Maps API Key not found.</p>
          )}
          <ul className="list-disc pl-5">
            {recyclingCenters.map((center) => (
              <li key={center.name}>
                <strong>{center.name}</strong> - {center.details}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default RecyclingLocatorPage;
