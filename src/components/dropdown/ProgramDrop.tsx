"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetCategories } from "@/services/dropdown.service";
import { useSelected } from "@/context/selectedContext";

interface Category {
  categoryId: number;
  categoryName: string;
}

function ProgramDrop() {
  const { selectedCategory, setSelectedCategory } = useSelected();

  const {
    data: fetchedCategories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useGetCategories();

  // const [categories, setCategories] = useState<Category[]>([]);
  // const [loading, setLoading] = useState(true);

  const [currentCategory, setCurrentCategory] = useState<string | undefined>();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          console.error("No token found!");
          return;
        }

        if (fetchedCategories && selectedCategory) {
          const found = fetchedCategories.find(
            (cat: Category) => cat.categoryId === selectedCategory
          );
          setCurrentCategory(found?.categoryName);
        }

        // const res = await fetch(
        // 	"https://herald-hub-backend.onrender.com/categories",
        // 	{
        // 		method: "GET",
        // 		headers: {
        // 			Authorization: `Bearer ${token}`, // 👈 send token
        // 		},
        // 	}
        // );

        // const data = await res.json();
        // console.log("API Response:", data);

        // if (res.ok && data?.data) {
        // 	setCategories(data.data);
        // } else {
        // 	if (res.status === 401 || res.status === 403) {
        // 		window.location.href = "/login"; // Redirect to login page
        // 		console.error(
        // 			"Access forbidden: You don't have permission to access this resource."
        // 		);
        // 		toast.error(
        // 			`${data.message || "Access forbidden"}: Login you out!`
        // 		);
        // 		return;
        // 	}
        // 	// console.error("API returned error:", data);
        // }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
      // finally {
      // 	setLoading(false);
      // }
    };

    fetchCategories();
  }, [selectedCategory, fetchedCategories]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="group h-[50px] sm:h-[60px] px-3 sm:pl-4 sm:pr-4 rounded border border-gray-300 flex justify-between items-center gap-2 sm:gap-10 w-full max-w-full sm:max-w-[300px] text-[15px] sm:text-[17px] tracking-[0.5px] bg-white shadow-sm hover:text-white hover:bg-primary hover:border-none transition duration-200 outline-none"
        disabled={isCategoriesLoading || isCategoriesError}
      >
        {!isCategoriesLoading && isCategoriesError && (
          <p className="truncate text-center text-red-500 text-sm sm:text-base">
            {categoriesError.message || "Error loading categories"}
          </p>
        )}

        {isCategoriesLoading && !isCategoriesError && (
          <div className="flex justify-center items-center w-full">
            <div className="h-5 w-5 sm:h-6 sm:w-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!isCategoriesLoading && !isCategoriesError && (
          <>
            <p className="truncate text-sm sm:text-base">
              {currentCategory || "Categories"}
            </p>
            <ChevronDown
              size={22}
              className="mt-0.5 sm:mt-1 text-gray-500 flex-shrink-0 group-hover:text-white"
            />
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-[var(--radix-dropdown-menu-trigger-width)] w-full sm:w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-gray-300 max-h-[60vh] overflow-y-auto"
        align="start"
        sideOffset={4}
      >
        {fetchedCategories?.length > 0 &&
          !isCategoriesError &&
          !isCategoriesLoading &&
          fetchedCategories.map((cat: Category) => (
            <DropdownMenuItem
              key={cat.categoryId}
              className="text-center h-[45px] sm:h-[55px] text-[16px] sm:text-[18px] hover:text-white hover:bg-primary"
              onClick={() => {
                setCurrentCategory(cat.categoryName);
                setSelectedCategory(cat.categoryId);
              }}
            >
              {cat.categoryName}
            </DropdownMenuItem>
          ))}

        {isCategoriesError && !isCategoriesLoading && (
          <DropdownMenuItem className="h-[45px] sm:h-[55px] text-[16px] sm:text-[18px] text-red-500">
            {(categoriesError as Error)?.message || "Error loading categories"}
          </DropdownMenuItem>
        )}

        {!isCategoriesLoading && fetchedCategories?.length === 0 && (
          <DropdownMenuItem className="h-[45px] sm:h-[55px] text-[16px] sm:text-[18px] text-red-500">
            No categories found
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProgramDrop;
