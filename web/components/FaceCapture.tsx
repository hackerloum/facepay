"use client";

import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 480,
  height: 360,
  facingMode: "user",
};

interface FaceCaptureProps {
  onCapture: (imageBase64: string) => void;
  disabled?: boolean;
}

export function FaceCapture({ onCapture, disabled }: FaceCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [captured, setCaptured] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCaptured(imageSrc);
      onCapture(imageSrc);
    }
  }, [onCapture]);

  const retake = useCallback(() => {
    setCaptured(null);
  }, []);

  if (captured) {
    return (
      <div className="space-y-4">
        <div className="relative rounded-xl overflow-hidden border-2 border-accent-blue/50 aspect-video max-w-md mx-auto bg-bg-secondary">
          <img
            src={captured}
            alt="Captured face"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={retake}
            className="px-4 py-2 rounded-lg border border-border text-text-secondary hover:border-accent-blue hover:text-accent-blue transition-colors"
          >
            Retake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border-2 border-accent-blue/50 aspect-video max-w-md mx-auto bg-bg-secondary">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-2 border-accent-blue/50 animate-pulse" />
        </div>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-center text-text-secondary text-sm">
        Position your face in the circle. Ensure good lighting.
      </p>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={capture}
          disabled={disabled}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-accent-blue to-blue-500 text-bg-primary font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Capture Face
        </button>
      </div>
    </div>
  );
}
