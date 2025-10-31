"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AxiosError } from "axios";
import { FetchDropdownapi } from "@/services/dropdown.service"; 

interface Category {
  categoryId: number;
  categoryName: string;
}

interface CategoryDropDownProps {
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
}

const CategoryDropDown: React.FC<CategoryDropDownProps> = ({
  selectedCategoryId,
  setSelectedCategoryId,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await FetchDropdownapi("/categories"); 

        if (data?.data) {
          setCategories(data.data);
        } else {
          setErrorMsg("Invalid response from server");
          console.error("API returned unexpected data:", data);
        }
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        if (error.response) {
          setErrorMsg(error.response.data?.message || "Failed to fetch categories");
          console.error("Error response:", error.response.data);
        } else if (error.request) {
          setErrorMsg("No response from server");
          console.error("No response received:", error.request);
        } else {
          setErrorMsg("Error setting up request");
          console.error("Error setting up request:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const selectedCategory = categories.find(
    (c) => c.categoryId === selectedCategoryId
  );
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="flex gap-4 justify-center items-center py-1.5 mt-3 w-full sm:w-[230px] h-[45px] text-[16px] text-gray-500 rounded-[5px] tracking-[0.5px] bg-white border border-gray-300 hover:bg-[#E7E7E7]">
        <span className="truncate">
          {selectedCategory ? selectedCategory.categoryName : "Select Category"}
        </span>
        <ChevronDown size={18} className="mt-1 text-gray-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-full sm:w-[230px] bg-white border border-gray-300">
        {loading ? (
          <DropdownMenuItem className="h-[40px] text-[16px] text-gray-400">
            Loading...
          </DropdownMenuItem>
        ) : errorMsg ? (
          <DropdownMenuItem className="h-[40px] text-[16px] text-red-500">
            {errorMsg}
          </DropdownMenuItem>
        ) : categories.length > 0 ? (
          categories.map((cat) => (
            <DropdownMenuItem
              key={cat.categoryId}
              className="h-[40px] text-[16px] hover:bg-[#E7E7E7] text-gray-600 truncate"
              onSelect={() => {
                setSelectedCategoryId(cat.categoryId);
                setOpen(false);
              }}
            >
              {cat.categoryName}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem className="h-[40px] text-[16px] text-red-500">
            No categories found
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryDropDown;
