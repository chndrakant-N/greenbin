'use client';

import {useState} from 'react';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Calendar} from '@/components/ui/calendar';
import {format} from 'date-fns';
import {cn} from '@/lib/utils';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {getWastePickupSchedule} from '@/services/waste-collection';

export default function SchedulePickupPage() {
  const [address, setAddress] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSchedulePickup = async () => {
    setIsLoading(true);
    try {
      const pickupSchedule = await getWastePickupSchedule(address);
      setSchedule(pickupSchedule);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setSchedule(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Schedule Waste Pickup</CardTitle>
          <CardDescription>Schedule a waste pickup with your local municipal services.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Input
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />

          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={d => d < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button onClick={handleSchedulePickup} disabled={isLoading}>
            {isLoading ? 'Scheduling...' : 'Schedule Pickup'}
          </Button>

          {schedule && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Pickup Schedule:</h3>
              <p>Date: {schedule.date}</p>
              <p>Time: {schedule.time}</p>
              <p>Type: {schedule.type}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
