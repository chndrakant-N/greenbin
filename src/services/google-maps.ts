/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Represents a recycling center with its location and other details.
 */
export interface RecyclingCenter {
  /**
   * The name of the recycling center.
   */
  name: string;
  /**
   * The location of the recycling center.
   */
  location: Location;
  /**
   * Additional details about the recycling center (e.g., accepted materials, hours of operation).
   */
  details?: string;
}

/**
 * Asynchronously retrieves a list of recycling centers near a given location.
 *
 * @param location The location to search near.
 * @returns A promise that resolves to an array of RecyclingCenter objects.
 */
export async function getNearbyRecyclingCenters(location: Location): Promise<RecyclingCenter[]> {
  // TODO: Implement this by calling the Google Maps API.

  return [
    {
      name: 'EcoCycle Recycling Center',
      location: { lat: 34.0522, lng: -118.2437 },
      details: 'Accepts paper, plastic, and aluminum.',
    },
    {
      name: 'Green Solutions Recycling',
      location: { lat: 34.0522, lng: -118.2437 },
      details: 'Accepts electronic waste and batteries.',
    },
  ];
}
