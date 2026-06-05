"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  CheckCircle2,
  Users,
  BedDouble,
  Maximize2,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PageSkeleton } from "./details.skeleton";
import { useAllRooms, useRoomById } from "@/services/tanstack.query";
import { EditRoom } from "./edit-room-sheet";
import AddRoomForm from "../new/page";

export type BedType = {
  _id: string;
  type: "king" | "queen" | "single" | "double" | string;
  quantity: number;
};

export type RoomCapacity = {
  adults: number;
  children: number;
};

export type RoomStatus = "available" | "unavailable" | "maintenance" | string;

export interface Room {
  id: string;
  name: string;
  price: number;
  capacity: RoomCapacity;
  roomSizeSqm: number;
  beds: BedType[];
  totalRooms: number;
  availableRooms: number;
  status: RoomStatus;
  image: string;
}

const features = [
  "Private balcony (where applicable)",
  "Work desk with ergonomic chair",
  "Spacious layout with a modern design",
  "Large views offering city or garden views",
];

const facilities = [
  "High-speed Wi-Fi",
  "In-room safe",
  "Mini-fridge",
  "Flat-screen TV",
  "Air conditioning",
  "Coffee/tea maker",
];

const amenities = [
  "Complimentary bottled water",
  "Luxury toiletries",
  "Coffee and tea making facilities",
  "Hairdryer and slippers",
  "En-suite bathroom with shower and bathtub",
  "24-hour room service",
];

export function RoomListing() {
  const [sortBy, setSortBy] = React.useState("popular");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [roomselected, setRoomSelected] = React.useState<string | null>(null);
  const { data: user } = useCurrentUser();
  const hotelId = user?.data?.approvedData?.hotelId || "";
  const [editmode, setEditMode] = React.useState<{
    id: string;
    mode: boolean;
  }>({
    id: "",
    mode: false,
  });

  const router = useRouter();
  const { data, isLoading } = useAllRooms();
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  // Specify that the ref will point to an HTML element
  const targetSectionRef = React.useRef<HTMLDivElement>(null);

  // 2. Define the scroll handler
  const handleScroll = () => {
    targetSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const rosms = (data?.data as Room[]) || ([] as Room[]);

  const filteredAndSortedRooms = React.useMemo(() => {
    let rooms = [...rosms];
    if (search.trim() !== "") {
      rooms = rooms.filter((room) =>
        room.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      rooms = rooms.filter((room) =>
        room.name.toLowerCase().includes(typeFilter.toLowerCase()),
      );
    }
    if (sortBy === "price-low") {
      rooms.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-high") {
      rooms.sort((a, b) => b.price - a.price);
    }
    return rooms;
  }, [rosms, sortBy, typeFilter, search]);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 1000);
    setLoading(false);
  }, [roomselected]);
  if (!data) {
    return (
      <div>
        <PageSkeleton />
      </div>
    );
  }
  if (editmode.mode && editmode.id) {
    return (
      <EditRoomForm
        setEditMode={setEditMode}
        hotelId={"sdf"}
        roomId={editmode.id}
      />
    );
  }
  return (
    <div className="flex min-h-screen flex-col gap-6 ">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search room type, number, etc."
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
            <Label>Type:</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Type</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => router.push("/rooms/new")}>
            <Maximize2 className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_180px] xl:grid-cols-[1fr_540px]">
        {/* Room Cards - now smaller */}
        <div className="space-y-5">

          {filteredAndSortedRooms.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
              No rooms listed yet. Add a new room service.
            </div>
          ) : (
            filteredAndSortedRooms.map((room) => (
              <Card
                key={room.id}
                onClick={() => {
                  handleScroll();
                  setRoomSelected(room.id);
                  setEditMode({ id: room.id, mode: false });
                }}
                className="group overflow-hidden border-muted/60 bg-background hover:shadow-md transition-all duration-300 cursor-pointer md:px-3"
              >
                <div className="flex flex-col md:flex-row md:h-52">
                  {/* Image Section */}
                  <div className="relative w-full md:w-64 lg:w-72 shrink-0 overflow-hidden  rounded-2xl">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="h-48 w-full object-cover md:h-full transition-transform duration-500 group-hover:scale-105 "
                    />

                    {/* Status Badge with Glass effect */}
                    <Badge
                      variant={
                        room.status === "Available" ? "default" : "destructive"
                      }
                      className="absolute left-3 top-3 backdrop-blur-md bg-opacity-90 shadow-sm border-none"
                    >
                      <span className="relative flex h-2 w-2 mr-2">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${room.status === "Available" ? "bg-green-400" : "bg-red-400"}`}
                        ></span>
                        <span
                          className={`relative inline-flex rounded-full h-2 w-2 ${room.status === "Available" ? "bg-green-500" : "bg-red-500"}`}
                        ></span>
                      </span>
                      {room.status}
                    </Badge>
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <CardTitle className="text-xl font-bold tracking-tight  transition-colors">
                          {room.name}
                        </CardTitle>

                        {/* Icons/Amenities row */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Maximize2 className="h-4 w-4 text-primary/70" />
                            <span>{room.roomSizeSqm} m²</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BedDouble className="h-4 w-4 text-primary/70" />
                            <span>{room.beds[0].quantity} Bed</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-primary/70" />
                            <span>
                              {room.capacity?.adults + room.capacity?.children}{" "}
                              Max
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="text-right">
                        <p className="text-2xl font-black text-primary">
                          <Rupee />{room.price}
                        </p>
                        <p className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">
                          Per Night
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed italic">
                      Luxury suite with premium amenities and scenic views.
                    </p>

                    {/* Footer / Meta */}
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-dashed">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">
                          Availability
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {room.availableRooms} / {room.totalRooms}{" "}
                          <span className="font-normal text-muted-foreground">
                            Units left
                          </span>
                        </span>
                      </div>

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

            )))
          }
        </div>

        <section ref={targetSectionRef}>
          <div className="space-y-6 lg:sticky lg:top-6 h-fit w-full">
            {roomselected ? (
              !loading ? (
                <PageSkeleton />
              ) : (
                <RoomSideBarDetails
                  editmode={editmode}
                  setEditMode={setEditMode}
                />
              )
            ) : (
              <MessageModal
                title="Select Hotel"
                description="Please select a hotel"
                imgsrc="/select.png"
                classImgDiv="h-50 w-50"
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

import { Building2 } from "lucide-react";
import EditRoomForm from "./edit-room-form";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/services/queryes";
import Rupee from "@/components/rupee";
import { useRef } from "react";

export const MessageModal = ({
  title,
  description,
  className,
  imgsrc,
  classImgDiv,
}: {
  classImgDiv?: string;
  title: string;
  className?: string;
  description: string;
  imgsrc?: string;
}) => {
  return (
    <div className={cn("flex justify-center  ", className)}>
      <Card className="w-full  shadow-lg rounded-2xl border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <Building2 className="w-12 h-12 text-muted-foreground" />

          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>

          <p className="text-sm text-muted-foreground">{description}</p>
          {imgsrc && (
            <div className={cn("md:w-100 md:h-100 w-50 h-50", classImgDiv)}>
              <img
                src={imgsrc || "/nothing"}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export type DetailedRoom = {
  id: string;
  name: string;
  description: string;
  price: number;
  basePrice: number;
  discountPrice: number;

  capacity: {
    adults: number;
    children: number;
  };

  beds: Bed[];

  roomSizeSqm: number;
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;

  status: "available" | "unavailable" | "maintenance";

  amenities: string[];

  images: RoomImage[];
};

export type Bed = {
  type: "king" | "queen" | "twin" | string;
  quantity: number;
  _id: string;
};

export type RoomImage = {
  url: string;
  public_id: string;
  resource_type: "image" | "video" | string;
  _id: string;
};
const RoomSideBarDetails = ({
  editmode,
  setEditMode,
}: {
  editmode: { id: string; mode: boolean };
  setEditMode: React.Dispatch<
    React.SetStateAction<{ id: string; mode: boolean }>
  >;
}) => {
  const { data: user } = useCurrentUser();

  const { data, isLoading, error } = useRoomById(editmode.id);
  const [activeImage, setActiveImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data?.data?.images?.length) {
      setActiveImage(data.data.images[0]?.url);
    }
  }, [data]);

  if (isLoading) {
    return <Card className="p-6">Loading...</Card>;
  }

  if (error || !data) {
    return <Card className="p-6 text-red-500">Failed to load room</Card>;
  }

  const room: DetailedRoom = data.data;

  return (
    <Card className="overflow-hidden shadow-md">
      {/* Header */}
      <div className="flex justify-between px-6 pt-4">
        <h1 className="text-sm font-medium text-muted-foreground">
          Room Details
        </h1>
      </div>

      <CardHeader className="pb-4">
        <CardTitle className="md:text-3xl text-2xl">{room.name}</CardTitle>

        <CardDescription
          className={
            room.status === "available"
              ? "text-green-600 font-medium"
              : "text-red-500 font-medium"
          }
        >
          {room.status}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Images */}
        {room.images && room.images.length > 0 ? (
          <div className="space-y-3">
            <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
              <img
                src={activeImage || room.images[0]?.url}
                alt={room.name}
                className="h-full w-full object-cover"
              />
            </div>
            {room.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {room.images.map((img, idx) => {
                  const isActive = activeImage === img.url;
                  return (
                    <div
                      key={img._id || idx}
                      className={`h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 cursor-pointer transition-all ${isActive ? "border-primary scale-95" : "border-border hover:border-primary/40"
                        }`}
                      onClick={() => setActiveImage(img.url)}
                    >
                      <img
                        src={img.url}
                        alt="Room preview"
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
            <span className="text-xs">No images uploaded</span>
          </div>
        )}

        {/* Price & Capacity */}
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Price:</span> ₹{room.price}
          </p>
          <p>
            <span className="font-medium">Base Price:</span> ₹{room.basePrice}
          </p>
          <p>
            <span className="font-medium">Capacity:</span>{" "}
            {room.capacity?.adults} Adults, {room.capacity?.children} Children
          </p>
          <p>
            <span className="font-medium">Room Size:</span> {room.roomSizeSqm}{" "}
            sqm
          </p>
        </div>

        <Separator />

        {/* Beds */}
        <div>
          <h4 className="mb-2 font-medium">Beds</h4>
          <ul className="space-y-1 text-sm">
            {room.beds.map((bed) => (
              <li key={bed._id}>
                {bed.quantity} × {bed.type}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Amenities */}
        <div>
          <h4 className="mb-2 font-medium">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((item) => (
              <Badge key={item} variant="outline" className="text-xs">
                {item.replace("_", " ")}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" variant="secondary">
          View All Rooms
        </Button>
      </CardFooter>
    </Card>
  );
};
