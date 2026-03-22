import type { taskSchema } from "@/schemas";
import { type ColumnDef } from "@tanstack/react-table";
import type z from "zod";
import { Badge } from "@/components/ui/badge";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import {
  Activity,
  AlarmClock,
  Blocks,
  CalendarDays,
  ChartSpline,
  CircleCheck,
  CircleDot,
  Info,
  MoreHorizontal,
  Soup,
  SquareActivity,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const getTaskTableColumns = (
  taskDeletionMutation: any,
): ColumnDef<z.infer<typeof taskSchema>>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorFn: (row) => row?.name,
    header: () => (
      <div className="flex justify-start items-center gap-1">
        <Blocks size={`15`} className="text-muted-foreground" />
        <p className="text-muted-foreground">Name</p>
      </div>
    ),
    cell: ({ getValue }) => {
      return <div className="capitalize">{getValue<string>()}</div>;
    },
  },
  {
    id: "priority",
    accessorFn: (row) => row?.priority,
    accessorKey: "priority",
    enableColumnFilter: true,
    filterFn: "equalsString",
    header: () => (
      <div className="flex justify-start items-center gap-1">
        <SquareActivity size={`15`} className="text-muted-foreground" />
        <p className="text-muted-foreground">Priority</p>
      </div>
    ),
    cell: ({ getValue }) => (
      <Badge
        variant="outline"
        className={`capitalize px-1.5 ${getValue() === "low" ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" : getValue() === "medium" ? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300" : "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"}`}
      >
        <IconCircleCheckFilled
          className={`fill-green-500 ${getValue() === "low" ? "fill-green-500" : getValue() === "medium" ? "fill-purple-500" : "fill-orange-500"}`}
        />
        {getValue<string>()}
      </Badge>
    ),
  },
  {
    id: "status",
    accessorFn: (row) => row?.status,
    header: () => (
      <div className="flex justify-start items-center gap-1">
        <ChartSpline size={`15`} className="text-muted-foreground" />
        <p className="text-muted-foreground">Status</p>
      </div>
    ),
    cell: ({ getValue }) => (
      <Badge variant="outline" className="capitalize">
        {getValue() === "pending" ? (
          <CircleDot size={15} />
        ) : getValue() === "started" ? (
          <Soup size={15} />
        ) : getValue() === "ongoing" ? (
          <Activity size={15} />
        ) : (
          <CircleCheck size={15} />
        )}
        {getValue<string>()}
      </Badge>
    ),
  },
  {
    id: "description",
    accessorFn: (row) => row?.description,
    header: () => (
      <div className="flex justify-start items-center gap-1">
        <Info size={`15`} className="text-muted-foreground" />
        <p className="text-muted-foreground">Description</p>
      </div>
    ),
    cell: ({ getValue }) => {
      return <div className="whitespace-nowrap overflow-clip">{getValue<string>()}</div>;
    },
  },
  {
    id: "createdAt",
    accessorFn: (row) => row?.createdAt,
    header: () => (
      <div className="flex justify-start items-center gap-1">
        <CalendarDays size={`15`} className="text-muted-foreground" />
        <p className="text-muted-foreground">Created</p>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="capitalize">
        {new Date(getValue<string>()).toLocaleDateString()}
      </div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const task = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-4 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => taskDeletionMutation.mutate(task?.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
