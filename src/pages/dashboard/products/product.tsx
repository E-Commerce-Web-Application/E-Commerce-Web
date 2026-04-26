import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useUser } from "@clerk/react";
import { ArrowLeft, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createReview, deleteReview, getProductById, getReviewsByProductId } from "@/lib/api";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const productQuery = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  const reviewsQuery = useQuery({
    queryKey: ["product-reviews", id],
    queryFn: () => getReviewsByProductId(id!),
    enabled: !!id,
  });

  const reviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      toast.success("Review added");
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["product-reviews", id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add review");
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: () => {
      toast.success("Review removed");
      queryClient.invalidateQueries({ queryKey: ["product-reviews", id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete review");
    },
  });

  const product = productQuery.data;
  const reviews = reviewsQuery.data ?? [];

  return (
    <div className="w-full h-full px-5 py-0">
      <div className="flex items-center justify-between pb-6">
        <div>
          <Button onClick={() => navigate("/dashboard/products")} variant="ghost" className="px-0">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-lg font-medium text-black">{product?.product_name || "Product"}</h1>
          <p className="text-xs text-muted-foreground">Product details and reviews</p>
        </div>
        <Button onClick={() => navigate(`/dashboard/products/${id}/edit`)} className="bg-[#f87941]">
          Edit Product
        </Button>
      </div>

      <div className="border rounded-lg bg-white p-5 mb-6">
        <p className="text-sm text-muted-foreground">Description</p>
        <p className="text-sm mt-1">{product?.product_description || "No description"}</p>
        <p className="text-sm text-muted-foreground mt-4">Price</p>
        <p className="text-xl font-semibold text-black mt-1">${Number(product?.product_price || 0).toFixed(2)}</p>
      </div>

      <div className="border rounded-lg bg-white p-5 mb-6">
        <h2 className="font-medium">Add Review</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field>
            <FieldLabel htmlFor="rating">Rating (1-5)</FieldLabel>
            <Input
              id="rating"
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="comment">Comment</FieldLabel>
            <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} />
          </Field>
        </div>
        <Button
          className="mt-4 bg-[#f87941]"
          onClick={() => {
            if (!user?.id || !id) {
              toast.error("Please sign in first");
              return;
            }
            reviewMutation.mutate({
              product_id: id,
              user_id: user.id,
              rating,
              comment,
            });
          }}
          disabled={reviewMutation.isPending}
        >
          {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
        </Button>
      </div>

      <div className="border rounded-lg bg-white p-5">
        <h2 className="font-medium mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-md p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="text-sm font-medium">{review.rating}</span>
                  </div>
                  {user?.id === review.user_id ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteReviewMutation.mutate(review.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  ) : null}
                </div>
                <p className="text-sm mt-2">{review.comment || "No comment"}</p>
                <p className="text-xs text-muted-foreground mt-1">by {review.user_id}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}