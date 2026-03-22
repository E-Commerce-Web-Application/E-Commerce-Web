import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/providers/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import {
  Activity,
  CalendarDays,
  CircleCheck,
  CircleDot,
  SquareActivity,
  ChartSpline,
  Info,
  Clock,
} from "lucide-react";

export default function Task() {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  const taskQuery = useQuery({
    queryKey: ["task", id],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey as ["task", string];

      const res = await axiosInstance.get(`/tasks/${id}`);
      return res.data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!id,
  });

  const taskDeleteMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/tasks/${id}`);

      return res;
    },
    onSuccess: () => {
      navigate("/dashboard");
      toast.info("Task is deleted successfully");
    },
    onError: (error) => {
      toast.error("Error deleting the task! : " + error.message);
    },
  });

  const task = taskQuery.data?.task;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <CircleDot size={15} />;
      case "in_progress":
        return <Activity size={15} />;
      case "done":
        return <CircleCheck size={15} />;
      default:
        return <CircleDot size={15} />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full h-full px-5">
      <div className="w-full h-auto flex sm:flex-col lg:flex-row md:flex-row justify-between items-center">
        <div className="w-auto">
          <h1 className="text-lg font-medium text-black">{task?.name}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            View and manage task details
          </p>
        </div>
        <div className="w-auto flex justify-start lg:justify-center md:justify-center items-center gap-3 lg:mt-0 md:mt-0 mt-5">
          <Button
            onClick={() => navigate(`/dashboard/${id}/update`)}
            variant="outline"
            size="lg"
          >
            Update
          </Button>
          <Button
            onClick={() => taskDeleteMutation.mutate()}
            type="submit"
            variant="default"
            size="lg"
            className="bg-red-500"
            disabled={taskDeleteMutation.isPending}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="w-full h-auto mt-8 space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <SquareActivity size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Priority:</span>
            <Badge
              variant="outline"
              className={`capitalize px-1.5 ${
                task?.priority === "low"
                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                  : task?.priority === "medium"
                    ? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                    : "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
              }`}
            >
              <IconCircleCheckFilled
                className={`${
                  task?.priority === "low"
                    ? "fill-green-500"
                    : task?.priority === "medium"
                      ? "fill-purple-500"
                      : "fill-orange-500"
                }`}
              />
              {task?.priority}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <ChartSpline size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant="outline" className="capitalize">
              {task?.status && getStatusIcon(task.status)}
              {task?.status?.replace("_", " ")}
            </Badge>
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-start gap-2 mb-2">
            <Info size={16} className="text-muted-foreground mt-0.5" />
            <span className="text-sm font-medium text-muted-foreground">
              Description
            </span>
          </div>
          <p className="text-sm text-black pl-6">{task?.description}</p>
        </div>

        <div className="w-full space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Created:</span>
            <span className="text-sm text-black">
              {task?.createdAt && formatDate(task.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last Updated:</span>
            <span className="text-sm text-black">
              {task?.updatedAt && formatDate(task.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
