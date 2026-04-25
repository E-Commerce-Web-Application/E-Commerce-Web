import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { productCreateSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/providers/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

export default function CreateProductPage() {
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof productCreateSchema>>({
    resolver: zodResolver(productCreateSchema),
    mode: "onChange",
    defaultValues: {
      shop_id: "",
      product_name: "",
      product_description: "",
      product_price: 0,
      product_sold: false,
      product_review_id: null,
    },
  });

  const productMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/products/", data);
      return res;
    },
    onSuccess: () => {
      reset();
      toast.success("Product created successfully!");
      navigate("/dashboard/products");
    },
    onError: (error) => {
      reset();
      toast.error("Error creating product: " + error.message);
    },
  });

  const onSubmit = (data: any) => {
    productMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full px-5">
      <div className="w-full h-auto flex sm:flex-col lg:flex-row md:flex-row justify-between items-center">
        <div className="w-auto">
          <h1 className="text-lg font-medium text-black">Create New Product</h1>
          <p className="text-xs text-muted-foreground">
            Fill in the details below to create a new product.
          </p>
        </div>
        <div className="w-auto flex justify-start lg:justify-center md:justify-center items-center gap-3 lg:mt-0 md:mt-0 mt-5">
          <Button
            onClick={() => navigate("/dashboard/products")}
            variant="outline"
            size="lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="bg-[#f87941] hover:bg-[#e66830]"
            disabled={!isValid || productMutation.isPending}
          >
            {productMutation.isPending ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </div>

      <Separator className="my-5" />

      <section className="w-full h-auto mt-8">
        <div className="w-full h-auto flex justify-center items-center">
          <Field className="w-full">
            <FieldLabel htmlFor="input-field-shopid">Shop ID</FieldLabel>
            <Input
              id="input-field-shopid"
              type="text"
              placeholder="Enter shop ID"
              {...register("shop_id", { required: true })}
            />
            {errors.shop_id && (
              <span className="text-xs text-red-500">
                *{errors.shop_id?.message}
              </span>
            )}
          </Field>
        </div>

        <div className="w-full h-auto flex justify-center items-center mt-5">
          <Field className="w-full">
            <FieldLabel htmlFor="input-field-productname">
              Product Name
            </FieldLabel>
            <Input
              id="input-field-productname"
              type="text"
              placeholder="Enter product name"
              {...register("product_name", { required: true })}
            />
            {errors.product_name && (
              <span className="text-xs text-red-500">
                *{errors.product_name?.message}
              </span>
            )}
          </Field>
        </div>

        <div className="w-full h-auto flex justify-center items-center mt-5">
          <Field className="w-full">
            <FieldLabel htmlFor="input-field-description">
              Description (Optional)
            </FieldLabel>
            <Textarea
              id="input-field-description"
              placeholder="Provide a product description"
              {...register("product_description")}
              className="resize-none"
            />
            {errors.product_description && (
              <span className="text-xs text-red-500">
                *{errors.product_description?.message}
              </span>
            )}
          </Field>
        </div>

        <div className="w-full h-auto flex justify-center items-center gap-5 mt-5">
          <Field className="lg:w-1/2 md:w-1/2">
            <FieldLabel htmlFor="input-field-price">Price</FieldLabel>
            <Input
              id="input-field-price"
              type="number"
              placeholder="Enter product price"
              {...register("product_price", { required: true })}
            />
            {errors.product_price && (
              <span className="text-xs text-red-500">
                *{errors.product_price?.message}
              </span>
            )}
          </Field>

          <Field className="lg:w-1/2 md:w-1/2">
            <FieldLabel htmlFor="input-field-reviewid">
              Review ID (Optional)
            </FieldLabel>
            <Input
              id="input-field-reviewid"
              type="number"
              placeholder="Enter review ID"
              {...register("product_review_id")}
            />
            {errors.product_review_id && (
              <span className="text-xs text-red-500">
                *{errors.product_review_id?.message}
              </span>
            )}
          </Field>
        </div>

        <div className="w-full h-auto flex items-center gap-3 mt-5">
          <Checkbox
            id="input-field-sold"
            {...register("product_sold")}
          />
          <FieldLabel htmlFor="input-field-sold" className="cursor-pointer">
            Mark as Sold
          </FieldLabel>
        </div>
      </section>
    </form>
  );
}
