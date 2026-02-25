import { useState } from "react";
import { Eye, User } from "lucide-react"; // Add User icon
import ImageUploader from "@/components/ImageUploader";
import AnalyzeButton from "@/components/AnalyzeButton";
import ResultsList from "@/components/ResultsList";

const API_URL = "https://7l5z4wa908.execute-api.us-east-1.amazonaws.com/dev/upload";

interface DetectedLabel {
  Name: string;
  Confidence: number;
}

interface Celebrity {
  Name: string;
  Id: string;
  MatchConfidence: number;
  Urls?: string[];
}

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState<DetectedLabel[]>([]);
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [analysisType, setAnalysisType] = useState<'labels' | 'celebrities'>('labels');
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (selectedFile: File, previewUrl: string) => {
    setFile(selectedFile);
    setPreview(previewUrl);
    setLabels([]);
    setCelebrities([]);
    setError(null);
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setLabels([]);
    setCelebrities([]);
    setError(null);
  };

  const convertToJPEG = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          const jpegBase64 = canvas.toDataURL('image/jpeg').split(',')[1];
          resolve(jpegBase64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleAnalyze = async () => {
    if (!file || !preview) return;

    setLoading(true);
    setError(null);
    setLabels([]);
    setCelebrities([]);

    try {
      const base64 = await convertToJPEG(file);
      const newFilename = file.name.replace(/\.[^/.]+$/, '.jpg');

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          image: base64, 
          filename: newFilename,
          analysisType: analysisType  // Send the selected type
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
     
      console.log('Celebrity data:', data.celebrities);

      if (data.celebrities) {
        setCelebrities(data.celebrities);
      } else if (data.labels) {
        setLabels(data.labels);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-2.5">
          <div className="rounded-lg gradient-bg p-1.5">
            {analysisType === 'celebrities' ? (
              <User className="h-5 w-5 text-primary-foreground" />
            ) : (
              <Eye className="h-5 w-5 text-primary-foreground" />
            )}
          </div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            AI Image Recognizer
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-5">
            
            {/* NEW: Analysis Type Selector */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setAnalysisType('labels')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  analysisType === 'labels'
                    ? 'gradient-bg text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Eye className="inline mr-2 h-4 w-4" />
                Detect Objects
              </button>
              <button
                onClick={() => setAnalysisType('celebrities')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  analysisType === 'celebrities'
                    ? 'gradient-bg text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <User className="inline mr-2 h-4 w-4" />
                Find Celebrities
              </button>
            </div>

            <ImageUploader
              onImageSelect={handleImageSelect}
              onClear={handleClear}
              preview={preview}
            />

            <AnalyzeButton
              onClick={handleAnalyze}
              disabled={!file || loading}
              loading={loading}
            />

            {error && (
              <div className="animate-fade-in-up rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Updated Results Display */}
            {analysisType === 'celebrities' && celebrities.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Detected Celebrities:</h3>
                <div className="space-y-3">
                  {celebrities.map((celeb, idx) => (
                    <div key={idx} className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{celeb.Name}</span>
                        <span className="text-sm bg-primary/10 px-2 py-1 rounded">
                          {celeb.MatchConfidence}% confident
                        </span>
                      </div>
                      {celeb.Urls && celeb.Urls.length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span>More info: </span>
                          {celeb.Urls
                            .map((url, i) => {
                              // Ensure we have a string
                              if (!url || typeof url !== 'string') return null;
                              
                              let displayUrl = url;
                              let href = url;

                              // If URL doesn't start with http, prepend https://
                              if (!url.startsWith('http')) {
                                href = 'https://' + url;
                              }

                              // Try to extract hostname for display, fallback to cleaned URL
                              try {
                                displayUrl = new URL(href).hostname;
                              } catch {
                                // If still invalid, just show the original string (maybe truncated)
                                displayUrl = url.length > 30 ? url.substring(0, 30) + '…' : url;
                              }

                              return (
                                <a 
                                  key={i}
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline ml-1"
                                >
                                  {displayUrl}
                                </a>
                              );
                            })
                            .filter(Boolean) // remove null entries
                          }
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysisType === 'labels' && labels.length > 0 && (
              <ResultsList labels={labels} />
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Index;