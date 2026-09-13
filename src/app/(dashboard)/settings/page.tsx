"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Building,
  MapPin,
  History,
  UploadCloud,
  CheckCircle2,
  Loader2,
  X,
  Sparkles,
  Navigation,
  Compass,
  Calendar,
  Layers,
  Search,
  Plus,
  Tag,
  Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { axiosApi } from "@/lib/axios";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import { IconsBundle } from "@/components/icons";
import { AdvertisementBannerSection } from "./_components/advertisement-banner-section";

// Dynamically import Leaflet LocationMap with SSR disabled
const LocationMap = dynamic(() => import("./_components/location-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[340px] w-full rounded-2xl bg-muted/40 border border-border flex flex-col items-center justify-center text-muted-foreground text-xs gap-2">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span>Loading interactive map...</span>
    </div>
  ),
});

interface LocationHistoryItem {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  coordinates?: [number, number] | null;
  changedAt?: string | Date;
}

interface PropertySettingsData {
  serviceType: string;
  propertyId: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates?: [number, number] | null;
  images: Array<{ url: string; public_id?: string; resource_type?: string }>;
  amenities: string[];
  locationHistory: LocationHistoryItem[];
  advertisementImage?: { url: string; public_id?: string; resource_type?: string } | null;
}

// Individual section save button
function SectionSaveButton({
  saving,
  onClick,
  label = "Save",
}: {
  saving: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <Button
      size="sm"
      onClick={onClick}
      disabled={saving}
      className="rounded-xl text-xs h-8 min-w-[100px] gap-1.5"
    >
      {saving ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </Button>
  );
}

export default function PropertySettingsPage() {
  const { uploadFile } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Per-section saving states
  const [savingDescription, setSavingDescription] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [savingImages, setSavingImages] = useState(false);
  const [savingAmenities, setSavingAmenities] = useState(false);

  // Core Data
  const [name, setName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [coords, setCoords] = useState<[number, number]>([28.6139, 77.209]);
  const [images, setImages] = useState<
    Array<{ url: string; public_id?: string; resource_type?: string }>
  >([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [locationHistory, setLocationHistory] = useState<LocationHistoryItem[]>([]);
  const [adImage, setAdImage] = useState<{
    url: string;
    public_id?: string;
    resource_type?: string;
  } | null>(null);

  // Amenities UI
  const [amenitySearch, setAmenitySearch] = useState("");
  const [customAmenityInput, setCustomAmenityInput] = useState("");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axiosApi.get("/vendors/property-settings");
      if (res.data?.success && res.data?.data) {
        const d: PropertySettingsData = res.data.data;
        setName(d.name || "");
        setServiceType(d.serviceType || "");
        setDescription(d.description || "");
        setAddress(d.address || "");
        setCity(d.city || "");
        setState(d.state || "");
        setCountry(d.country || "India");

        if (d.coordinates && Array.isArray(d.coordinates) && d.coordinates.length >= 2) {
          const c0 = Number(d.coordinates[0]);
          const c1 = Number(d.coordinates[1]);
          // GeoJSON stores [lng, lat]; Leaflet needs [lat, lng]
          if (c0 > 40 && c0 < 100 && c1 > 5 && c1 < 40) {
            setCoords([c1, c0]);
          } else {
            setCoords([c0, c1]);
          }
        }
        setImages(d.images || []);
        setAmenities(d.amenities || []);
        setLocationHistory(d.locationHistory || []);
        setAdImage(d.advertisementImage || null);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to load property settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ── Section-level Save Handlers ─────────────────────────────────────

  const saveDescription = async () => {
    setSavingDescription(true);
    try {
      const res = await axiosApi.patch("/vendors/property-settings", { description });
      if (res.data?.success) {
        toast.success("Description updated!");
      } else {
        throw new Error(res.data?.message || "Failed");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to save description");
    } finally {
      setSavingDescription(false);
    }
  };

  const saveLocation = async () => {
    setSavingLocation(true);
    try {
      const res = await axiosApi.patch("/vendors/property-settings", {
        address,
        city,
        state,
        country,
        coordinates: [coords[1], coords[0]], // GeoJSON [lng, lat]
        lat: coords[0],
        lng: coords[1],
      });
      if (res.data?.success) {
        toast.success("Location & address updated!");
        // Refresh to get updated locationHistory
        await fetchSettings();
      } else {
        throw new Error(res.data?.message || "Failed");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to save location");
    } finally {
      setSavingLocation(false);
    }
  };

  const saveImages = async () => {
    setSavingImages(true);
    try {
      const res = await axiosApi.patch("/vendors/property-settings", { images });
      if (res.data?.success) {
        toast.success("Gallery photos saved!");
      } else {
        throw new Error(res.data?.message || "Failed");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to save gallery");
    } finally {
      setSavingImages(false);
    }
  };

  const saveAmenities = async () => {
    setSavingAmenities(true);
    try {
      const res = await axiosApi.patch("/vendors/property-settings", { amenities });
      if (res.data?.success) {
        toast.success("Amenities updated!");
      } else {
        throw new Error(res.data?.message || "Failed");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to save amenities");
    } finally {
      setSavingAmenities(false);
    }
  };

  // ── Map & Location Helpers ──────────────────────────────────────────

  const handleMapCoordChange = async (newCoords: [number, number]) => {
    setCoords(newCoords);
    const [lat, lng] = newCoords;

    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();
      if (data.city || data.locality) setCity(data.city || data.locality || "");
      if (data.principalSubdivision) setState(data.principalSubdivision);
      if (data.countryName) setCountry(data.countryName);
      toast.success("Location coordinates updated!");
    } catch {
      toast.success(`Coords set: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords([latitude, longitude]);

        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          if (data.city || data.locality) setCity(data.city || data.locality || "");
          if (data.principalSubdivision) setState(data.principalSubdivision);
          if (data.countryName) setCountry(data.countryName);

          const fullAddress = [data.locality, data.city, data.principalSubdivision, data.countryName]
            .filter(Boolean)
            .join(", ");
          if (fullAddress && !address) setAddress(fullAddress);

          toast.success("Current location detected and synced!");
        } catch {
          toast.success(`Coordinates found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        toast.error("Location access denied or unavailable.");
      },
      { enableHighAccuracy: true }
    );
  };

  // ── Image Handlers ──────────────────────────────────────────────────

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    setUploadingImages(true);

    const uploaded: Array<{ url: string; public_id?: string; resource_type?: string }> = [];

    for (const file of files) {
      try {
        const res = await uploadFile(file, "properties");
        if (res?.url) {
          uploaded.push({
            url: res.url,
            public_id: (res.public_id as string) || "",
            resource_type: (res.resource_type as string) || "image",
          });
          toast.success(`Uploaded: ${file.name}`);
        }
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploadingImages(false);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Amenity Helpers ─────────────────────────────────────────────────

  const toggleAmenity = (key: string) => {
    setAmenities((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );
  };

  const handleAddCustomAmenity = () => {
    const trimmed = customAmenityInput.trim().toLowerCase().replace(/\s+/g, "_");
    if (!trimmed) return;
    if (!amenities.includes(trimmed)) {
      setAmenities((prev) => [...prev, trimmed]);
    }
    setCustomAmenityInput("");
  };

  const filteredIconKeys = useMemo(() => {
    const allKeys = Object.keys(IconsBundle);
    if (!amenitySearch.trim()) return allKeys.slice(0, 48);
    return allKeys
      .filter((k) => k.toLowerCase().includes(amenitySearch.toLowerCase()))
      .slice(0, 48);
  }, [amenitySearch]);

  // ── Loading State ───────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading property settings...</p>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <div className="w-full space-y-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Building className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                {name || "Property Settings"}
              </h1>
              <Badge variant="outline" className="capitalize text-[10px] font-semibold px-2.5 py-0.5">
                {serviceType}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage promotional banner, description, photos, amenities, and interactive map location.
              Each section saves independently.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsHistoryOpen(true)}
          className="rounded-xl text-xs gap-1.5 h-9"
        >
          <History className="h-4 w-4 text-primary" />
          <span>Location History</span>
          {locationHistory.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
              {locationHistory.length}
            </span>
          )}
        </Button>
      </div>

      {/* ── 1. Promotional Advertisement Banner ────────────────────────── */}
      <AdvertisementBannerSection
        propertyName={name}
        serviceType={serviceType}
        city={city}
        initialAdImage={adImage}
        fallbackImageUrl={images[0]?.url || null}
        onUpdated={(newImg) => setAdImage(newImg as any)}
      />

      {/* ── 2. Description ─────────────────────────────────────────────── */}
      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                Property Overview
              </CardTitle>
              <CardDescription className="text-xs">
                Public description on search results and property detail pages.
              </CardDescription>
            </div>
            <SectionSaveButton saving={savingDescription} onClick={saveDescription} label="Save Description" />
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detail the ambience, history, unique amenities, and experience of your property..."
            className="leading-relaxed"
          />
        </CardContent>
      </Card>

      {/* ── 3. Interactive Leaflet Map & Location ──────────────────────── */}
      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Property Location & GPS Coordinates
              </CardTitle>
              <CardDescription className="text-xs">
                Edit manually, point on the map, or sync using your device&apos;s current location.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="h-8 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
              >
                {isLocating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Navigation className="h-3.5 w-3.5" />
                )}
                <span>Use Current Location</span>
              </Button>
              <SectionSaveButton saving={savingLocation} onClick={saveLocation} label="Save Location" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Leaflet Map */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium flex items-center gap-1">
                <Compass className="h-3.5 w-3.5 text-primary" />
                Interactive Map Pin (Click or drag marker to reposition)
              </span>
              <span className="font-mono text-[11px] bg-muted px-2 py-0.5 rounded-md">
                Lat: {coords[0].toFixed(5)}, Lng: {coords[1].toFixed(5)}
              </span>
            </div>
            <LocationMap center={coords} onChange={handleMapCoordChange} />
          </div>

          {/* Address Fields */}
          <div className="space-y-1.5 pt-2">
            <Label className="text-xs font-semibold">Street Address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 104 Boulevard Road, Near Gate 2, Dal Lake"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">City</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Srinagar" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">State / Province</Label>
              <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="e.g. Jammu & Kashmir" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Country</Label>
              <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. India" />
            </div>
          </div>

          {/* Manual Coord Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md pt-1">
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground font-semibold">Latitude</Label>
              <Input
                type="number"
                step="any"
                value={coords[0]}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) setCoords([val, coords[1]]);
                }}
                placeholder="e.g. 34.0837"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground font-semibold">Longitude</Label>
              <Input
                type="number"
                step="any"
                value={coords[1]}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) setCoords([coords[0], val]);
                }}
                placeholder="e.g. 74.7973"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 4. Property Photos Gallery ─────────────────────────────────── */}
      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Property Gallery Photos
              </CardTitle>
              <CardDescription className="text-xs">
                Photos of the entrance, reception, scenic views, and facilities.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                  className="hidden"
                />
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-semibold transition-colors cursor-pointer">
                  {uploadingImages ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <UploadCloud className="h-3.5 w-3.5" />
                  )}
                  Upload
                </span>
              </label>
              <SectionSaveButton saving={savingImages} onClick={saveImages} label="Save Photos" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground text-xs">
              No gallery images uploaded yet. Click &quot;Upload&quot; to showcase your property.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {images.map((img, i) => (
                <div key={i} className="group relative aspect-video rounded-xl overflow-hidden border bg-muted">
                  <img src={img.url} alt={`Property photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 5. Amenities with icons.tsx ─────────────────────────────────── */}
      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Property Amenities & Features
              </CardTitle>
              <CardDescription className="text-xs">
                Select from verified amenities with icons or add custom tags.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative max-w-[200px] w-full">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search amenities..."
                  value={amenitySearch}
                  onChange={(e) => setAmenitySearch(e.target.value)}
                  className="pl-8 text-xs h-8"
                />
              </div>
              <SectionSaveButton saving={savingAmenities} onClick={saveAmenities} label="Save Amenities" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Amenities */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Amenities ({amenities.length})
              </Label>
              {amenities.length > 0 && (
                <button
                  type="button"
                  onClick={() => setAmenities([])}
                  className="text-[11px] text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {amenities.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                No amenities selected yet. Click below to add amenities.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 p-3 rounded-xl border bg-muted/20">
                {amenities.map((item) => {
                  const IconComponent = (IconsBundle as any)[item] || Tag;
                  return (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-medium capitalize shadow-sm"
                    >
                      <IconComponent className="h-3.5 w-3.5 shrink-0" />
                      <span>{item.replace(/_/g, " ")}</span>
                      <button
                        type="button"
                        onClick={() => toggleAmenity(item)}
                        className="ml-1 hover:text-destructive transition-colors cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Catalog from icons.tsx */}
          <div className="space-y-2 pt-2">
            <Label className="text-xs font-semibold text-muted-foreground">
              Available Catalog (Click to Toggle)
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-60 overflow-y-auto pr-1">
              {filteredIconKeys.map((key) => {
                const IconComponent = (IconsBundle as any)[key] || Tag;
                const isSelected = amenities.includes(key);
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => toggleAmenity(key)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm font-semibold"
                        : "bg-card hover:bg-muted/50 border-border text-foreground"
                    }`}
                  >
                    <IconComponent className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate capitalize">{key.replace(/_/g, " ")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amenity Adder */}
          <div className="flex items-center gap-2 max-w-md pt-2">
            <Input
              value={customAmenityInput}
              onChange={(e) => setCustomAmenityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomAmenity();
                }
              }}
              placeholder="Add custom amenity..."
              className="text-xs h-8"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCustomAmenity}
              className="text-xs h-8 gap-1"
            >
              <Plus className="h-3 w-3" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Location History Dialog ─────────────────────────────────────── */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-2xl bg-card border rounded-3xl p-6 shadow-2xl">
          <DialogHeader className="border-b pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                <History className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">
                  Property Location History
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Audit log of previous registered addresses and locations.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-3 max-h-96 overflow-y-auto pr-1 space-y-3">
            {/* Current Active */}
            <div className="p-4 rounded-2xl border bg-primary/5 border-primary/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary text-primary-foreground text-[10px] font-bold">
                  Current Active Location
                </Badge>
                <span className="text-[11px] text-muted-foreground">Active Now</span>
              </div>
              <p className="text-sm font-semibold text-foreground pt-1">{address || "No street address"}</p>
              <p className="text-xs text-muted-foreground">
                {[city, state, country].filter(Boolean).join(", ")}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono">
                GPS: {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
              </p>
            </div>

            {/* History */}
            {locationHistory.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-xs border border-dashed rounded-2xl">
                No previous location changes recorded yet.
              </div>
            ) : (
              <div className="space-y-2.5 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Previous Records ({locationHistory.length})
                </p>
                {locationHistory.map((item, index) => {
                  const dateStr = item.changedAt
                    ? new Date(item.changedAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "Archived";

                  return (
                    <div
                      key={index}
                      className="p-3.5 rounded-2xl border bg-muted/30 hover:bg-muted/50 transition-colors space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">
                          {item.address || "Address not specified"}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {dateStr}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        {[item.city, item.state, item.country].filter(Boolean).join(", ")}
                      </p>
                      {item.coordinates && (
                        <p className="text-[10px] text-muted-foreground font-mono">
                          Coords: {JSON.stringify(item.coordinates)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-3 border-t">
            <Button variant="outline" size="sm" onClick={() => setIsHistoryOpen(false)} className="text-xs">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
