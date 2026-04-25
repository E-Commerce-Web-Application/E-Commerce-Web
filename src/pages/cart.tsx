import { useMemo } from "react";
import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  type Product,
  type Shop,
  clearCart,
  getAllProducts,
  getAllShops,
  getCartByUserId,
  removeFromCart,
  updateCartItemQty,
} from "@/lib/api";

export default function CartPage() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const cartQuery = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: () => getCartByUserId(user!.id),
    enabled: !!user?.id,
  });

  const productsQuery = useQuery<Product[]>({
    queryKey: ["all-products"],
    queryFn: getAllProducts,
  });

  const shopsQuery = useQuery<Shop[]>({
    queryKey: ["shops"],
    queryFn: getAllShops,
  });

  const updateQtyMutation = useMutation({
    mutationFn: updateCartItemQty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update quantity");
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ userId, productId }: { userId: string; productId: string }) =>
      removeFromCart(userId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove item");
    },
  });

  const clearMutation = useMutation({
    mutationFn: (userId: string) => clearCart(userId),
    onSuccess: () => {
      toast.success("Cart cleared");
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to clear cart");
    },
  });

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    (productsQuery.data ?? []).forEach((product) => map.set(String(product.id), product));
    return map;
  }, [productsQuery.data]);

  const shopMap = useMemo(() => {
    const map = new Map<string, Shop>();
    (shopsQuery.data ?? []).forEach((shop) => map.set(shop.id, shop));
    return map;
  }, [shopsQuery.data]);

  if (!user?.id) {
    return (
      <main className="px-4 md:px-[15%] py-12">
        <h1 className="text-2xl font-semibold">Cart</h1>
        <p className="text-muted-foreground mt-3">Please sign in to view your cart.</p>
      </main>
    );
  }

  const cart = cartQuery.data;
  const items = cart?.items ?? [];

  return (
    <main className="px-4 md:px-[15%] py-12 bg-[#f8f6fc] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your Cart</h1>
          <p className="text-sm text-muted-foreground">Review items before checkout.</p>
        </div>
        <Button variant="outline" onClick={() => clearMutation.mutate(user.id)} disabled={items.length === 0}>
          Clear Cart
        </Button>
      </div>

      <div className="mt-6 grid gap-4">
        {items.length === 0 ? (
          <div className="border rounded-xl bg-white p-8 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/" className="underline text-sm mt-2 inline-block">Go to home</Link>
          </div>
        ) : (
          items.map((item) => {
            const product = productMap.get(item.productId);
            const shopId = product?.shop_id || item.shopId;
            const shop = shopId ? shopMap.get(shopId) : undefined;

            return (
              <div key={item.productId} className="border rounded-xl bg-white p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-medium">{product?.product_name || item.name || `Product ${item.productId}`}</p>
                  <p className="text-xs text-muted-foreground mt-1">Product ID: {item.productId}</p>
                  <p className="text-xs text-muted-foreground">Shop: {shop?.name || shopId || "N/A"}</p>
                  <p className="text-sm mt-1">Unit: ${Number(product?.product_price ?? item.price ?? 0).toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateQtyMutation.mutate({
                        user_id: user.id,
                        product_id: item.productId,
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    }
                    disabled={item.quantity <= 1 || updateQtyMutation.isPending}
                  >
                    -
                  </Button>
                  <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateQtyMutation.mutate({
                        user_id: user.id,
                        product_id: item.productId,
                        quantity: item.quantity + 1,
                      })
                    }
                    disabled={updateQtyMutation.isPending}
                  >
                    +
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMutation.mutate({ userId: user.id, productId: item.productId })}
                    disabled={removeMutation.isPending}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-8 border rounded-xl bg-white p-5">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-semibold">${Number(cart?.totalAmount || 0).toFixed(2)}</p>
        </div>
      </div>
    </main>
  );
}
