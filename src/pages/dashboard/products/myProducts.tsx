import { useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteProduct, getAllShops, getProductsByShopId, type Product } from "@/lib/api";
import { matchesOwnerId } from "@/lib/owner-id";

export default function MyProductsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const shopsQuery = useQuery({
    queryKey: ["shops"],
    queryFn: getAllShops,
  });

  const myShops = useMemo(
    () => (shopsQuery.data ?? []).filter((shop) => matchesOwnerId(shop.owner_id, user?.id)),
    [shopsQuery.data, user?.id],
  );

  const productsQuery = useQuery({
    queryKey: ["my-products", myShops.map((s) => s.id).join(",")],
    queryFn: async () => {
      const rows = await Promise.all(
        myShops.map(async (shop) => {
          try {
            const products = await getProductsByShopId(shop.id);
            return products.map((product) => ({
              ...product,
              shop_name: shop.name,
            }));
          } catch {
            return [] as Array<Product & { shop_name: string }>;
          }
        }),
      );
      return rows.flat();
    },
    enabled: myShops.length > 0,
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      toast.success("Product deleted");
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  return (
    <div className="w-full h-full px-5 py-0">
      <div className="w-full h-auto flex sm:flex-col lg:flex-row md:flex-row justify-between items-center mb-8">
        <div className="w-auto">
          <h1 className="text-lg font-medium text-black">My Products</h1>
          <p className="text-xs text-muted-foreground">Manage products created by your shops.</p>
        </div>
        <Button
          onClick={() => navigate("/dashboard/products/create")}
          className="bg-[#f87941] hover:bg-[#e66830] gap-2 lg:mt-0 md:mt-0 mt-5"
          size="lg"
        >
          <Plus className="w-4 h-4" />
          Create Product
        </Button>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead>Product</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsQuery.isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : (productsQuery.data ?? []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No products yet. <Link to="/dashboard/products/create" className="underline">Create one now</Link>.
                </TableCell>
              </TableRow>
            ) : (
              (productsQuery.data ?? []).map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.product_name}</TableCell>
                  <TableCell>{product.shop_name}</TableCell>
                  <TableCell>${Number(product.product_price).toFixed(2)}</TableCell>
                  <TableCell>{product.product_sold ? "Sold" : "Active"}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/dashboard/products/${product.id}`)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/dashboard/products/${product.id}/edit`)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(String(product.id))}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}