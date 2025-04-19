'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to GreenCycle</CardTitle>
          <CardDescription>Smart Waste Management System</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <p>
            GreenCycle is your solution for smart waste management. Classify waste with AI, locate recycling centers,
            and schedule waste pickups.
          </p>
          <Button onClick={() => router.push('/ai-classification')}>Classify Waste with AI</Button>
          <Button variant="secondary" onClick={() => router.push('/recycling-locator')}>
            Find Recycling Centers
          </Button>
          <Button variant="outline" onClick={() => router.push('/schedule-pickup')}>
            Schedule Waste Pickup
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
