'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeDisplayProps {
  profileUrl: string;
  username?: string;
}

export function QRCodeDisplay({ profileUrl, username }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (canvasRef.current && profileUrl) {
      QRCode.toCanvas(
        canvasRef.current,
        profileUrl,
        {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) {
            console.error('QR Code generation error:', error);
            toast.error('Failed to generate QR code');
          }
        }
      );

      // Generate data URL for download
      QRCode.toDataURL(
        profileUrl,
        {
          width: 512,
          margin: 2,
        },
        (error, url) => {
          if (!error) {
            setQrDataUrl(url);
          }
        }
      );
    }
  }, [profileUrl]);

  const handleDownload = () => {
    if (!qrDataUrl) {
      toast.error('QR code not ready');
      return;
    }

    const link = document.createElement('a');
    link.download = `${username || 'profile'}-qr-code.png`;
    link.href = qrDataUrl;
    link.click();
    toast.success('QR code downloaded');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Profile link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          QR Code
        </CardTitle>
        <CardDescription>
          Share your profile with a QR code
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-white rounded-lg border">
          <canvas ref={canvasRef} />
        </div>

        <div className="w-full space-y-2">
          <p className="text-sm text-muted-foreground text-center break-all">
            {profileUrl}
          </p>

          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1"
              disabled={!qrDataUrl}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="flex-1"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
