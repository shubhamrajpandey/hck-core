"use client";
import ModeratorDashboardBox from "@/components/dashboard/AssignDashboard/assignDashbox";
import TopContributors from "@/components/dashboard/RecentActivity/TopContributors";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/services/axiosInstance";
import { Search } from "lucide-react";
import MostcontentRealModerator from "@/components/layout/ContentModule/mostcontentRealModerator";

type ModuleStats = {
  id: number;
  name: string;
  code: string;
  description: string;
  levelName: string;
  weeksCount: number;
  weekContentsCount: number;
  filesCount: number;
  moderatorsCount: number;
};

export default function DashBoard() {
  const [isChecked, setisChecked] = useState(false);
  const [modules, setModules] = useState<ModuleStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const itemsPerPage = 6;
  const router = useRouter();

  useEffect(() => {
    const StoredToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const RoleSelected =
      localStorage.getItem("Role") || sessionStorage.getItem("Role");

    if (RoleSelected !== "Moderator" || !StoredToken) {
      router.push("/");
    }
    setisChecked(true);

    const fetchModules = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get("/modules/stats?page=1&limit=50", {
          headers: {
            Authorization: `Bearer ${StoredToken}`,
          },
        });

        if (res.data?.data?.modules) {
          setModules(res.data.data.modules);
        } else if (Array.isArray(res.data?.data)) {
          setModules(res.data.data);
        } else if (Array.isArray(res.data)) {
          setModules(res.data);
        } else {
          console.error("Unexpected API response:", res.data);
          setModules([]);
        }
      } catch (err) {
        console.error("Error fetching modules stats:", err);
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [router]);

  const totalPages = Math.ceil(modules.length / itemsPerPage);
  const currentModules = modules.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  return (
    <>
      {isChecked && (
        <div className="h-screen w-full m-0 pt-[35px] gap-[80px] flex flex-col">
          <div className="items-center flex flex-col w-full gap-[70px]">
            <div className="flex flex-col gap-[1px] items-center">
              <div className="flex space-x-2 font-[300] md:text-[clamp(30px,5vw,40px)] text-[clamp(20px,4vw,30px)] md:flex-row flex-col items-center">
                <p>Welcome to</p>
                <p className="text-[#74BF44] font-[600]">HCK Core</p>
              </div>
              <div className="items-center flex justify-center">
                <p className="font-[400] md:text-[clamp(20px,2.5vw,20px)] text-[clamp(16px,2vw,20px)] text-[#00000080] text-center flex-wrap flex tracking-[0.2px] ">
                  Your comprehensive platform for educational resource
                  management
                </p>
              </div>
            </div>

            <div className="relative border border-gray-300 w-full max-h-[75px] h-[55px] max-w-[700px] bg-white rounded-lg items-center flex shadow-[0_1px_1px_#00000073] mt-[-30px]">
              <span className="absolute inset-y-0 left-[16px] flex items-center">
                <Search className="w-5 h-5 text-gray-500" />
              </span>
              <input
                type="search"
                placeholder="Search"
                className="w-full pl-[50px] border-none outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[50px] px-4 md:px-8 flex-1">
            <div className="flex flex-col gap-[30px]">
              <h1 className="text-[#000000BF] text-[clamp(20px,4vw,25px)] font-[500]">
                Module{" "}
                <span className="text-[#74BF44] font-[600]">Overview</span>
              </h1>

              <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  Array.from({ length: itemsPerPage }).map((_, i) => (
                    <div
                      key={i}
                      className="p-4 border border-gray-300 rounded-lg shadow-md bg-white animate-pulse w-full sm:w-[350px] md:w-[400px] lg:w-[430px] h-[250px]"
                    ></div>
                  ))
                ) : currentModules.length > 0 ? (
                  currentModules.map((mod) => (
                    <ModeratorDashboardBox
                      key={mod.id}
                      title={mod.name}
                      level={mod.levelName}
                      subject={"Computer Science"}
                      WeekNo={mod.weeksCount}
                      ContentsNo={mod.weekContentsCount}
                      filesNo={mod.filesCount}
                      LinksNo={mod.moderatorsCount}
                      SubjectCode={mod.code}
                    />
                  ))
                ) : (
                  <p className="text-gray-600"> No modules found.</p>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                  <button
                    onClick={handlePrev}
                    disabled={page === 0}
                    className="px-3 py-1 text-gray-700 border border-gray-300 rounded disabled:opacity-40"
                  >
                    &lt;
                  </button>
                  <span className="text-gray-700 font-medium">
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={page === totalPages - 1}
                    className="px-3 py-1 text-gray-700 border border-gray-300 rounded disabled:opacity-40"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-24 mt-6 mb-14">
              <MostcontentRealModerator />

              <TopContributors
                
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
