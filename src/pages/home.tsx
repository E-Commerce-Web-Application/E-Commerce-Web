import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/react";
import { Eye, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  addToCart,
  createReview,
  getAllProducts,
  getAllShops,
  getCartByUserId,
  getReviewsByProductId,
  type Product,
} from "@/lib/api";

export default function Home() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const productsQuery = useQuery({
    queryKey: ["all-products"],
    queryFn: getAllProducts,
  });

  const shopsQuery = useQuery({
    queryKey: ["shops"],
    queryFn: getAllShops,
  });

  const reviewsQuery = useQuery({
    queryKey: ["reviews", selectedProduct?.id],
    queryFn: () => getReviewsByProductId(selectedProduct!.id),
    enabled: !!selectedProduct?.id,
  });

  const cartQuery = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: () => getCartByUserId(user!.id),
    enabled: !!user?.id,
  });

  const shopMap = useMemo(() => {
    const map = new Map<string, string>();
    (shopsQuery.data ?? []).forEach((shop) => map.set(shop.id, shop.name));
    return map;
  }, [shopsQuery.data]);

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.success("Product added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add product to cart");
    },
  });

  const addReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      toast.success("Review submitted");
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["reviews", selectedProduct?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit review");
    },
  });

  const cartCount = (cartQuery.data?.items ?? []).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="w-full min-h-screen px-4 md:px-[12%] py-10 bg-[#f8f6fc]">
      <div className="w-full flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-black">Marketplace</h1>
          <p className="text-sm text-muted-foreground mt-1">Products from all shops</p>
        </div>
        <Link to="/cart" className="relative">
          <Button variant="outline" className="gap-2">
            <ShoppingCart className="w-4 h-4" /> Cart
          </Button>
          {cartCount > 0 ? (
            <span className="absolute -top-2 -right-2 text-[10px] w-5 h-5 rounded-full bg-[#f87941] text-white flex items-center justify-center">
              {cartCount}
            </span>
          ) : null}
        </Link>
      </div>

      {productsQuery.isLoading ? (
        <div className="text-sm text-muted-foreground">Loading products...</div>
      ) : (productsQuery.data ?? []).length === 0 ? (
        <div className="border rounded-xl bg-white p-8 text-center text-muted-foreground">
          No products available yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(productsQuery.data ?? []).map((product) => (
            <div key={product.id} className="border rounded-xl bg-white p-4 shadow-sm">
              <p className="text-lg font-semibold">{product.product_name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Shop: {shopMap.get(product.shop_id) || product.shop_id}
              </p>
              <p className="text-sm mt-3 line-clamp-2">
                {product.product_description || "No description"}
              </p>
              <p className="text-xl font-semibold mt-4">${Number(product.product_price).toFixed(2)}</p>

              <div className="mt-4 flex gap-2">
                <Button
                  className="bg-[#f87941]"
                  onClick={() => {
                    if (!user?.id) {
                      toast.error("Please sign in to add items to cart");
                      return;
                    }

                    addToCartMutation.mutate({
                      user_id: user.id,
                      item: {
                        product_id: String(product.id),
                        name: product.product_name,
                        price: product.product_price,
                        quantity: 1,
                        shop_id: product.shop_id,
                      },
                    });
                  }}
                >
                  Add to Cart
                </Button>
                <Button variant="outline" onClick={() => setSelectedProduct(product)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct ? (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl rounded-xl p-5 max-h-[90vh] overflow-auto">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">{selectedProduct.product_name}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {shopMap.get(selectedProduct.shop_id) || selectedProduct.shop_id}
                </p>
              </div>
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                Close
              </Button>
            </div>

            <p className="mt-4 text-sm">{selectedProduct.product_description || "No description"}</p>
            <p className="mt-3 text-lg font-semibold">${Number(selectedProduct.product_price).toFixed(2)}</p>

            <div className="mt-6">
              <h3 className="font-medium">Reviews</h3>
              {(reviewsQuery.data ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground mt-2">No reviews yet.</p>
              ) : (
                <div className="space-y-2 mt-3">
                  {(reviewsQuery.data ?? []).map((review) => (
                    <div key={review.id} className="border rounded-md p-3">
                      <div className="flex items-center gap-1 text-amber-600 text-sm">
                        <Star className="w-4 h-4 fill-amber-500" />
                        {review.rating}
                      </div>
                      <p className="text-sm mt-1">{review.comment || "No comment"}</p>
                      <p className="text-xs text-muted-foreground mt-1">by {review.user_id}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 border-t pt-4">
              <h4 className="font-medium">Add your review</h4>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Rating (1-5)</label>
                  <input
                    className="w-full h-10 border rounded-md px-3 text-sm mt-1"
                    type="number"
                    min={1}
                    max={5}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Comment</label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2 text-sm mt-1 resize-none"
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>

              <Button
                className="bg-[#f87941] mt-3"
                onClick={() => {
                  if (!user?.id) {
                    toast.error("Please sign in to review products");
                    return;
                  }

                  addReviewMutation.mutate({
                    product_id: String(selectedProduct.id),
                    user_id: user.id,
                    rating,
                    comment,
                  });
                }}
                disabled={addReviewMutation.isPending}
              >
                {addReviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
