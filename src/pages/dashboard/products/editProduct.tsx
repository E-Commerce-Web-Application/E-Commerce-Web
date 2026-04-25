import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { productUpdateSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/providers/axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";

type Product = {
  id: string;
  shop_id: string;
  product_name: string;
  product_description?: string;
  product_price: number;
  product_sold: boolean;
  product_date: string;
  product_review_id?: number | null;
};

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const productQuery = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof productUpdateSchema>>({
    resolver: zodResolver(productUpdateSchema),
    mode: "onChange",
    values: productQuery.data
      ? {
          product_name: productQuery.data.product_name,
          product_description: productQuery.data.product_description || "",
          product_price: productQuery.data.product_price,
          product_sold: productQuery.data.product_sold,
          product_review_id: productQuery.data.product_review_id || null,
        }
      : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.patch(`/products/${id}`, data);
      return res;
    },
    onSuccess: () => {
      toast.success("Product updated successfully!");
      navigate("/dashboard/products");
    },
    onError: (error) => {
      toast.error("Error updating product: " + error.message);
    },
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
  };

  if (productQuery.isLoading) {
    return (
      <div className="w-full h-full px-5 py-0 flex items-center justify-center">
        <div className="text-muted-foreground">Loading product details...</div>
      </div>
    );
  }

  if (!productQuery.data) {
    return (
      <div className="w-full h-full px-5 py-0 flex flex-col items-center justify-center gap-4">
        <div className="text-muted-foreground">Product not found</div>
        <Button onClick={() => navigate("/dashboard/products")} variant="outline">
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full px-5">
      <div className="w-full h-auto flex sm:flex-col lg:flex-row md:flex-row justify-between items-center">
        <div className="w-auto flex items-center gap-3">
          <Button
            onClick={() => navigate("/dashboard/products")}
            variant="ghost"
            size="icon"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-lg font-medium text-black">Edit Product</h1>
            <p className="text-xs text-muted-foreground">
              Update product details below.
            </p>
          </div>
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
            disabled={!isValid || updateMutation.isPending}
          >
            {updateMutation.isPending ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </div>

      <Separator className="my-5" />

      <section className="w-full h-auto mt-8">
        <div className="w-full h-auto flex justify-center items-center">
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
