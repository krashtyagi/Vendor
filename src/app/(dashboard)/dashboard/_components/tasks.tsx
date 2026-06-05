"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { TaskForm } from "./taskform";
import { useGetTasks } from "@/services/tanstack.query";
import { format } from "date-fns";
const ratings = [
  { label: "Facilities", score: 4.4, percentage: 88 },
  { label: "Cleanliness", score: 4.7, percentage: 94 },
  { label: "Services", score: 4.6, percentage: 92 },
  { label: "Comfort", score: 4.8, percentage: 96 },
  { label: "Location", score: 4.5, percentage: 90 },
];

export interface ITask {
  _id: string;
  vendorId: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
export function RatingAndTasks() {
  const [checking, setChecking] = useState(false);
  const { data: t, isLoading: taskLoading, refetch, isRefetching } = useGetTasks();
  const tasks: ITask[] = t?.data || [];

  const handleSubmitCheck = async ({
    id, status
  }: {
    id: string, status: string
  }) => {
    const data = {
      status: status === "completed" ? "pending" : "completed"
    }
    try {
      setChecking(true);
      const res = updateTask({
        id, data

      })
    } catch (error) {
      console.error("not checked something went wrong");


    } finally {
      setChecking(false);
    }

  }
  return (
    <div className="grid grid-cols-1 gap-2 max-w-md">
      <Card className="border-none shadow-sm rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold ">
            Overall Rating
          </CardTitle>
          <MoreHorizontal className="h-5 w-5 text-slate-400 cursor-pointer" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-emerald-50 rounded-xl p-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-800">4.6</span>
              <span className="text-slate-400 text-sm">/5</span>
            </div>
            <div>
              <p className="font-bold text-slate-800 text-lg leading-tight">
                Impressive
              </p>
              <p className="text-xs text-slate-400">from 2546 reviews</p>
            </div>
          </div>

          <div className="space-y-4">
            {ratings.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="text-sm text-slate-500 w-24">
                  {item.label}
                </span>
                <div className="flex-1 h-2 bg-lime-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-700 w-6 text-right">
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-bold ">
            Tasks
          </CardTitle>
          <TaskForm
            refetch={() => { refetch() }}
            trigger={
              <Button
                size="icon"
                className="bg-violet-500 hover:bg-violet-600 rounded-xl h-10 w-10"
              >
                <Plus className="h-6 w-6" />
              </Button>
            }
          />
        </CardHeader>

        <CardContent className="relative space-y-6">
          {taskLoading ? (
            <PageSkeleton />
          ) : tasks.length === 0 ? (
            <MessageModal title="Add tasks" description="adding notes can be usefull to remember tasks" />
          ) : (
            tasks.map((task: ITask, index: number) => {
              // Determine visual variant based on task priority or index
              // In the original UI, some were purple, some were green.
              const isViolet = task.priority === "high" || index % 3 === 1;

              return (
                <div key={task._id} className="flex gap-4 relative">
                  {/* Timeline Connector Line */}
                  {index !== tasks.length - 1 && (
                    <div className="absolute left-[11px] top-8 w-[1px] h-12 bg-slate-200" />
                  )}


                  <Checkbox
                    disabled={checking}


                    onCheckedChange={() => {
                      handleSubmitCheck({
                        id: task?._id, status: task.status
                      })
                    }}
                    defaultChecked={task.status === "completed"}
                    className="mt-1 border-slate-200 data-[state=checked]:bg-violet-500 h-6 w-6 rounded-md"
                  />


                  <div
                    className={`flex-1 rounded-2xl p-4 transition-all ${isViolet
                      ? "bg-violet-500 text-white shadow-md shadow-violet-100"
                      : "bg-emerald-50 text-slate-800"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`text-[11px] uppercase tracking-wider font-semibold ${isViolet ? "text-violet-200" : "text-slate-400"
                          }`}
                      >
                        {/* Format the Date safely */}
                        {task.dueDate
                          ? format(new Date(task.dueDate), "MMMM dd, yyyy")
                          : "No Date"}
                      </span>
                      <DropdownMenuIcons refetch={() => refetch()} task={task} trigger={
                        <MoreHorizontal className="h-4 w-4 opacity-60 cursor-pointer" />
                      } />

                    </div>
                    <p className="text-sm font-medium leading-snug">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className={`text-xs mt-1 opacity-70 line-clamp-1`}>
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"
import { ReactNode, useState } from "react";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { deleteTask, updateTask } from "@/services/fetch.service";
import { Spinner } from "@/components/ui/spinner";
import { MessageModal } from "../../(categories)/rooms/_components/RoomsListing";
import { PageSkeleton } from "../../(categories)/rooms/_components/details.skeleton";

export function DropdownMenuIcons({ trigger, task, refetch }: { trigger: ReactNode, task: ITask, refetch: () => void }) {
  const [deleting, setDeleting] = useState(false);
  const handelDelete = () => {
    try {
      setDeleting(true);
      const res = deleteTask(task?._id).then(() => {
        refetch();
      })


    } catch (error) {
      console.error(error);

    } finally {
      setDeleting(false);
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <TaskForm
            refetch={refetch}
            task={task}
            trigger={<span className="flex items-center gap-2">
              <IconPencil />
              Edit
            </span>} />

        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCardIcon />
          Billing
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handelDelete} disabled={deleting}>
          <IconTrash />
          {deleting ? <Spinner /> : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
