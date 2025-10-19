
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, FileCheck2, Loader2, UploadCloud } from 'lucide-react';
import JSZip from 'jszip';
import { handleUfdrUpload } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface UfdrUploadProps {
    onUploadSuccess: (extractedData: string, graphData: any) => void;
}

// Helper to convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export function UfdrUpload({ onUploadSuccess }: UfdrUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ extractedData: string; categories: string[] } | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setFileName(file.name);

    try {
        let fileContent: string;
        let imageFiles: { path: string; dataUri: string }[] = [];
        const lowerCaseFileName = file.name.toLowerCase();

        if (lowerCaseFileName.endsWith('.ufdr') || lowerCaseFileName.endsWith('.zip')) {
            const zip = await JSZip.loadAsync(file);
            const reportXmlFile = zip.file('report.xml');
            if (!reportXmlFile) {
                throw new Error('report.xml not found in the uploaded archive.');
            }
            fileContent = await reportXmlFile.async('string');

            // Extract images
            const imagePromises = Object.values(zip.files)
                .filter(file => !file.dir && /\.(jpe?g|png|gif)$/i.test(file.name))
                .map(async (imageFile) => {
                    const content = await imageFile.async('arraybuffer');
                    const mimeType = imageFile.name.endsWith('png') ? 'image/png' : 'image/jpeg';
                    const dataUri = `data:${mimeType};base64,${arrayBufferToBase64(content)}`;
                    return { path: imageFile.name, dataUri: dataUri };
                });
            
            imageFiles = await Promise.all(imagePromises);
            // Store images in local storage
            localStorage.setItem('ufdrImageData', JSON.stringify(imageFiles));


        } else if (lowerCaseFileName.endsWith('.xml') || lowerCaseFileName.endsWith('.html')) {
            fileContent = await file.text();
             localStorage.removeItem('ufdrImageData');
        } else {
            throw new Error('Unsupported file type. Please upload a .ufdr, .zip, .xml, or .html file.');
        }

        const fileBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const response = await handleUfdrUpload({ 
            fileName: file.name,
            reportXml: fileContent, 
            fileHash,
            userId: 'mock-user-id', // Using a mock user ID
        });

        if (response.extractedData.startsWith('Error:')) {
            throw new Error(response.extractedData);
        }
        
        const newCase = {
            id: `CASE-${Date.now()}`,
            name: `Case from ${file.name}`,
            status: 'Active',
            date: new Date().toISOString().split('T')[0],
            evidenceCount: 1,
            // Store the raw extracted data with the case for report generation
            extractedData: response.extractedData,
            evidenceHash: fileHash,
        };
        const existingCases = JSON.parse(localStorage.getItem('forensicCases') || '[]');
        localStorage.setItem('forensicCases', JSON.stringify([...existingCases, newCase]));
        
        window.dispatchEvent(new CustomEvent('app-storage-change'));

        setResult(response);
        onUploadSuccess(response.extractedData, null); // Pass null for graphData for now

    } catch (e: any) {
        setError(e.message || 'An unexpected error occurred during upload.');
    } finally {
        setIsLoading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 
        'application/zip': ['.ufdr', '.zip'],
        'text/xml': ['.xml'],
        'text/html': ['.html'],
     },
  });

  return (
    <Card className="glowing-card">
      <CardHeader>
        <CardTitle>Evidence File Upload & Case Creation</CardTitle>
        <CardDescription>
          Upload an evidence file (.ufdr, .zip, .xml, .html) to automatically create a new case and analyze its content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p>Processing {fileName}...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-muted-foreground text-center">
                <UploadCloud className="h-10 w-10" />
                {isDragActive ? (
                    <p>Drop the file here ...</p>
                ) : (
                    <p>Drag & drop a file here, or click to select file</p>
                )}
                 <p className="text-xs">Supported formats: .ufdr, .zip, .xml, .html</p>
            </div>
          )}
        </div>

        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Upload Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {result && (
            <Alert variant="default" className="border-green-500/50">
                <FileCheck2 className="h-4 w-4" />
                <AlertTitle>Processing Complete for {fileName}</AlertTitle>
                <AlertDescription>
                   A new case has been created and the evidence file has been processed. The extracted data is now available in the 'Natural Language Query' tab. The Dashboard and Cases pages have been updated.
                </AlertDescription>
                <div className="mt-4 space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Detected Evidence Categories:</h4>
                        <div className="flex flex-wrap gap-2">
                            {result.categories.map(cat => (
                                <Badge key={cat} variant="secondary">{cat}</Badge>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2">Extracted Data Preview:</h4>
                        <ScrollArea className="h-48 rounded-md border bg-secondary/30 p-4">
                            <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                                {result.extractedData}
                            </pre>
                        </ScrollArea>
                    </div>
                </div>

            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
