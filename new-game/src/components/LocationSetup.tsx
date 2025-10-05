import React from 'react';
import { MapLocationSelector } from './MapLocationSelector';

interface LocationSetupProps {
  onComplete: (location: string, coordinates?: { lat: number; lng: number; address?: string }) => void;
}

export function LocationSetup({ onComplete }: LocationSetupProps) {
  return <MapLocationSelector onComplete={onComplete} />;
}