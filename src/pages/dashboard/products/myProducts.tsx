import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Plus, Eye, Package, FileText, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { productData } from "./productdata";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

export default function MyProductsPage() {
  const navigate = useNavigate();

  // const productsQuery = useQuery<Product[]>({
  //   queryKey: ["products"],
  //   queryFn: async () => {
  //     const res = await axiosInstance.get("/products/");
  //     return res.data;
  //   },
  // });

  const productsData: Product[] = productData;
  // const hasProducts = productsQuery.data && productsQuery.data.length > 0;

  const hasProducts = productsData.length > 0;

  const formatPrice = (price: number) => {
    return `₨${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full h-full px-5 py-0">
      {!hasProducts ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 py-20">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              You don't have any products yet
            </h2>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Start adding products to your shop to begin sales.
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard/products/create")}
            className="bg-[#f87941] hover:bg-[#e66830] gap-2"
            size="lg"
          >
            <Plus className="w-4 h-4" />
            Create Now
          </Button>
        </div>
      ) : (
        <div className="w-full h-auto">
          <div className="w-full h-auto flex sm:flex-col lg:flex-row md:flex-row justify-between items-center mb-8">
            <div className="w-auto">
              <h1 className="text-lg font-medium text-black">My Products</h1>
              <p className="text-xs text-muted-foreground">
                View and manage all your products.
              </p>
            </div>
            <Button
              onClick={() => navigate("/dashboard/products/create")}
              className="bg-[#f87941] hover:bg-[#e66830] gap-2 lg:mt-0 md:mt-0 mt-5"
              size="lg"
            >
              <Plus className="w-4 h-4" />
              Create New Product
            </Button>
          </div>

          <div className="border rounded-lg bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      Product Name
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      Description
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      Price
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      Status
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Date Added
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {productsQuery.data?.map((product) => ( */}
                {productsData.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900">
                      {product.product_name}
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-xs truncate">
                      {product.product_description || "No description"}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {formatPrice(product.product_price)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.product_sold ? "default" : "outline"}
                        className={
                          product.product_sold
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {product.product_sold ? "Sold" : "Available"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {formatDate(product.product_date)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        onClick={() =>
                          navigate(`/dashboard/products/${product.id}`)
                        }
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* ))} */}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
