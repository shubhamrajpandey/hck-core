"use client";
import ResourcesContent from "@/components/dashboard/ResourcesContent/resourcesContent";
import { useEffect, useState } from "react";
import { useSelected } from "@/context/selectedContext";
import FetchResourcesSlidebar from "@/services/resources.service";
import { useRouter } from "next/navigation";

type Resource = {
  id: number;
  title: string;
  content: string;
  createdBy: {
    id: number;
    username: string;
    role: {
      id: 0;
      name: "";
      description: "";
    };
  };
  week: {
    weekId: number;
    weekName: string;
    module: {
      id: number;
      name: string;
      code: string;
      leader: string;
      level: { id: number; name: string };
    };
  };
  files: {
    fileId: number;
    fileName: string;
    filePath: string;
  }[];
  links: {
    id: number;
    linkName: string;
    linkUrl: string;
  }[];
  createdAt: string;
};

type FetchResponse = {
  data: Resource[];
  message: string;
};

export default function Resources() {
  const { selectedWeekContext } = useSelected();
  const [resources, setResources] = useState<Resource[]>([]);
  const router = useRouter();
  const [isChecked, setisChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 3;

  useEffect(() => {
    const StoredToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const RoleSelected =
      localStorage.getItem("Role") || sessionStorage.getItem("Role");
    if (RoleSelected !== "Student" || !StoredToken) {
      router.push("/");
    }
    setisChecked(true);
    const fetchModuleData = async () => {
      try {
        if (!selectedWeekContext) return;

        const fetched: FetchResponse = await FetchResourcesSlidebar(
          `${selectedWeekContext}`
        );
        console.log("Fetched Resources:", fetched);

        if (Array.isArray(fetched)) {
          setResources(fetched);
        } else if (fetched && Array.isArray(fetched.data)) {
          setResources(fetched.data);
        } else {
          setResources([]);
        }
      } catch (err) {
        console.error("Error fetching modules:", err);
        setResources([]);
      }
    };

    fetchModuleData();
  }, [selectedWeekContext, router]);
  const indexOfLast = currentPage * resourcesPerPage;
  const indexOfFirst = indexOfLast - resourcesPerPage;
  const currentResources = resources.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(resources.length / resourcesPerPage);

  return (
    <>
      {isChecked && (
        <div className="mt-[50px] min-w-full sm:items-center">
          <div className="flex flex-col gap-5 w-full">
            {currentResources.length > 0 ? (
              currentResources.map((week: Resource, index: number) => (
                <ResourcesContent
                  key={index}
                  title={week.title}
                  detail={{
                    submittedBy: week.createdBy.username,
                    role: week.createdBy.role?.name || "Unknown",
                    subject: week.week.module.name,
                    level4: week.week.module.level.name,
                  }}
                  type={[{ values: "Frontend" }, { values: "JavaScript" }]}
                  description={week.content}
                  attachments={{
                    documents: week.files,
                    links: week.links,
                  }}
                />
              ))
            ) : (
              <div>No resources found.</div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {/* Prev button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded bg-gray-200 disabled:opacity-50`}
              >
                Prev
              </button>
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              {/* next page */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded bg-gray-200 disabled:opacity-50`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
