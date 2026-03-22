import { ArrowLeftCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function AuthNav() {
  const navigate = useNavigate();

  return (
    <nav className="w-full h-14 flex justify-start items-center px-4 bg-[#f8f6fc]">
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-medium text-[#222222] flex gap-3"
      >
        <ArrowLeftCircle className="text-[#222222]" size={18} />
      </button>
    </nav>
  );
}
