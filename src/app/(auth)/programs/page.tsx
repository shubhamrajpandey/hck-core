"use client";

import ModuleBox from "@/components/dashboard/ModuleBox/moduleBox";
import ExtraBox from "@/components/dashboard/ExtraBox/extraBox";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelected } from "@/context/selectedContext";
// import { fetchModule } from "@/services/modules.service";
// import FetchWeekbyModuleid from "@/services/fetchWeekbyModuleid";
import LevelDropdown from "@/components/dropdown/LevelDropdown";
import { useFetchModule } from "@/services/modules.service";
import { ModuleBoxSkeleton } from "@/components/dashboard/ModuleBox/ModuleBoxSkeleton";
import { useFetchExtraResources } from "@/services/resources.service";
import { ExtraBoxSkeleton } from "@/components/dashboard/ExtraBox/ExtraBoxSkeleton";
import { motion, AnimatePresence } from "framer-motion";

type Faculty = {
  id: number;
  name: string;
};

type Level = {
  id: number;
  name: string;
  facultyId: number;
  faculty: Faculty;
};

type Module = {
  id: number;
  name: string;
  description: string;
  code: string;
  leader: string;
  levelId: number;
  level: Level;
};

type ExtraResource = {
  id: number;
  title: string;
  description: string;
  keywords: string[];
  link: string;
  uploadedById: number;
  categoryId: number;
  category: {
    categoryId: number;
    categoryName: string;
  };
  files: {
    Id: number;
    extraResourceId: number;
    requestId: number | null;
    fileName: string;
    filePath: string;
  }[];
};

export default function Programs() {
  const [isChecked, setisChecked] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  // const [modules, setModules] = useState<Module[]>([]);
  // const [extraResources, setExtraResources] = useState<ExtraResource[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [extraResourcesLoading, setExtraResourcesLoading] = useState(false);

  const { selectedLevelContext } = useSelected();
  const { selectedSubjectContext } = useSelected();
  const { setselectedModuleContext } = useSelected();

  const router = useRouter();

  // const fetchedview = async (moduleId: number) => {
  // 	try {
  // 		const result = await FetchWeekbyModuleid(moduleId);
  // 		console.log("Weeks for module", moduleId, ":", result.data);
  // 		console.log(result.data[0].weekName);
  // 	} catch (error) {
  // 		console.error("Error fetching weeks:", error);
  // 	}
  // };

  const {
    data: fetchedModules,
    isLoading,
    isError,
    error,
  } = useFetchModule(selectedLevelContext || 1);

  const {
    data: fetchedExtraResources,
    isLoading: isExtraResourceLoading,
    isError: isExtraResourceError,
    error: extraResourceError,
  } = useFetchExtraResources({});

  // const fetchExtraResources = async () => {
  // 	try {
  // 		setExtraResourcesLoading(true);
  // 		const token =
  // 			localStorage.getItem("token") || sessionStorage.getItem("token");

  // 		const res = await fetch(
  // 			"https://herald-hub-backend.onrender.com/extra-resources",
  // 			{
  // 				headers: { Authorization: `Bearer ${token}` },
  // 			}
  // 		);

  // 		const data = await res.json();
  // 		if (data?.data?.resources) {
  // 			// Only get first 3 resources
  // 			setExtraResources(data.data.resources.slice(0, 3));
  // 		} else {
  // 			setExtraResources([]);
  // 		}
  // 	} catch (error) {
  // 		console.error("Error fetching extra resources:", error);
  // 		setExtraResources([]);
  // 	} finally {
  // 		setExtraResourcesLoading(false);
  // 	}
  // };

  useEffect(() => {
    const handleScroll = () => {
      // Show only when user scrolls more than 300px down
      if (window.scrollY > 300) setShowScrollTop(true);
      else setShowScrollTop(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const StoredToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const RoleSelected =
      localStorage.getItem("Role") || sessionStorage.getItem("Role");
    if (RoleSelected !== "Student" || !StoredToken) {
      router.push("/");
    }

    setisChecked(true);

    // const fetchModuleData = async () => {
    // 	if (!selectedLevelContext) return;

    // 	setLoading(true);
    // 	try {
    // 		const fetched = await fetchModule(`${selectedLevelContext}`);
    // 		console.log("Fetched Modules:", fetched);
    // 		if (Array.isArray(fetched) && fetched.length > 0) {
    // 			setModules(fetched);
    // 		} else {
    // 			setModules([]);
    // 		}
    // 	} catch (err) {
    // 		console.error("Error fetching modules:", err);
    // 		setModules([]);
    // 	} finally {
    // 		setLoading(false);
    // 	}
    // };

    // fetchModuleData();
    // fetchExtraResources();
  }, [selectedLevelContext, selectedSubjectContext, router]);

  const handleSeeMoreClick = () => {
    router.push("/extra-resources");
  };

  return (
    <>
      {/* Scroll to Top Button (Mobile Only) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-5 right-4 z-50 bg-[#74BF44] text-white w-10 h-10 rounded-full shadow-md flex items-center justify-center text-lg md:hidden"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      {isChecked && (
        <div className="w-full items-center justify-center bg-[#F8F8F8]">
          <div className="container mx-auto px-4 py-[15px] flex flex-col md:gap-[clamp(40px,8vw,95px)] gap-[clamp(20px,5vw,40px)] items-center h-full mt-[100px]">
            {/* Header */}
            <div className="flex flex-col gap-3 items-center ">
              <div className="flex space-x-2 font-[300] md:text-[clamp(30px,5vw,50px)] text-[clamp(20px,4vw,30px)] md:flex-row flex-col items-center">
                <p className="text-[40px]">Welcome to</p>
                <p className="text-[#74BF44] font-[600] text-[40px]">
                  {" "}
                  HCK Core{" "}
                </p>
              </div>
              <div className="items-center flex justify-center">
                <p className="text-[#00000099] font-[400] text-[16px] text-center sm:text-[20px] mt-2 tracking-[0.2px]">
                  Explore academic resources organized by program, level, and
                  week
                </p>
              </div>
            </div>

            {/* Level Filter Section */}
            <div className="w-full flex flex-col items-center md:mb-4 mb-6 md:mt-[-60px] px-2 sm:px-4">
              <h1 className="font-[500] text-[18px] sm:text-[20px] text-gray-500 mb-2 text-center">
                Filter The Module by Level:
              </h1>
              <div className="flex justify-center w-full max-w-md">
                <LevelDropdown />
              </div>
            </div>

            {/* Modules List */}
            {isLoading && !isError && (
              <div className="flex flex-wrap gap-4 sm:gap-6 justify-center w-full">
                {[...Array(3)].map((_, i) => (
                  <ModuleBoxSkeleton key={i} />
                ))}
              </div>
            )}

            {isError && !isLoading && (
              <div className="flex justify-center items-center py-16">
                <p className="text-2xl font-semibold text-red-500">
                  {error.message}
                </p>
              </div>
            )}

            {!isError && !isLoading && fetchedModules?.length > 0 && (
              <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
                {fetchedModules.map((option: Module) => (
                  <ModuleBox
                    id={option.id}
                    key={option.id}
                    Title={option.name}
                    Subject={option.leader}
                    Level={option.level.name}
                    Description={option.description}
                    ResourcesContain={option.code}
                    onClick={() => {
                      console.log("selectedModuleId: ", option.id);
                      setselectedModuleContext(option.id);
                      router.push(`/programs/${option.id}`);

                      // fetchedview(option.id);
                    }}
                  />
                ))}
              </div>
            )}

            {!isLoading && !isError && fetchedModules?.length === 0 && (
              <div className="flex flex-col items-center text-center justify-center md:gap-[clamp(8px,2vw,16px)] gap-[clamp(4px,1.5vw,8px)] md:py-[clamp(20px,5vw,40px)] py-[clamp(12px,3vw,20px)]">
                <svg
                  width="74"
                  height="70"
                  viewBox="0 0 74 70"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M36.9748 18.3602C36.9748 14.6439 35.4985 11.0798 32.8707 8.45192C30.2428 5.82408 26.6787 4.34778 22.9624 4.34778H3.69531V55.1428H26.4655C29.2527 55.1428 31.9258 56.25 33.8967 58.2209C35.8676 60.1918 36.9748 62.8649 36.9748 65.6521M36.9748 18.3602V65.6521M36.9748 18.3602C36.9748 14.6439 38.4511 11.0798 41.079 8.45192C43.7068 5.82408 47.2709 4.34778 50.9872 4.34778H70.2543V55.1428H47.4841C44.6969 55.1428 42.0238 56.25 40.0529 58.2209C38.082 60.1918 36.9748 62.8649 36.9748 65.6521"
                    stroke="#000000"
                    strokeOpacity="0.25"
                    strokeWidth="7.00621"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-[24px] font-[500] text-[#74BF44]">
                  {" "}
                  No resources found{" "}
                </p>
                <p className="text-gray-500 font-[500] text-[18px]">
                  Try adjusting your filters to find relevant content.
                </p>
              </div>
            )}

            {/* Extra Learnings Section */}
            <div className="w-full mt-12 mb-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[28px] sm:text-[32px] font-[300] tracking-[1px] text-[#74BF44]">
                  Extra Learnings
                </h2>
                <button
                  onClick={handleSeeMoreClick}
                  className="text-[#74BF44] font-[500] text-[16px] cursor-pointer transition-colors "
                >
                  See More
                </button>
              </div>

              {isExtraResourceLoading && !isExtraResourceError && (
                <div className="flex flex-wrap gap-4 sm:gap-6 justify-center w-full">
                  {[...Array(3)].map((_, i) => (
                    <ExtraBoxSkeleton key={i} />
                  ))}
                </div>
              )}

              {isExtraResourceError && !isExtraResourceLoading && (
                <div className="flex justify-center items-center py-16">
                  <p className="text-xl font-semibold text-red-500">
                    {extraResourceError.message}
                  </p>
                </div>
              )}

              {!isExtraResourceError &&
                !isExtraResourceLoading &&
                fetchedExtraResources?.resources.length > 0 && (
                  <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
                    {fetchedExtraResources?.resources
                      .slice(0, 3)
                      .map((resource: ExtraResource) => (
                        <ExtraBox
                          key={resource.id}
                          Title={resource.title}
                          Subject={
                            Array.isArray(resource.keywords)
                              ? resource.keywords.join(", ")
                              : ""
                          }
                          Level={resource.category?.categoryName || "General"}
                          Description={resource.description}
                          ResourcesContain={
                            resource.files.length > 0
                              ? `${resource.files.length} file(s)`
                              : "No files"
                          }
                          onClick={() => window.open(resource.link, "_blank")}
                        />
                      ))}
                  </div>
                )}

              {!isExtraResourceLoading &&
                fetchedExtraResources?.resources.length === 0 && (
                  <div className="flex flex-col items-center text-center justify-center py-8">
                    <p className="text-[18px] font-[400] text-gray-500">
                      No extra learning resources available at the moment.
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
