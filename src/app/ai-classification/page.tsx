'use client';

import {useState} from 'react';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {classifyWaste} from '@/ai/flows/classify-waste';

export default function AiClassificationPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [wasteType, setWasteType] = useState<string | null>(null);
  const [disposalInstructions, setDisposalInstructions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
          <Input
            type="url"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
          />
          <Button onClick={handleClassify} disabled={loading}>
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
