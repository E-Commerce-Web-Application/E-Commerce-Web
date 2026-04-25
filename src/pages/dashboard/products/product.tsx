import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router";
import {
  Edit2,
  Trash2,
  ArrowLeft,
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  Store,
  MessageSquare,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/providers/axios";
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
import { Badge } from "@/components/ui/badge";

type Product = {
  id: string;
  shop_id: string;
  product_name: string;
  product_description?: string;
  product_price: number;
  product_sold: boolean;
  product_date: string;
  product_review_id?: number;
};

export default function ProductDetailPage() {
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

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/products/${id}`);
      return res;
    },
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      navigate("/dashboard/products");
    },
    onError: (error: Error) => {
      toast.error("Error deleting product: " + error.message);
    },
  });

  const product = productQuery.data;

  if (productQuery.isLoading) {
    return (
      <div className="w-full h-full px-5 py-0 flex items-center justify-center">
        <div className="text-muted-foreground">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full h-full px-5 py-0 flex flex-col items-center justify-center gap-4">
        <div className="text-muted-foreground">Product not found</div>
        <Button onClick={() => navigate("/dashboard/products")} variant="outline">
          Back to Products
        </Button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `₨${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full h-full px-5 py-0">
      <div className="w-full h-auto flex sm:flex-col lg:flex-row md:flex-row justify-between items-start pb-6">
        <div className="w-auto">
          <div className="flex items-center gap-3 mb-4">
            <Button
              onClick={() => navigate("/dashboard/products")}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-medium text-black">
                {product.product_name}
              </h1>
              <p className="text-xs text-muted-foreground">
                Product Details & Information
              </p>
            </div>
          </div>
        </div>

        <div className="w-auto flex justify-start lg:justify-center md:justify-center items-center gap-3 lg:mt-0 md:mt-0 mt-5">
          <Button
            onClick={() => navigate(`/dashboard/products/${product.id}/edit`)}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="lg" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{product.product_name}"?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex justify-end gap-4">
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

      <div className="w-full h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Product Price */}
        <div className="border rounded-lg p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Price</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(product.product_price)}
          </div>
        </div>

        {/* Product Status */}
        <div className="border rounded-lg p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Status</span>
            </div>
          </div>
          <Badge
            variant={product.product_sold ? "default" : "outline"}
            className={`text-base py-1 px-3 ${
              product.product_sold
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {product.product_sold ? "Sold" : "Available"}
          </Badge>
        </div>

        {/* Created Date */}
        <div className="border rounded-lg p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                Created
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-900">
            {formatDate(product.product_date)}
          </div>
        </div>
      </div>

      {/* Product Details Card */}
      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-lg font-semibold text-black mb-6 flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-700" />
          Product Details
        </h2>

        <div className="space-y-6">
          {/* Shop ID */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <Store className="w-4 h-4" />
              Shop ID
            </label>
            <p className="text-gray-900 bg-gray-50 rounded p-3 font-mono text-sm">
              {product.shop_id}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Description
            </label>
            <p className="text-gray-700 leading-relaxed bg-gray-50 rounded p-3">
              {product.product_description || "No description provided"}
            </p>
          </div>

          {/* Review ID */}
          {product.product_review_id && (
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4" />
                Review ID
              </label>
              <p className="text-gray-900 bg-gray-50 rounded p-3 font-mono text-sm">
                {product.product_review_id}
              </p>
            </div>
          )}

          {/* Additional Info */}
          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                Product ID
              </label>
              <p className="text-gray-900 font-mono text-sm">{product.id}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                Review Status
              </label>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-800 border-amber-200"
              >
                {product.product_review_id ? "Reviewed" : "Not Reviewed"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
