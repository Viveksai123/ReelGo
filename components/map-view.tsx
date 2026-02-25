'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Autocomplete,
  BicyclingLayer,
  GoogleMap,
  Marker,
  TrafficLayer,
  TransitLayer,
  useJsApiLoader,
} from '@react-google-maps/api';
import { Crosshair, Navigation, Route, Satellite, Layers } from 'lucide-react';

interface LocationData {
  lat: number;
  lng: number;
  zoom: number;
  tilt?: number;
  timestamp: number;
}

interface MapViewProps {
  role: 'tracker' | 'tracked';
  trackerLocation: LocationData | null;
  onLocationChange?: (lat: number, lng: number, zoom: number, tilt?: number) => void;
}

type MapTypeId = 'roadmap' | 'satellite' | 'hybrid' | 'terrain';

const EMIT_THROTTLE_MS = 100;

export function MapView({ role, trackerLocation, onLocationChange }: MapViewProps) {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 });
  const [zoom, setZoom] = useState(14);
  const [tilt, setTilt] = useState(0);
  const [trackerMarker, setTrackerMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [searchText, setSearchText] = useState('');
  const [mapType, setMapType] = useState<MapTypeId>('roadmap');
  const [showTraffic, setShowTraffic] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const [showBicycling, setShowBicycling] = useState(false);
  const [followTracker, setFollowTracker] = useState(true);
  const [searchError, setSearchError] = useState('');

  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const lastEmitRef = useRef(0);
  const geoWatchRef = useRef<number | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const trackerMode = role === 'tracker';

  const emitTrackerView = useCallback(() => {
    if (!trackerMode || !mapRef.current) return;

    const now = Date.now();
    if (now - lastEmitRef.current < EMIT_THROTTLE_MS) return;
    lastEmitRef.current = now;

    const center = mapRef.current.getCenter();
    const currentZoom = mapRef.current.getZoom();
    const currentTilt = mapRef.current.getTilt();
    if (!center || typeof currentZoom !== 'number') return;

    const lat = Number(center.lat().toFixed(6));
    const lng = Number(center.lng().toFixed(6));
    const z = Number(currentZoom.toFixed(2));
    const t = Number((currentTilt ?? 0).toFixed(2));

    setMapCenter({ lat, lng });
    setZoom(z);
    setTilt(t);
    setTrackerMarker({ lat, lng });
    onLocationChange?.(lat, lng, z, t);
  }, [onLocationChange, trackerMode]);

  const syncToTracker = useCallback((location: LocationData) => {
    if (!mapRef.current) return;
    const next = { lat: location.lat, lng: location.lng };
    setMapCenter(next);
    setZoom(location.zoom);
    setTilt(location.tilt ?? 0);
    setTrackerMarker(next);
    mapRef.current.panTo(next);
    mapRef.current.setZoom(location.zoom);
    mapRef.current.setTilt(location.tilt ?? 0);
  }, []);

  useEffect(() => {
    if (!trackerLocation || trackerMode || !followTracker) return;
    syncToTracker(trackerLocation);
  }, [followTracker, syncToTracker, trackerLocation, trackerMode]);

  const locateCurrentUser = useCallback(() => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = { lat: position.coords.latitude, lng: position.coords.longitude };
        mapRef.current?.panTo(next);
        mapRef.current?.setZoom(16);
        setMapCenter(next);
        setZoom(16);
        if (trackerMode) {
          setTrackerMarker(next);
          emitTrackerView();
        }
      },
      () => {
        // Ignore user denied.
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, [emitTrackerView, trackerMode]);

  useEffect(() => {
    if (!trackerMode || !navigator.geolocation) return;

    geoWatchRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const next = { lat: position.coords.latitude, lng: position.coords.longitude };
        setTrackerMarker(next);
        setMapCenter(next);
        onLocationChange?.(next.lat, next.lng, zoom, tilt);
      },
      () => {
        // Ignore watch errors.
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 1000 }
    );

    return () => {
      if (geoWatchRef.current !== null) {
        navigator.geolocation.clearWatch(geoWatchRef.current);
      }
    };
  }, [onLocationChange, tilt, trackerMode, zoom]);

  const handleSearch = useCallback(() => {
    if (!searchText.trim() || !window.google?.maps?.Geocoder || !mapRef.current) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchText }, (results, status) => {
      if (status !== 'OK' || !results?.[0]?.geometry?.location) {
        setSearchError('Location not found');
        return;
      }
      const loc = results[0].geometry.location;
      mapRef.current?.panTo(loc);
      mapRef.current?.setZoom(15);
      setSearchError('');
      if (trackerMode) emitTrackerView();
    });
  }, [emitTrackerView, searchText, trackerMode]);

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    const loc = place?.geometry?.location;
    if (!loc || !mapRef.current) {
      setSearchError('Select a valid location');
      return;
    }
    mapRef.current.panTo(loc);
    mapRef.current.setZoom(15);
    setSearchText(place?.formatted_address || place?.name || searchText);
    setSearchError('');
    if (trackerMode) emitTrackerView();
  }, [emitTrackerView, searchText, trackerMode]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    map.setMapTypeId(mapType);
    if (trackerMode) {
      locateCurrentUser();
    }
  }, [locateCurrentUser, mapType, trackerMode]);

  if (loadError) {
    return <div className="w-full h-full grid place-items-center text-destructive">Failed to load Google Maps</div>;
  }

  if (!isLoaded) {
    return <div className="w-full h-full grid place-items-center text-muted-foreground">Loading map...</div>;
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={zoom}
        onLoad={onMapLoad}
        onIdle={emitTrackerView}
        options={{
          mapTypeId: mapType,
          fullscreenControl: true,
          mapTypeControl: false,
          streetViewControl: true,
          rotateControl: true,
          zoomControl: true,
          keyboardShortcuts: true,
          clickableIcons: true,
          gestureHandling: trackerMode || !followTracker ? 'greedy' : 'none',
        }}
      >
        {trackerMarker && <Marker position={trackerMarker} />}
        {showTraffic && <TrafficLayer />}
        {showTransit && <TransitLayer />}
        {showBicycling && <BicyclingLayer />}
      </GoogleMap>

      <div className="absolute left-3 right-3 top-3 z-20 pointer-events-auto sm:left-4 sm:right-auto sm:w-[30rem]">
        <div className="rounded-xl border border-border/80 bg-card/90 p-2 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Autocomplete
              onLoad={(autocomplete) => {
                autocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={handlePlaceChanged}
              options={{ fields: ['formatted_address', 'geometry', 'name'] }}
            >
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder="Search location"
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            </Autocomplete>
            <button
              onClick={handleSearch}
              className="h-9 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground"
            >
              Search
            </button>
          </div>
          {searchError && (
            <div className="mt-1 text-xs text-destructive">{searchError}</div>
          )}
          <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
            <button
              onClick={locateCurrentUser}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1"
            >
              <Crosshair className="h-3.5 w-3.5" /> Locate
            </button>
            <button
              onClick={() => setMapType((p) => (p === 'roadmap' ? 'satellite' : 'roadmap'))}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1"
            >
              <Satellite className="h-3.5 w-3.5" /> {mapType === 'roadmap' ? 'Satellite' : 'Road'}
            </button>
            <button
              onClick={() => setMapType('terrain')}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1"
            >
              <Navigation className="h-3.5 w-3.5" /> Terrain
            </button>
            <button
              onClick={() => setShowTraffic((p) => !p)}
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 ${showTraffic ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
            >
              <Route className="h-3.5 w-3.5" /> Traffic
            </button>
            <button
              onClick={() => setShowTransit((p) => !p)}
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 ${showTransit ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
            >
              <Layers className="h-3.5 w-3.5" /> Transit
            </button>
            <button
              onClick={() => setShowBicycling((p) => !p)}
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 ${showBicycling ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
            >
              Bike
            </button>
            {!trackerMode && (
              <button
                onClick={() => setFollowTracker((p) => !p)}
                className={`rounded-md border px-2 py-1 font-semibold ${followTracker ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background'}`}
              >
                {followTracker ? 'Following Tracker' : 'Free Explore'}
              </button>
            )}
            {!trackerMode && trackerLocation && (
              <button
                onClick={() => {
                  setFollowTracker(true);
                  syncToTracker(trackerLocation);
                }}
                className="rounded-md border border-border bg-background px-2 py-1"
              >
                Re-sync
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
