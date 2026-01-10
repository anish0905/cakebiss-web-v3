"use client";
import { useState, useEffect } from 'react';

export default function BackgroundRemover() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [removeBackground, setRemoveBackground] = useState<any>(null);

  // Library ko dynamically load karna taaki SSR error na aaye
  useEffect(() => {
    import('@imgly/background-removal').then((mod) => {
      setRemoveBackground(() => mod.default || mod.removeBackground);
    });
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && removeBackground) {
      setImage(URL.createObjectURL(file));
      setLoading(true);

      try {
        // Background removal call
        const blob = await removeBackground(file);
        const url = URL.createObjectURL(blob);
        setResultImage(url);
      } catch (error) {
        console.error("Removal failed:", error);
        alert("Error removing background.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-2xl font-bold mb-5">Free BG Remover</h1>
      
      {!removeBackground ? (
        <p>Loading AI Engine...</p>
      ) : (
        <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-5" />
      )}

      {loading && <p className="text-blue-500">Processing... (Pehli baar mein ~1 min lag sakta hai)</p>}

      <div className="flex gap-4 mt-5">
        {image && <img src={image} alt="Original" className="w-48 h-auto border" />}
        {resultImage && <img src={resultImage} alt="Result" className="w-48 h-auto border border-green-500" />}
      </div>
    </div>
  );
}