import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { shopCreateSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/providers/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function CreateShopPage() {
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof shopCreateSchema>>({
    resolver: zodResolver(shopCreateSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      location: "",
      email: "",
      phone: "",
    },
  });

  const shopMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/shops/", data);
      return res;
    },
    onSuccess: () => {
      reset();
      toast.success("Shop created successfully!");
      navigate("/dashboard/shops");
    },
    onError: (error) => {
      reset();
      toast.error("Error creating shop: " + error.message);
    },
  });

  const onSubmit = (data: any) => {
    shopMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full px-5">
      <div className="w-full h-auto flex sm:flex-col lg:flex-row md:flex-row justify-between items-center">
        <div className="w-auto">
          <h1 className="text-lg font-medium text-black">Create New Shop</h1>
          <p className="text-xs text-muted-foreground">
            Fill in the details below to create a new shop.
          </p>
        </div>
        <div className="w-auto flex justify-start lg:justify-center md:justify-center items-center gap-3 lg:mt-0 md:mt-0 mt-5">
          <Button
            onClick={() => navigate("/dashboard/shops")}
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
            disabled={!isValid || shopMutation.isPending}
          >
            {shopMutation.isPending ? "Creating..." : "Create Shop"}
          </Button>
        </div>
      </div>

      <Separator className="my-5" />

      <section className="w-full h-auto mt-8">
        <div className="w-full h-auto flex justify-center items-center">
          <Field className="w-full">
            <FieldLabel htmlFor="input-field-shopname">Shop Name</FieldLabel>
            <Input
              id="input-field-shopname"
              type="text"
              placeholder="Enter shop name"
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
            <FieldLabel htmlFor="input-field-description">
              Description
            </FieldLabel>
            <Textarea
              id="input-field-description"
              placeholder="Provide a shop description"
              {...register("description", { required: true })}
              className="resize-none"
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
            <FieldLabel htmlFor="input-field-location">Location</FieldLabel>
            <Input
              id="input-field-location"
              type="text"
              placeholder="Enter shop location"
              {...register("location", { required: true })}
            />
            {errors.location && (
              <span className="text-xs text-red-500">
                *{errors.location?.message}
              </span>
            )}
          </Field>

          <Field className="lg:w-1/2 md:w-1/2">
            <FieldLabel htmlFor="input-field-email">Email</FieldLabel>
            <Input
              id="input-field-email"
              type="email"
              placeholder="Enter shop email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-xs text-red-500">
                *{errors.email?.message}
              </span>
            )}
          </Field>
        </div>

        <div className="w-full h-auto flex justify-center items-center mt-5">
          <Field className="w-full">
            <FieldLabel htmlFor="input-field-phone">Phone Number</FieldLabel>
            <Input
              id="input-field-phone"
              type="tel"
              placeholder="Enter shop phone number"
              {...register("phone", { required: true })}
            />
            {errors.phone && (
              <span className="text-xs text-red-500">
                *{errors.phone?.message}
              </span>
            )}
          </Field>
        </div>
      </section>
    </form>
  );
}
