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
  ChevronRight,
  Mountain,
  MapPin,
  Calendar,
  Loader2,
  Wind,
  Zap,
  Compass,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PageSkeleton } from "../../rooms/_components/details.skeleton";
import {
  useGetAdventuresServices,
  useGetAdventureServiceDetailsById,
  useDeleteAdventureService,
} from "@/services/tanstack.query";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Rupee from "@/components/rupee";

export interface AdventureListItem {
  _id: string;
  name: string;
  category: string;
  city: string;
  image?: { url: string; public_id: string; resource_type: string };
  priceStart: number | null;
  createdAt: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  rafting: <Compass className="h-16 w-16" />,
  paragliding: <Wind className="h-16 w-16" />,
  bungee: <Zap className="h-16 w-16" />,
  trekking: <Mountain className="h-16 w-16" />,
};

const categoryLabels: Record<string, string> = {
  rafting: "River Rafting",
  paragliding: "Paragliding",
  bungee: "Bungee Jumping",
  trekking: "Trekking",
};

export function AdventuresListing() {
  const [sortBy, setSortBy] = React.useState("popular");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [adventureSelected, setAdventureSelected] = React.useState<string | null>(null);
  const router = useRouter();
  const { data: adventuresResponse, isLoading } = useGetAdventuresServices();
  const [search, setSearch] = React.useState("");
  const targetSectionRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    targetSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const adventures = (adventuresResponse?.data as AdventureListItem[]) || [];

  const filteredAdventures = React.useMemo(() => {
    let items = [...adventures];
    if (search.trim() !== "") {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.city?.toLowerCase().includes(search.toLowerCase()) ||
          item.category?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (categoryFilter !== "all") {
      items = items.filter((item) => item.category === categoryFilter);
    }
    if (sortBy === "price-low") {
      items.sort((a, b) => (a.priceStart || 0) - (b.priceStart || 0));
    }
    if (sortBy === "price-high") {
      items.sort((a, b) => (b.priceStart || 0) - (a.priceStart || 0));
    }
    return items;
  }, [adventures, sortBy, categoryFilter, search]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex min-h-screen flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search adventure name, city..."
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

          <div className="flex items-center gap-2">
            <Label>Category:</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="rafting">Rafting</SelectItem>
                <SelectItem value="paragliding">Paragliding</SelectItem>
                <SelectItem value="bungee">Bungee</SelectItem>
                <SelectItem value="trekking">Trekking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => router.push("/adventures/new")}>
            <Mountain className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_540px]">
        <div className="space-y-5">
          {filteredAdventures.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
              No adventures listed yet. Create a new service.
            </div>
          ) : (
            filteredAdventures.map((item) => (
              <Card
                key={item._id}
                onClick={() => {
                  handleScroll();
                  setAdventureSelected(item._id);
                }}
                className="group overflow-hidden border-muted/60 bg-background hover:shadow-md transition-all duration-300 cursor-pointer p-4"
              >
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Icon / Image Section */}
                  <div className="relative w-full md:w-48 shrink-0 overflow-hidden rounded-2xl bg-muted/40 flex items-center justify-center p-6 border">
                    {item.image?.url ? (
                      <img
                        src={item.image.url}
                        alt={item.name}
                        className="h-full w-full object-cover absolute inset-0 rounded-2xl"
                      />
                    ) : (
                      <div className="text-primary/70 transition-transform duration-500 group-hover:scale-110">
                        {categoryIcons[item.category] || <Mountain className="h-16 w-16" />}
                      </div>
                    )}
                    <Badge className="absolute left-3 top-3 backdrop-blur-md bg-opacity-90 shadow-sm border-none capitalize">
                      {categoryLabels[item.category] || item.category}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <CardTitle className="text-xl font-bold tracking-tight">
                            {item.name}
                          </CardTitle>
                          {item.city && (
                            <p className="text-xs font-semibold text-muted-foreground mt-1 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {item.city}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {item.priceStart ? (
                            <>
                              <p className="text-xs text-muted-foreground">Starting from</p>
                              <p className="text-2xl font-black text-primary">
                                <Rupee />
                                {item.priceStart}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">No services</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                        <div className="capitalize border bg-card px-2.5 py-0.5 rounded-full font-medium">
                          Category: {categoryLabels[item.category] || item.category}
                        </div>
                        <div className="flex items-center gap-1.5 bg-muted/60 px-3 py-1 rounded-full text-foreground font-medium">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {new Date(item.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
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
            ))
          )}
        </div>

        {/* Right Sidebar */}
        <section ref={targetSectionRef}>
          <div className="space-y-6 lg:sticky lg:top-6 h-fit w-full">
            {adventureSelected ? (
              <AdventureSideBarDetails adventureId={adventureSelected} />
            ) : (
              <div className="flex justify-center">
                <Card className="w-full shadow-lg rounded-2xl border-dashed border-2">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <Mountain className="w-12 h-12 text-muted-foreground animate-pulse" />
                    <h2 className="text-2xl font-semibold tracking-tight">Select Adventure</h2>
                    <p className="text-sm text-muted-foreground">
                      Click an adventure to view services & details
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

// ── Sidebar Detail Panel ──
const AdventureSideBarDetails = ({ adventureId }: { adventureId: string }) => {
  const { data: detailsResponse, isLoading, error } =
    useGetAdventureServiceDetailsById(adventureId);
  const [activeImage, setActiveImage] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; title: string } | null>(null);
  const deleteMutation = useDeleteAdventureService();

  const getImageUrl = (img: any) => (typeof img === "string" ? img : img?.url || "");

  React.useEffect(() => {
    const adventure = detailsResponse?.data?.adventure;
    if (adventure?.images?.length) {
      setActiveImage(getImageUrl(adventure.images[0]));
    }
  }, [detailsResponse]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 border rounded-2xl bg-card shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !detailsResponse?.data) {
    return <Card className="p-6 text-red-500">Failed to load adventure details</Card>;
  }

  const d = detailsResponse.data;
  const adventure = d.adventure;
  const services = d.services || [];

  const hasImages = adventure?.images && adventure.images.length > 0;

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: (res) => {
        toast.success(res?.message || "Service deleted successfully");
        setDeleteTarget(null);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to delete service");
      }
    });
  };

  return (
    <Card className="overflow-hidden shadow-md">
      <div className="flex justify-between items-center px-6 pt-4">
        <h1 className="text-sm font-medium text-muted-foreground">Adventure Details</h1>
      </div>

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        serviceName={deleteTarget?.title || ""}
        isLoading={deleteMutation.isPending}
      />

      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold">{adventure?.name}</CardTitle>
        <CardDescription className="flex items-center gap-1.5 mt-1 font-medium">
          <MapPin className="h-3.5 w-3.5" />
          <span>{adventure?.city}</span>
          <span className="mx-1">·</span>
          <span className="capitalize">{categoryLabels[adventure?.category] || adventure?.category}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Images */}
        {hasImages ? (
          <div className="space-y-3">
            <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
              <img src={activeImage || getImageUrl(adventure.images[0])} alt={adventure.name} className="h-full w-full object-cover" />
            </div>
            {adventure.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {adventure.images.map((img: any, idx: number) => {
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
            <Mountain className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <span className="text-xs">No images uploaded</span>
          </div>
        )}

        {/* Description */}
        {adventure?.description && (
          <div className="space-y-2 border-t border-dashed pt-4">
            <h4 className="font-semibold text-sm">Description</h4>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              {adventure.description}
            </p>
          </div>
        )}

        {/* Features */}
        {adventure?.features && adventure.features.length > 0 && (
          <div className="space-y-2 border-t border-dashed pt-4">
            <h4 className="font-semibold text-sm">Features</h4>
            <div className="flex flex-wrap gap-2">
              {adventure.features.map((f: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-[10px]">
                  {f}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Services List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Services ({services.length})</h4>
          {services.length === 0 ? (
            <p className="text-xs text-muted-foreground">No services added yet</p>
          ) : (
            services.map((s: any) => {
              const effectivePrice = s.discountPrice > 0 ? s.discountPrice : s.basePrice;
              const hasDiscount = s.discountPrice > 0 && s.discountPrice < s.basePrice;
              return (
                <div key={s._id} className="border rounded-xl p-3 space-y-2 bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 mr-2">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{s.title}</p>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                          onClick={() => setDeleteTarget({ id: s._id, title: s.title })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge variant="outline" className="text-[10px] capitalize mt-1">
                        {s.type}
                      </Badge>
                    </div>
                    <div className="text-right">
                      {hasDiscount && (
                        <span className="text-xs text-muted-foreground line-through block">
                          ₹{s.basePrice}
                        </span>
                      )}
                      <span className="text-lg font-black text-primary">₹{effectivePrice}</span>
                    </div>
                  </div>
                  {/* Meta info */}
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    {s.meta?.distance && (
                      <span className="bg-card border px-2 py-0.5 rounded-full">
                        📏 {s.meta.distance}
                      </span>
                    )}
                    {s.meta?.duration && (
                      <span className="bg-card border px-2 py-0.5 rounded-full">
                        ⏱ {s.meta.duration}
                      </span>
                    )}
                    {s.meta?.days && (
                      <span className="bg-card border px-2 py-0.5 rounded-full">
                        📅 {s.meta.days}D/{s.meta.nights}N
                      </span>
                    )}
                  </div>
                  {/* Features */}
                  {s.features && s.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {s.features.slice(0, 4).map((f: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                        >
                          {f}
                        </span>
                      ))}
                      {s.features.length > 4 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{s.features.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
