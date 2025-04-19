'use client';

import {useState, useRef, useEffect} from 'react';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {classifyWaste} from '@/ai/flows/classify-waste';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {toast} from '@/hooks/use-toast';

export default function AiClassificationPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [wasteType, setWasteType] = useState<string | null>(null);
  const [disposalInstructions, setDisposalInstructions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        setImageUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptureImage = () => {
    if (videoRef.current && hasCameraPermission) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setSelectedImage(dataUrl);
      setImageUrl(dataUrl);
    }
  };

  const handleClassify = async () => {
    setLoading(true);
    try {
      const result = await classifyWaste({photoUrl: imageUrl});
      setWasteType(result.wasteType);
      setDisposalInstructions(result.disposalInstructions);
    } catch (error) {
      console.error('Classification error:', error);
      setWasteType('Error');
      setDisposalInstructions('Could not classify waste. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">AI Waste Classification</CardTitle>
          <CardDescription>Upload an image of waste, and our AI will classify it for you.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {selectedImage && (
            <img src={selectedImage} alt="Waste Preview" className="w-full aspect-video rounded-md" />
          )}

          <Input
            type="url"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            ref={fileInputRef}
          />
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            Upload Image
          </Button>

          <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />

          { !(hasCameraPermission) && (
              <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access to use this feature.
                </AlertDescription>
              </Alert>
          )
          }

          <Button
            variant="secondary"
            onClick={handleCaptureImage}
            disabled={!hasCameraPermission}
          >
            Capture Image
          </Button>

          <Button onClick={handleClassify} disabled={loading || !imageUrl}>
            {loading ? 'Classifying...' : 'Classify Waste'}
          </Button>

          {wasteType && disposalInstructions && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Classification Result:</h3>
              <Textarea
                readOnly
                value={`Waste Type: ${wasteType}\nDisposal Instructions: ${disposalInstructions}`}
                className="mt-2"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
