import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Plus, Eye, Store, FileText, MapPin, Mail, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/providers/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Shop = {
  id: string;
  name: string;
  description: string;
  location: string;
  email: string;
  phone: string;
};

export default function MyShopsPage() {
  const navigate = useNavigate();

  const shopsQuery = useQuery<Shop[]>({
    queryKey: ["shops"],
    queryFn: async () => {
      const res = await axiosInstance.get("/shops");
      return res.data;
    },
  });

  const hasShops = shopsQuery.data && shopsQuery.data.length > 0;

  return (
    <div className="w-full h-full px-5 py-0">
      {!hasShops ? (
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
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              You don't have any shops yet
            </h2>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Start creating your shop to begin selling amazing products.
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard/shops/create")}
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
              <h1 className="text-lg font-medium text-black">My Shops</h1>
              <p className="text-xs text-muted-foreground">
                View and manage all your shops.
              </p>
            </div>
            <Button
              onClick={() => navigate("/dashboard/shops/create")}
              className="bg-[#f87941] hover:bg-[#e66830] gap-2 lg:mt-0 md:mt-0 mt-5"
              size="lg"
            >
              <Plus className="w-4 h-4" />
              Create New Shop
            </Button>
          </div>

          <div className="border rounded-lg bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-gray-500" />
                      Shop Name
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
                      <MapPin className="w-4 h-4 text-gray-500" />
                      Location
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      Email
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      Phone
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shopsQuery.data?.map((shop) => (
                  <TableRow
                    key={shop.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900">
                      {shop.name}
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-xs truncate">
                      {shop.description}
                    </TableCell>
                    <TableCell className="text-gray-600">{shop.location}</TableCell>
                    <TableCell className="text-gray-600">{shop.email}</TableCell>
                    <TableCell className="text-gray-600">{shop.phone}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        onClick={() => navigate(`/dashboard/shops/${shop.id}`)}
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
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
