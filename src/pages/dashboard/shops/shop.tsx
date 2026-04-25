import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router";
import {
  Edit2,
  Trash2,
  ArrowLeft,
  Store,
  Mail,
  Phone,
  FileText,
  MapPin,
  Calendar,
  Package,
  Star,
  MessageSquare,
  User,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { deleteShop, getShopById, type Product, type Review, type Shop } from "@/lib/api";

export default function ShopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const shopQuery = useQuery<Shop>({
    queryKey: ["shop", id],
    queryFn: async () => {
      const res = await getShopById(id!);
      return res.shop;
    },
    enabled: !!id,
  });

  const shopProductsQuery = useQuery<Product[]>({
    queryKey: ["shop-products", id],
    queryFn: async () => {
      const res = await getShopById(id!);
      return res.products;
    },
    enabled: !!id,
  });

  const shopReviewsQuery = useQuery<Review[]>({
    queryKey: ["shop-reviews", id],
    queryFn: async () => {
      const res = await getShopById(id!);
      return res.reviews;
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => deleteShop(id!),
    onSuccess: () => {
      toast.success("Shop deleted successfully!");
      navigate("/dashboard/shops");
    },
    onError: (error: Error) => {
      toast.error("Error deleting shop: " + error.message);
    },
  });

  const shop = shopQuery.data;
  const products = shopProductsQuery.data ?? [];
  const reviews = shopReviewsQuery.data ?? [];

  if (shopQuery.isLoading) {
    return (
      <div className="w-full h-full px-5 py-0 flex items-center justify-center">
        <div className="text-muted-foreground">Loading shop details...</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="w-full h-full px-5 py-0 flex flex-col items-center justify-center gap-4">
        <div className="text-muted-foreground">Shop not found</div>
        <Button onClick={() => navigate("/dashboard/shops")} variant="outline">
          Back to Shops
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full px-5 py-0">
      <div className="w-full h-auto flex sm:flex-col lg:flex-row md:flex-row justify-between items-start pb-6">
        <div className="w-auto">
          <div className="flex items-center gap-3 mb-4">
            <Button
              onClick={() => navigate("/dashboard/shops")}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          <h1 className="text-lg font-medium text-black">{shop.name}</h1>
          <p className="text-xs text-muted-foreground">
            View and manage shop information
          </p>
        </div>
        <div className="w-auto flex justify-start lg:justify-center md:justify-center items-center gap-3 lg:mt-0 md:mt-0 mt-5">
          <Button
            onClick={() => navigate(`/dashboard/shops/${id}/edit`)}
            variant="default"
            size="lg"
            className="bg-[#f87941] hover:bg-[#e66830] gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Shop
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="lg" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Shop
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Shop</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{shop.name}"? This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex justify-end gap-3">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate()}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="w-full h-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Store className="w-4 h-4 text-gray-500" />
              Shop Name
            </h3>
            <p className="text-base text-gray-900">{shop.name}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              Email
            </h3>
            <p className="text-base text-gray-900">{shop.email}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              Phone Number
            </h3>
            <p className="text-base text-gray-900">{shop.phone}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              Description
            </h3>
            <p className="text-base text-gray-900">{shop.description}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              Location
            </h3>
            <p className="text-base text-gray-900">{shop.location}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              Created
            </h3>
            <p className="text-base text-gray-900">
              {new Date(shop.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="space-y-8 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">Products</h2>
            <Badge variant="secondary">{products.length}</Badge>
          </div>

          <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Description</TableHead>
                  <TableHead className="font-semibold text-gray-700">Price</TableHead>
                  <TableHead className="font-semibold text-gray-700">Stock</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No products found for this shop.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">{product.product_name}</TableCell>
                      <TableCell className="text-gray-600 max-w-sm truncate">
                        {product.product_description ?? "-"}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {`$${Number(product.product_price).toFixed(2)}`}
                      </TableCell>
                      <TableCell className="text-gray-700">-</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {product.product_sold ? "sold" : "active"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">Reviews</h2>
            <Badge variant="secondary">{reviews.length}</Badge>
          </div>

          {reviews.length === 0 ? (
            <div className="border rounded-lg bg-white shadow-sm py-8 text-center text-muted-foreground">
              No reviews yet for this shop.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 text-gray-800 font-medium">
                      <User className="w-4 h-4 text-gray-500" />
                      {review.user_id ?? "Anonymous"}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {typeof review.rating === "number" ? review.rating.toFixed(1) : "-"}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed">
                    {review.comment?.trim() ? review.comment : "No review comment provided."}
                  </p>

                  <div className="mt-4 text-xs text-muted-foreground">
                    {review.created_at
                      ? new Date(review.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Date unavailable"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
