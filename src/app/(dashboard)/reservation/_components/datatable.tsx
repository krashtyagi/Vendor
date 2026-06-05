// datatable.tsx
"use client";


import { useState } from "react";
import { Settings2, Check } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TogglePatchStatus } from "./reservations.service";
import { Skeleton } from "antd";
import { ReservationsRowSkeleton } from "@/components/loaders/tableSkeletons";

export type StayOption = "checkin" | "checkout" | "staying";

import * as React from "react";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  type ColumnDef,
} from "@tanstack/react-table";
import { ArrowUpDown, Eye, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner"; // your spinner component
import { useUpdateReservationStatus } from "./hook/updateStstus";
import { useResevatiosnData } from "@/services/tanstack.query";
import { useRouter } from "next/navigation";
import TablesLoaders from "@/components/loaders/TablesLoaders";
import DataNotFoundTableComponent from "@/components/dataNotFoundTableComponent";

// import { useReservationsData } from "@/services/tanstack.query";
// import { useUpdateReservationStatus } from "@/services/reservationMutations";

export type Status = "confirmed" | "pending" | "Confirmed" | "Pending" | null;
export type Reservation = {
  bookingId: string
  bookingReference: string;
  guestName: string;
  roomLabel: string;
  roomNumber: string;
  specialRequest: string;
  nights: number;
  checkIn: string;
  checkOut: string;
  status: Status;
};

// Memoized cells to reduce unnecessary renders
const StatusBadge = React.memo(({ status }: { status: Status }) => {
  const isConfirmed = (status || "").toLowerCase() === "confirmed";

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-md text-xs font-medium ${isConfirmed
        ? "bg-[#E6F6F0] text-[#1DB47D]"
        : "bg-[#FEECEC] text-[#EB5757]"
        }`}
    >
      {(status || "—").charAt(0).toUpperCase() + (status || "").slice(1)}
    </span>
  );
});

const ActionCell = React.memo(({ row }: { row: any }) => {
  const status = row.original.status;
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateReservationStatus();
  const router = useRouter()
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => router.push(`/reservation/user/${row.original.bookingId}`)}>
        <Eye className="h-4 w-4" />
      </Button>

      <OptionSelectionDialog id={row.original.bookingId} trigger={<Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
        <Pencil className="h-4 w-4" />
      </Button>} />

      <Button
        variant="outline"
        size="sm"
        disabled={isUpdating}
        // onClick={() =>
        //   updateStatus({
        //     id: row.original.bookingReference,
        //     newStatus: status === "Pending" ? "Confirmed" : "Pending",
        //   })
        // }
        className={cn(
          "h-8 min-w-[90px] px-4 text-xs font-medium transition-colors",
          status !== "Pending"
            ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
            : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800",
          isUpdating && "opacity-70 cursor-wait"
        )}
      >
        {isUpdating ? <Spinner /> : status}
      </Button>
    </div>
  );
});

export const columns: ColumnDef<Reservation>[] = [
  {
    accessorKey: "guestName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Guest <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const router = useRouter()
      return (
        <div className="flex flex-col py-1">
          <span className="font-medium text-slate-900 dark:text-slate-200">
            <a className="cursor-pointer text-text" onClick={() => router.push(`/reservation/user/${row.original.bookingId}`)}>
              {row.original.guestName}
            </a>
          </span>
          <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
            {row.original.bookingReference}
          </span>
        </div>
      )
    },
  },
  {
    header: "Room",
    cell: ({ row }) => (
      <span className="text-slate-600">
        {row.original.roomLabel} {row.original.roomNumber || "23"}
      </span>
    ),
  },
  {
    header: "Request",
    cell: ({ row }) => (
      <span className="text-slate-600 line-clamp-1 max-w-[180px]">
        {row.original.specialRequest || "NA"}
      </span>
    ),
  },
  {
    header: "Duration",
    cell: ({ row }) => {
      const nights = row.original.nights ?? 0;
      return `${nights} night${nights !== 1 ? "s" : ""}`;
    },
  },
  {
    header: "Check-In – Check-Out",
    cell: ({ row }) => {
      const inDate = row.original.checkIn ? new Date(row.original.checkIn).toLocaleDateString() : "—";
      const outDate = row.original.checkOut ? new Date(row.original.checkOut).toLocaleDateString() : "—";
      return (
        <span className="text-slate-600 whitespace-nowrap">
          {inDate} – {outDate}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

export function GuestDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const { data: queryResult, isLoading } = useResevatiosnData();
  const reservations = queryResult?.data ?? [];
  // [{
  //             "bookingReference": "BK-F1EBA5D09A5F",
  //             "guestName": "Mohit Rajput",
  //             "roomLabel": "Luxury Palace Room ",
  //             "specialRequest": null,
  //             "nights": 2,
  //             "checkIn": "2026-03-09T00:00:00.000Z",
  //             "checkOut": "2026-03-11T00:00:00.000Z",
  //             "status": "confirmed"
  //         },
  //         {
  //             "bookingReference": "BK-0C18D3DCA4A7",
  //             "guestName": "Mohit Rajput",
  //             "roomLabel": "Deluxe City View ",
  //             "specialRequest": null,
  //             "nights": 1,
  //             "checkIn": "2026-03-31T00:00:00.000Z",
  //             "checkOut": "2026-04-01T00:00:00.000Z",
  //             "status": "confirmed"
  //         }]
  const table = useReactTable({
    data: reservations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full space-y-4 p-2">
      <div className="flex items-center justify-end gap-4">
        <Input
          placeholder="Filter guests, request, room..."
          value={(table.getColumn("guestName")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("guestName")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <span className="ml-2">▼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns()
              .filter((col) => col.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(v) => column.toggleVisibility(!!v)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md ">
        <Table>
          <TableHeader >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>

            <TablesLoaders loading={isLoading} rows={10} columns={columns.length}>

              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <DataNotFoundTableComponent columns={columns.length} isLoading={isLoading} table={table} />
              )}
            </TablesLoaders>
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}


export function OptionSelectionDialog({
  trigger,
  id
}: {
  trigger: React.ReactNode;
  id: string;
}) {
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<StayOption>("checkin");

  const handleStatusChange = async () => {
    setLoading(true);
    try {
      const action = TogglePatchStatus[selectedValue as keyof typeof TogglePatchStatus];

      if (typeof action === "function") {
        const res = await action(id);
        toast.success(`Status updated to ${selectedValue}`);
      } else {
        throw new Error("Invalid selection");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to update status";
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-violet-500" />
            Update Stay Type
          </DialogTitle>
          <DialogDescription>
            Choose the specific stay category for this room record.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-6">
          <div className="grid gap-2">
            <Label htmlFor="stay-type" className="text-xs font-bold uppercase text-muted-foreground">
              Selection Options
            </Label>
            <Select
              value={selectedValue}
              onValueChange={(value) => setSelectedValue(value as StayOption)}
            >
              <SelectTrigger id="stay-type" className="w-full h-12">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkin">Check-In</SelectItem>
                <SelectItem value="staying">Starts Staying</SelectItem>
                <SelectItem value="checkout">Check-out</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button variant="ghost" type="button" className="flex-1 sm:flex-none">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleStatusChange}
            disabled={loading}
            className="flex-1 sm:flex-none bg-violet-600 hover:bg-violet-700 min-w-[120px]"
          >
            {loading ? "Updating..." : "Save Selection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}