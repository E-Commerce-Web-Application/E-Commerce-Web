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
import { taskCreateSchema } from "@/schemas";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/providers/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Textarea } from "@/components/ui/textarea";

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof taskCreateSchema>>({
    resolver: zodResolver(taskCreateSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      status: "todo",
      priority: "medium",
    },
  });

  const taskMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/tasks/", data);

      return res;
    },
    onSuccess: () => {
      reset();
      toast.success("Task is created successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      reset();
      toast.error("Error in creating the task : " + error.name);
    },
  });

  const onSubmit = (data: any) => {
    taskMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full px-5">
      <div className="w-full h-auto flex sm:flex-col lg:flex-row md:flex-row justify-between items-center">
        <div className="w-auto">
          <h1 className="text-lg font-medium text-black">Create New Task</h1>
          <p className="text-xs text-muted-foreground">
            Fill in the details below to add a new task and track its progress.
          </p>
        </div>
        <div className="w-auto flex justify-start lg:justify-center md:justify-center items-center gap-3 lg:mt-0 md:mt-0 mt-5">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            size="lg"
          >
            Cancel
          </Button>
          <Button
            onClick={() => navigate("/dashboard/create")}
            type="submit"
            variant="default"
            size="lg"
            className="bg-[#f87941]"
            disabled={!isValid || taskMutation.isPending}
          >
            Create Task
          </Button>
        </div>
      </div>

      <section className="w-full h-auto mt-8">
        <div className="w-full h-auto flex justify-center items-center">
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

        <div className="w-full h-auto flex justify-center items-center gap-5 mt-5"></div>
      </section>
    </form>
  );
}
