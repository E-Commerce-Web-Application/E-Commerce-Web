import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useUser } from "@clerk/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getAllShops, getProductById, updateProduct } from "@/lib/api";
import { matchesOwnerId } from "@/lib/owner-id";

const editProductSchema = z.object({
  shop_id: z.string().min(1, "Please select a shop"),
  product_name: z.string().min(3, "Product name should be at least 3 characters"),
  product_description: z.string().max(400).optional(),
  product_price: z.number().positive("Price should be greater than 0"),
});

type EditProductForm = z.infer<typeof editProductSchema>;

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const productQuery = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  const shopsQuery = useQuery({
    queryKey: ["shops"],
    queryFn: getAllShops,
  });

  const myShops = useMemo(
    () => (shopsQuery.data ?? []).filter((shop) => matchesOwnerId(shop.owner_id, user?.id)),
    [shopsQuery.data, user?.id],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EditProductForm>({
    resolver: zodResolver(editProductSchema),
    mode: "onChange",
    values: productQuery.data
      ? {
          shop_id: productQuery.data.shop_id,
          product_name: productQuery.data.product_name,
          product_description: productQuery.data.product_description || "",
          product_price: productQuery.data.product_price,
        }
      : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: EditProductForm) => updateProduct(id!, payload),
    onSuccess: () => {
      toast.success("Product updated");
      navigate(`/dashboard/products/${id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update product");
    },
  });

  const onSubmit = (data: EditProductForm) => {
    updateMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full px-5">
      <div className="w-full h-auto flex sm:flex-col lg:flex-row md:flex-row justify-between items-center">
        <div className="w-auto">
          <h1 className="text-lg font-medium text-black">Edit Product</h1>
          <p className="text-xs text-muted-foreground">Update product details below.</p>
        </div>
        <div className="w-auto flex justify-start items-center gap-3 lg:mt-0 md:mt-0 mt-5">
          <Button onClick={() => navigate(`/dashboard/products/${id}`)} variant="outline" size="lg" type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="bg-[#f87941]"
            disabled={!isValid || updateMutation.isPending}
          >
            {updateMutation.isPending ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </div>

      <Separator className="my-5" />

      <section className="w-full h-auto mt-8 space-y-5">
        <Field className="w-full">
          <FieldLabel htmlFor="shop_id">Shop</FieldLabel>
          <select
            id="shop_id"
            className="w-full h-10 border rounded-md px-3 text-sm"
            {...register("shop_id")}
          >
            <option value="">Select your shop</option>
            {myShops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select>
          {errors.shop_id ? <span className="text-xs text-red-500">*{errors.shop_id.message}</span> : null}
        </Field>

        <Field className="w-full">
          <FieldLabel htmlFor="product_name">Product Name</FieldLabel>
          <Input id="product_name" placeholder="Enter product name" {...register("product_name")} />
          {errors.product_name ? (
            <span className="text-xs text-red-500">*{errors.product_name.message}</span>
          ) : null}
        </Field>

        <Field className="w-full">
          <FieldLabel htmlFor="product_description">Description</FieldLabel>
          <Textarea
            id="product_description"
            className="resize-none"
            placeholder="Product description"
            {...register("product_description")}
          />
          {errors.product_description ? (
            <span className="text-xs text-red-500">*{errors.product_description.message}</span>
          ) : null}
        </Field>

        <Field className="w-full">
          <FieldLabel htmlFor="product_price">Price</FieldLabel>
          <Input
            id="product_price"
            type="number"
            step="1"
            min="1"
            {...register("product_price", { valueAsNumber: true })}
          />
          {errors.product_price ? (
            <span className="text-xs text-red-500">*{errors.product_price.message}</span>
          ) : null}
        </Field>
      </section>
    </form>
  );
}