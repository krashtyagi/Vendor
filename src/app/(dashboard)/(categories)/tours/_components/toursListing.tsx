"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronRight,
  MapPinned,
  Clock,
  CalendarDays,
  Loader2,
  Route,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PageSkeleton } from "../../rooms/_components/details.skeleton";
import {
  useGetToursServices,
  useGetTourServiceDetailsById,
  useDeleteTourService,
} from "@/services/tanstack.query";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Rupee from "@/components/rupee";
import Image from "next/image";

export interface TourListItem {
  id: string;
  title: string;
  company: string;
  destinations: string[];
  duration: string;
  pricing: {
    basePrice: number;
    discountPrice: number;
  };
  isActive: boolean;
  images: { url: string; public_id: string; resource_type: string }[];
}

export function ToursListing() {
  const [sortBy, setSortBy] = React.useState("popular");
  const [search, setSearch] = React.useState("");
  const [tourSelected, setTourSelected] = React.useState<string | null>(null);
  const router = useRouter();
  const { data: toursResponse, isLoading } = useGetToursServices();
  const targetSectionRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    targetSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const tours = (toursResponse?.data as TourListItem[]) || [];

  const filteredTours = React.useMemo(() => {
    let items = [...tours];
    if (search.trim() !== "") {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.company?.toLowerCase().includes(search.toLowerCase()) ||
          item.destinations?.some((d) => d.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (sortBy === "price-low") {
      items.sort((a, b) => {
        const pA = a.pricing.discountPrice || a.pricing.basePrice;
        const pB = b.pricing.discountPrice || b.pricing.basePrice;
        return pA - pB;
      });
    }
    if (sortBy === "price-high") {
      items.sort((a, b) => {
        const pA = a.pricing.discountPrice || a.pricing.basePrice;
        const pB = b.pricing.discountPrice || b.pricing.basePrice;
        return pB - pA;
      });
    }
    return items;
  }, [tours, sortBy, search]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex min-h-screen flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tour, destination, company..."
          className="max-w-sm"
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Label>Sort by:</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => router.push("/tours/new")}>
            <MapPinned className="mr-2 h-4 w-4" />
            Add Tour
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_540px]">
        <div className="space-y-5">
          {filteredTours.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
              No tours listed yet. Add a new tour service.
            </div>
          ) : (
            filteredTours.map((item) => {
              const currentPrice = item.pricing.discountPrice || item.pricing.basePrice;
              const hasDiscount =
                !!item.pricing.discountPrice && item.pricing.discountPrice < item.pricing.basePrice;

              return (
                <Card
                  key={item.id}
                  onClick={() => {
                    handleScroll();
                    setTourSelected(item.id);
                  }}
                  className="group overflow-hidden border-muted/60 bg-background hover:shadow-md transition-all duration-300 cursor-pointer p-4"
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Icon */}
                    <div className="relative w-full md:w-48 shrink-0 overflow-hidden rounded-2xl bg-muted/40 flex items-center justify-center  border">
                      {/* <div className="text-primary/70 transition-transform duration-500 group-hover:scale-110"> */}
                      <img
                        src={item?.images?.[0]?.url || "/noimage.jpg"}
                        alt={item.title}

                        className="object-cover rounded-md"
                      />
                      {/* </div> */}
                      <Badge
                        variant={item.isActive ? "default" : "destructive"}
                        className="absolute left-3 top-3 backdrop-blur-md bg-opacity-90 shadow-sm border-none"
                      >
                        <span className="relative flex h-2 w-2 mr-2">
                          <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${item.isActive ? "bg-green-400" : "bg-red-400"}`}
                          ></span>
                          <span
                            className={`relative inline-flex rounded-full h-2 w-2 ${item.isActive ? "bg-green-500" : "bg-red-500"}`}
                          ></span>
                        </span>
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <CardTitle className="text-xl font-bold tracking-tight">
                              {item.title}
                            </CardTitle>
                            <p className="text-xs font-semibold text-muted-foreground mt-1">
                              Provided by: {item.company}
                            </p>
                          </div>
                          <div className="text-right">
                            {hasDiscount && (
                              <p className="text-xs text-muted-foreground line-through">
                                ₹{item.pricing.basePrice}
                              </p>
                            )}
                            <p className="text-2xl font-black text-primary">
                              <Rupee />
                              {currentPrice}
                            </p>
                            <p className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">
                              Per Person
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                          <div className="flex items-center gap-1.5 bg-muted/60 px-3 py-1 rounded-full text-foreground font-medium">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            <span>{item.duration}</span>
                          </div>
                          {item.destinations?.slice(0, 3).map((dest, idx) => (
                            <div
                              key={idx}
                              className="capitalize border bg-card px-2.5 py-0.5 rounded-full font-medium"
                            >
                              {dest}
                            </div>
                          ))}
                          {item.destinations?.length > 3 && (
                            <span className="text-muted-foreground">
                              +{item.destinations.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 flex items-center justify-end border-t border-dashed">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                        >
                          Details
                          <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Sidebar */}
        <section ref={targetSectionRef}>
          <div className="space-y-6 lg:sticky lg:top-6 h-fit w-full">
            {tourSelected ? (
              <TourSideBarDetails tourId={tourSelected} setTourSelected={setTourSelected} />
            ) : (
              <div className="flex justify-center">
                <Card className="w-full shadow-lg rounded-2xl border-dashed border-2">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <MapPinned className="w-12 h-12 text-muted-foreground animate-pulse" />
                    <h2 className="text-2xl font-semibold tracking-tight">Select Tour</h2>
                    <p className="text-sm text-muted-foreground">
                      Click a tour to view details
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// ── Tour Sidebar ──
const TourSideBarDetails = ({
  tourId,
  setTourSelected,
}: {
  tourId: string;
  setTourSelected: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { data: tourResponse, isLoading, error } = useGetTourServiceDetailsById(tourId);
  const [activeImage, setActiveImage] = React.useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const deleteMutation = useDeleteTourService();

  const getImageUrl = (img: any) => (typeof img === "string" ? img : img?.url || "");

  React.useEffect(() => {
    if (tourResponse?.data?.images?.length) {
      setActiveImage(getImageUrl(tourResponse.data.images[0]));
    }
  }, [tourResponse]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 border rounded-2xl bg-card shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !tourResponse?.data) {
    return <Card className="p-6 text-red-500">Failed to load tour details</Card>;
  }

  const t = tourResponse.data;
  const hasImages = t.images && t.images.length > 0;

  const hasDiscount =
    !!t.pricing?.discountPrice && t.pricing.discountPrice < t.pricing.basePrice;
  const hasItinerary = t.itinerary && t.itinerary.length > 0;

  const handleDelete = () => {
    deleteMutation.mutate(tourId, {
      onSuccess: (res) => {
        toast.success(res?.message || "Tour service deleted successfully");
        setTourSelected(null);
        setIsDeleteOpen(false);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to delete tour service");
      }
    });
  };

  return (
    <Card className="overflow-hidden shadow-md">
      <div className="flex justify-between items-center px-6 pt-4">
        <h1 className="text-sm font-medium text-muted-foreground">Tour Details</h1>
        <div className="flex gap-2">
          {/* Note: Tour edit/updating is not currently handled via a custom form sheet, but we show a placeholder delete button as requested */}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setIsDeleteOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        serviceName={t.title}
        isLoading={deleteMutation.isPending}
      />

      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
        <CardDescription className="flex items-center gap-1.5 mt-1 font-medium">
          <span className="text-xs text-muted-foreground">Company:</span>
          <span>{t.company?.name || "Independent"}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Images */}
        {hasImages ? (
          <div className="space-y-3">
            <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
              <img
                src={activeImage || getImageUrl(t.images[0])}
                alt={t.title}
                className="h-full w-full object-cover"
              />
            </div>
            {t.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {t.images.map((img: any, idx: number) => {
                  const imgUrl = getImageUrl(img);
                  const isActive = activeImage === imgUrl;
                  return (
                    <div
                      key={idx}
                      className={`h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 cursor-pointer transition-all ${
                        isActive ? "border-primary scale-95" : "border-border hover:border-primary/40"
                      }`}
                      onClick={() => setActiveImage(imgUrl)}
                    >
                      <img
                        src={imgUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video rounded-lg border bg-muted/30 flex flex-col items-center justify-center text-muted-foreground p-6">
            <MapPinned className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <span className="text-xs">No images uploaded</span>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-xl">
          <div>
            <span className="text-xs text-muted-foreground block">Duration</span>
            <span className="font-semibold text-foreground">
              {t.duration?.days}D / {t.duration?.nights}N
            </span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Max People</span>
            <span className="font-semibold text-foreground">{t.maxPeople || "N/A"}</span>
          </div>
        </div>

        {/* Destinations */}
        {t.destinations && t.destinations.length > 0 && (
          <div className="space-y-2 border-t border-dashed pt-4">
            <h4 className="font-semibold text-sm">Destinations</h4>
            <div className="flex flex-wrap gap-2">
              {t.destinations.map((dest: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-[10px]">
                  {dest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Meta */}
        {t.meta && (
          <div className="space-y-3 border-t border-dashed pt-4">
            <h4 className="font-semibold text-sm">Additional Details</h4>
            <div className="space-y-2 text-xs">
              {t.meta.hotelType && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stay Type:</span>
                  <span className="font-medium text-foreground">{t.meta.hotelType}</span>
                </div>
              )}
              {t.meta.transport && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transport:</span>
                  <span className="font-medium text-foreground">{t.meta.transport}</span>
                </div>
              )}
              {t.meta.mealPlan && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Meal Plan:</span>
                  <span className="font-medium text-foreground">{t.meta.mealPlan}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Pricing */}
        <div className="flex items-center justify-between border-t border-dashed pt-4">
          <div>
            <span className="text-xs text-muted-foreground">Rate Plan</span>
            <span className="block text-xs font-semibold text-green-600">Per Person</span>
          </div>
          <div className="text-right">
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through block">
                ₹{t.pricing.basePrice}
              </span>
            )}
            <span className="text-2xl font-black text-primary">
              ₹{t.pricing.discountPrice || t.pricing.basePrice}
            </span>
          </div>
        </div>

        {/* Features */}
        {t.features && t.features.length > 0 && (
          <div className="space-y-2 border-t border-dashed pt-4">
            <h4 className="font-semibold text-sm">Features</h4>
            <div className="flex flex-wrap gap-2">
              {t.features.map((feature: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-[10px]">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {t.description && (
          <div className="space-y-2 border-t border-dashed pt-4">
            <h4 className="font-semibold text-sm">Description</h4>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              {t.description}
            </p>
          </div>
        )}

        {/* Itinerary Button + Dialog */}
        {hasItinerary && (
          <div className="border-t border-dashed pt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <Route className="h-4 w-4" />
                  View Itinerary ({t.itinerary.length} Days)
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">{t.title} - Itinerary</DialogTitle>
                </DialogHeader>
                <div className="space-y-0 mt-4">
                  {t.itinerary.map((day: any, idx: number) => (
                    <div key={idx} className="relative pl-8 pb-6 last:pb-0">
                      {/* Timeline line */}
                      {idx < t.itinerary.length - 1 && (
                        <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-border" />
                      )}
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-[10px] font-bold text-primary-foreground">
                          {day.day}
                        </span>
                      </div>
                      <div className="border rounded-xl p-4 bg-muted/20 space-y-2">
                        <h4 className="font-semibold text-sm">{day.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {day.description}
                        </p>
                        {day.highlights && day.highlights.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {day.highlights.map((h: string, hIdx: number) => (
                              <span
                                key={hIdx}
                                className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
