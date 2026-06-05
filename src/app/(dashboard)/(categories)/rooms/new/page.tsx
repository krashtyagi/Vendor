"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Loader2, X, Plus } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

import { NewRoomProps, NewRoomSchema } from "./zod-schema";
import { amenityIconMap } from "@/components/icons";
import { addRooms } from "@/services/fetch.service";
import { Verify } from "@/app/(auth)/authMiddleware";
import { useCurrentUser } from "@/services/queryes";
import { PageSkeleton } from "../_components/details.skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export const amenityKeys = Object.keys(amenityIconMap) as (keyof typeof amenityIconMap)[];
const AddRoomForm = ({
  setEditMode,
}: {
  setEditMode?: React.Dispatch<
    React.SetStateAction<{ id: string; mode: boolean }>
  >;
}) => {
  console.log("new registrations");

  const [hotelId, setHotelId] = useState<string>("")
  const { data, isLoading } = useCurrentUser()



  const { uploadFile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const form = useForm<NewRoomProps>({
    resolver: zodResolver(NewRoomSchema),
    defaultValues: {
      hotelId: "",
      name: "family room",
      description: "",
      basePrice: 1000,
      discountPrice: 0,
      capacity: { adults: 1, children: 0 },
      beds: [{ type: "double", quantity: 1 }],
      amenities: [],
      roomSizeSqm: 25,
      viewType: "city",
      images: [],
      totalRooms: 1,
      isActive: true,
    },
    mode: "onChange",
  });
  useEffect(() => {
    const id = data?.data?.approvedData?.hotelId || data?.data?.serviceDetails?.id;
    if (id) {
      setHotelId(id);
      form.setValue("hotelId", id);
    }
  }, [data, form]);



  const { fields: bedFields, append: appendBed, remove: removeBed } =
    useFieldArray({ control: form.control, name: "beds" });

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);
    setUploading(true);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);

    const newUrls: { url: string, public_id: string, resource_type: string }[] = [];

    for (const file of files) {
      try {
        const result = await uploadFile(file);

        if (result?.url && result?.public_id && result?.resource_type) {
          newUrls.push({
            url: result.url,
            public_id: result.public_id,
            resource_type: result.resource_type,
          });
          toast.success(`Uploaded: ${file.name}`);
        } else {
          throw new Error("Incomplete upload data received");
        }
      } catch (err) {
        console.error("Upload failed:", file.name, err);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    const current = form.getValues("images") || [];
    form.setValue("images", [...current, ...newUrls], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setUploading(false);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });

    const current = form.getValues("images") || [];
    form.setValue(
      "images",
      current.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: NewRoomProps) => {
    setLoading(true);
    try {
      const res = await addRooms(data);


      toast.success("Room created successfully!");
      form.reset();
      setPreviews([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create room");
    } finally {
      setLoading(false);
    }
  };
  if (isLoading || !hotelId) {
    return (
      <PageSkeleton />
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Validation errors:", errors);
          const errorMsg = Object.entries(errors)
            .map(([key, err]) => {
              if (err && typeof err === 'object' && 'message' in err) {
                return `${key}: ${err.message}`;
              }
              return `${key}: Invalid value`;
            })
            .join(", ");
          toast.error(`Form validation failed: ${errorMsg}`);
        })}
        className="space-y-6 pb-12"
      >
        <Card className="rounded-2xl border-none shadow-lg">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl font-bold">Add New Room</CardTitle>
            {setEditMode && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditMode((v) => ({ ...v, mode: false }))}
              >
                Close
              </Button>
            )}
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            <Accordion type="multiple" defaultValue={["images", "basic", "capacity", "amenities"]}>
              {/* ── Images ─────────────────────────────────────── */}
              <AccordionItem value="images">
                <AccordionTrigger>Room Images</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-4">
                      {form.watch("images").map((url, idx) => (
                        <div key={url.url} className="relative group">
                          <div className="h-28 w-40 rounded-xl overflow-hidden border shadow-sm">
                            <Image
                              src={url.url}
                              alt={`Room image ${idx + 1}`}
                              width={160}
                              height={112}
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute -top-2 -right-2 bg-card text-white rounded-full z-4 p-1.5 shadow-md hover:bg-destructive/90"
                            disabled={uploading}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}

                      <label
                        className={`h-28 w-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-all ${uploading ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                      >
                        <Input
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={handleImageChange}
                          disabled={uploading}
                        />
                        {uploading ? (
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        ) : (
                          <>
                            <Plus size={28} className="text-muted-foreground" />
                            <span className="mt-2 text-sm font-medium text-muted-foreground">
                              Add Images
                            </span>
                          </>
                        )}
                      </label>
                    </div>

                    {form.formState.errors.images && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.images.message}
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="basic">
                <AccordionTrigger>Basic Information</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Name / Type *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Deluxe King Room" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="roomSizeSqm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Size (sqm) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="totalRooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Available Rooms *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="viewType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>View Type</FormLabel>

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select view type" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              <SelectItem value="city">City</SelectItem>
                              <SelectItem value="sea">Sea</SelectItem>
                              <SelectItem value="garden">Garden</SelectItem>
                              <SelectItem value="mountain">Mountain</SelectItem>
                              <SelectItem value="lake">Lake</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={form.control}
                      name="viewType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>View Type</FormLabel>
                          <FormControl>
                            <Input  {...field} placeholder="Ocean, Garden, City..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    <FormField
                      control={form.control}
                      name="basePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Price (₹) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Price (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe the room, furniture, view, special features..."
                            className="min-h-32"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
              {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ── Capacity & Beds ────────────────────────────── */}
              <AccordionItem value="capacity">
                <AccordionTrigger>Capacity & Beds</AccordionTrigger>
                <AccordionContent className="space-y-8 pt-4">
                  {/* Capacity */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Capacity Configurations</Label>

                    </div>

                    <FormField
                      control={form.control}
                      name={`capacity.adults`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Adults</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`capacity.children`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Children</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </div>

                  {/* Beds */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">
                        Bed Configurations
                      </Label>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          appendBed({ type: "double", quantity: 1 })
                        }
                      >
                        Add Bed Type
                      </Button>
                    </div>

                    {bedFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex gap-4 items-end border-b pb-4"
                      >
                        <FormField
                          control={form.control}
                          name={`beds.${index}.type`}
                          render={({ field }) => (
                            <FormItem className="flex-1 w-full">
                              <FormLabel>Bed Type</FormLabel>

                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select bed type" />
                                  </SelectTrigger>
                                </FormControl>

                                <SelectContent >
                                  <SelectItem value="single">Single</SelectItem>
                                  <SelectItem value="double">Double</SelectItem>
                                  <SelectItem value="king">King</SelectItem>
                                  <SelectItem value="queen">Queen</SelectItem>
                                  <SelectItem value="sofa">Sofa</SelectItem>
                                </SelectContent>
                              </Select>

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`beds.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem className="w-32">
                              <FormLabel>Quantity</FormLabel>

                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mb-2"
                          onClick={() => removeBed(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {/* <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Bed Configurations</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendBed({ type: "double", quantity: 1 })}
                      >
                        Add Bed Type
                      </Button>
                    </div>

                    {bedFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-end border-b pb-4">
                        <FormField
                          control={form.control}
                          name={`beds.${index}.type`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Bed Type</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="King, Queen, Twin..." />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`beds.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem className="w-32">
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mb-2"
                          onClick={() => removeBed(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div> */}
                </AccordionContent>
              </AccordionItem>

              {/* ── Amenities ──────────────────────────────────── */}
              <AccordionItem value="amenities">
                <AccordionTrigger>Amenities & Features</AccordionTrigger>
                <AccordionContent>
                  {/* You can keep or adapt your CheckboxGrid component here */}
                  {/* Example placeholder */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-4">
                    {amenityKeys.map((id) => (
                      <FormField
                        key={id}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(id)}
                                onCheckedChange={(checked) => {
                                  const arr = field.value || [];
                                  field.onChange(
                                    checked ? [...arr, id] : arr.filter((v) => v !== id)
                                  );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">{id.replace("_", " ")}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Separator className="my-8" />

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                size="lg"
                disabled={loading || uploading

                }
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Room"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  form.reset();
                  setPreviews([]);
                }}
                disabled={loading || uploading}
              >
                Reset Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )

}

// CheckboxGrid remains unchanged — keeping your version
type CheckboxGridProps = {
  name: "amenities" | "accessibilityFeatures" | "view";
  label: string;
  items: { id: string; label: string }[];
  control: any;
};

function CheckboxGrid({ name, label, items, control }: CheckboxGridProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <Label className="text-lg font-semibold">{label}</Label>
        <Input
          placeholder={`Filter ${label.toLowerCase()}...`}
          className="max-w-[260px] h-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-5 rounded-xl border bg-muted/5">
        {filtered.map((item) => {
          const Icon = amenityIconMap?.[item.id];
          return (
            <FormField
              key={item.id}
              control={control}
              name={name}
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 p-2.5 rounded-lg hover:bg-muted/40 transition-colors">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(item.id)}
                      onCheckedChange={(checked) => {
                        const current = field.value || [];
                        field.onChange(
                          checked
                            ? [...current, item.id]
                            : current.filter((v: string) => v !== item.id)
                        );
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                    {item.label}
                  </FormLabel>
                </FormItem>
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

export default AddRoomForm