import { INDIA_STATE_PROFILES } from "../data/indiaStateProfiles";
import type { StateProfile } from "../types";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function haversineDistance(
  origin: Coordinates,
  destination: Coordinates,
): number {
  const earthRadiusInKm = 6371;
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);

  const a =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(toRadians(origin.latitude)) *
      Math.cos(toRadians(destination.latitude)) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusInKm * c;
}

export function inferNearestState(
  coordinates: Coordinates,
): StateProfile | null {
  if (!Number.isFinite(coordinates.latitude) || !Number.isFinite(coordinates.longitude)) {
    return null;
  }

  let nearestProfile: StateProfile | null = null;
  let shortestDistance = Number.POSITIVE_INFINITY;

  for (const profile of INDIA_STATE_PROFILES) {
    const distance = haversineDistance(coordinates, {
      latitude: profile.centroid.lat,
      longitude: profile.centroid.lng,
    });

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestProfile = profile;
    }
  }

  return nearestProfile;
}

export function requestCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation is not available in this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  });
}
