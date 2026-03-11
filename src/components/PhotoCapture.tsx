import { useState } from 'react';
import { db } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Loader2 } from 'lucide-react';

interface PhotoCaptureProps {
  value: string | undefined;
  onChange: (url: string | undefined) => void;
  disabled: boolean;
  userId: string;
  inspectionName: string;
  fieldColumn: string;
}

export function PhotoCapture({ value, onChange, disabled, userId, inspectionName, fieldColumn }: PhotoCaptureProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const url = await db.storage.uploadPhoto(userId, inspectionName, fieldColumn, file);
      onChange(url);
    } catch (err: any) {
      setError('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    if (confirm('Delete this photo?')) {
      onChange(undefined);
    }
  };

  if (value) {
    return (
      <div className="space-y-3">
        <img
          src={value}
          alt="Uploaded photo"
          className="max-w-full rounded-lg border"
        />
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Photo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed border-muted' : 'border-input hover:border-primary hover:bg-muted/50'
      }`}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {uploading ? (
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Tap to capture or select a photo</p>
            </>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          className="hidden"
        />
      </label>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
