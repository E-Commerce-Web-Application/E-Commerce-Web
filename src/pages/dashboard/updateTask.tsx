import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { taskUpdateSchema } from "@/schemas";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/providers/axios";
import { toast } from "sonner";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Textarea } from "@/components/ui/textarea";

export default function UpdateTaskPage() {
  const params = useParams();
  const id = params?.id;
  const navigate = useNavigate();

  const taskQuery = useQuery({
    queryKey: ["post", id],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey as ["post", string];

      const res = await axiosInstance.get(`/tasks/${id}`);
      return res.data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!id,
  });

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof taskUpdateSchema>>({
    resolver: zodResolver(taskUpdateSchema),
    mode: "onChange",
    defaultValues: {
      name: taskQuery.data?.task?.name,
      status: taskQuery.data?.task?.status,
      priority: taskQuery.data?.task?.priority,
      description: taskQuery.data?.task?.description,
    },
  });

  useEffect(() => {
    if (taskQuery.data) {
      reset({
        name: taskQuery.data?.task?.name,
        status: taskQuery.data?.task?.status,
        priority: taskQuery.data?.task?.priority,
        description: taskQuery.data?.task?.description,
      });
    }
  }, [taskQuery.data, reset]);

  const taskUpdateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.patch(
        `/tasks/${taskQuery.data?.task?.id}`,
        data,
      );

      return res.data;
    },
    onSuccess: () => {
      reset();
      toast.success("Task is updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      reset();
      toast.error("Error in updating the task : " + error.name);
    },
  });

  const onSubmit = (data: any) => {
    taskUpdateMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full px-5 ">
      <div className="w-full h-auto flex sm:flex-col lg:flex-row md:flex-row justify-between items-center">
        <div className="w-auto">
          <h1 className="text-lg font-medium text-black">Update Task</h1>
          <p className="text-xs text-muted-foreground">
            Modify the details of your task below and keep its progress up to
            date.
          </p>
        </div>
        <div className="w-auto flex justify-center items-center gap-3">
          <Button
            type="button"
            onClick={() => navigate("/dashboard")}
            variant="outline"
            size="lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="bg-[#f87941]"
            disabled={!isValid || taskUpdateMutation.isPending}
          >
            Update Task
          </Button>
        </div>
      </div>

      <section className="w-full h-auto mt-8">
        <div className="w-full h-auto flex justify-center items-center gap-5">
          <Field className="w-full">
            <FieldLabel htmlFor="input-field-taskname">Name</FieldLabel>
            <Input
              id="input-field-taskname"
              type="text"
              placeholder="Enter task name"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <span className="text-xs text-red-500">
                *{errors.name?.message}
              </span>
            )}
          </Field>
        </div>

        <div className="w-full h-auto flex justify-center items-center mt-5">
          <Field className="w-full">
            <FieldLabel htmlFor="input-field-time">Description</FieldLabel>
            <Textarea
              placeholder="Provide a task description"
              {...register("description", { required: true })}
            />
            {errors.description && (
              <span className="text-xs text-red-500">
                *{errors.description?.message}
              </span>
            )}
          </Field>
        </div>

        <div className="w-full h-auto flex justify-center items-center gap-5 mt-5">
          <Field className="lg:w-1/2 md:w-1/2">
            <FieldLabel htmlFor="input-field-taskname">Priority</FieldLabel>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full px-3 py-2">
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Task Priority</SelectLabel>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field className="lg:w-1/2 md:w-1/2">
            <FieldLabel htmlFor="input-field-taskname">Status</FieldLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full px-3 py-2">
                    <SelectValue placeholder="Select task status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Task Status</SelectLabel>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>
      </section>
    </form>
  );
}
