"use client";

import ModeratorLevel from "@/components/dropdown/ModeratorLevel";
import ModeratorProgram from "@/components/dropdown/ModeratorProgram";
import RichTextEditor from "@/components/layout/RichTextEditor/RichTextEditor";
import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { File, Link, Download, X } from "lucide-react";
import { useRouter } from "next/navigation";
import CategoryDropDown from "@/components/dropdown/ResourceCategory";
import ResourceTypeDropdown from "@/components/dropdown/ResourceTypeDropdown";
import { axiosInstance } from "@/services/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { useSelected } from "@/context/selectedContext";
import RealModeratorModule from "@/components/ModeratorDropdown/RealmoderatorModule";
import RealModeratorWeekDropdown from "@/components/ModeratorDropdown/realmoderatorweekdropdown";

type FormData = {
  topic: string;
  description: string;
  tag: string;
};

interface ExtraResourceFormData {
  topic: string;
  tag?: string;
}

function Page() {
  const router = useRouter();
  const [isChecked, setisChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { selectedWeekContext } = useSelected();

  useEffect(() => {
    const StoredToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const RoleSelected =
      localStorage.getItem("Role") || sessionStorage.getItem("Role");
    if (RoleSelected !== "Moderator" || !StoredToken) {
      router.push("/");
    }
    setisChecked(true);
  }, [router]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [description, setDescription] = useState<string>("");

  const [resourceType, setResourceType] = useState<"normal" | "extra">(
    "normal"
  );

  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(
    null
  );
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const [externalLinks, setExternalLinks] = useState<string[]>([]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [newLink, setNewLink] = useState("");

  const handleAddLinkClick = () => {
    setShowLinkInput(true);
    setNewLink("");
  };

  const handleSaveLink = () => {
    if (newLink.trim() !== "") {
      setExternalLinks((prev) => [...prev, newLink.trim()]);
    }
    setShowLinkInput(false);
  };

  const handleCancelLink = () => {
    setShowLinkInput(false);
  };

  const handleRemoveLink = (index: number) => {
    setExternalLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ExtraResourceFormData) => {
    if (submitting) return;
    setSubmitting(true);

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (resourceType === "extra") {
      const toastId = toast.loading("Creating extra resource...");
      try {
        const formData = new FormData();
        formData.append("extraResourceTitle", data.topic);
        formData.append("extraResourceDescription", description);
        formData.append("link", externalLinks.join(","));
        formData.append("categoryId", selectedCategory || "");
        formData.append("keywords", data.tag || "");
        files.forEach((file) => formData.append("files", file));

        await axiosInstance.post("/extra-resources", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Extra resource created successfully!", { id: toastId });
      } catch (err) {
        toast.error("Failed to create extra resource", { id: toastId });
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    } else {
      const toastId = toast.loading("Creating normal resource...");
      try {
        if (!selectedWeekContext) {
          toast.error("Please select or create a week first", { id: toastId });
          setSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append("contentTitle", data.topic);
        formData.append("weekContent", description);
        formData.append("weekId", selectedWeekContext.toString());

        externalLinks.forEach((url, idx) => {
          formData.append("linkNames", `Link ${idx + 1}`);
          formData.append("linkUrls", url);
        });

        files.forEach((file) => formData.append("files", file));

        await axiosInstance.post("/week-contents", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Normal resource created successfully!", { id: toastId });
      } catch (err) {
        toast.error("Failed to create normal resource", { id: toastId });
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    }

    setValue("topic", "");
    setValue("tag", "");
    setDescription("");
    setFiles([]);
    setExternalLinks([]);
    setSelectedCategory(null);
    setSelectedFacultyId(null);
    setSelectedLevelId(null);
    setSelectedModuleId(null);
  };

  if (!isChecked) return null;

  return (
    <div className="px-8">
      <Toaster position="top-center" reverseOrder={false} />
      {isChecked && (
        <div className="">
          <div className="mt-8">
            <h1 className="text-[26px] font-[500] ">
              Create{" "}
              <span className="text-[#74BF44] font-[600]">New Resource</span>
            </h1>
            <p className="text-[18px] font-[400] text-gray-500 tracking-[-0.2px] mt-2">
              Add educational resources to help students learn effectively
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-9 w-full max-w-[1423px] bg-white rounded-[7px] border border-gray-300 shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-10"
          >
            <div className="space-y-1 mt-10">
              <label className="text-[17px] font-[400] text-gray-700 ">
                Topic <span className="text-red-600">*</span>
              </label>
              <input
                {...register("topic", { required: "Topic is required" })}
                type="text"
                placeholder="Enter resource topic/title"
                className="w-full rounded-[7px] mt-3 border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#74BF44]"
              />
              {errors.topic && (
                <p className="text-red-500 text-sm">{errors.topic.message}</p>
              )}
            </div>

            <div className="mt-6">
              <label className="text-[17px] font-[400] text-gray-700 ">
                Resource Type <span className="text-red-600">*</span>
              </label>
              <ResourceTypeDropdown
                resourceType={resourceType}
                setResourceType={setResourceType}
              />
            </div>

            {resourceType === "normal" ? (
              <div className="py-10 flex flex-col lg:flex-row lg:space-x-10 space-y-6 lg:space-y-0">
                {/* Program */}
                <div className="flex flex-col flex-1">
                  <label className="text-[17px] font-[400] text-gray-700">
                    Program <span className="text-red-600">*</span>
                  </label>
                  <ModeratorProgram
                    selectedFacultyId={selectedFacultyId}
                    setSelectedFacultyId={setSelectedFacultyId}
                  />
                </div>

                <div className="flex flex-col lg:flex-row flex-1 gap-6">
                  <div className="flex flex-col flex-1">
                    <label className="text-[17px] font-[400] text-gray-700">
                      Level <span className="text-red-600">*</span>
                    </label>
                    <ModeratorLevel
                      selectedFacultyId={selectedFacultyId}
                      selectedLevelId={selectedLevelId}
                      setSelectedLevelId={setSelectedLevelId}
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <label className="text-[17px] font-[400] text-gray-700">
                      Module <span className="text-red-600">*</span>
                    </label>
                    <RealModeratorModule
                      selectedModuleId={selectedModuleId}
                      setSelectedModuleId={setSelectedModuleId}
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex flex-col gap-3">
                      <span>
                        Weeks <span className="text-red-600">*</span>
                      </span>
                      <RealModeratorWeekDropdown
                        ParameterModuleId={selectedModuleId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-10 flex flex-col">
                <label className="text-[17px] font-[400] text-gray-700 ">
                  Category <span className="text-red-600">*</span>
                </label>
                <CategoryDropDown
                  selectedCategoryId={
                    selectedCategory ? parseInt(selectedCategory) : null
                  }
                  setSelectedCategoryId={(id) =>
                    setSelectedCategory(id?.toString() ?? null)
                  }
                />
              </div>
            )}

            <div>
              <div className="flex flex-col">
                <label className="text-[17px] font-[400] text-gray-700 ">
                  Language/Tag
                </label>
                <input
                  {...register("tag")}
                  type="text"
                  className="w-full rounded-[7px] mt-3 border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#74BF44]"
                />
              </div>
            </div>

            <div className="space-y-1 py-10">
              <label className="text-[17px] font-[400] text-gray-700">
                Description <span className="text-red-600">*</span>
              </label>
              <RichTextEditor
                value={description}
                onChange={(val) => {
                  setDescription(val);
                  setValue("description", val);
                }}
              />
            </div>
            <div className="mt-9 w-full max-w-[1423px] bg-white rounded-[7px] border border-gray-300 shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-10">
              <h1 className="text-[25px] font-[600] tracking-[0.5px] text-gray-800 mb-1">
                Attachments <span className="text-red-600">*</span>
              </h1>
              <h1 className="text-[18px] font-[400] text-gray-500 tracking-[-0.2px] mt-2">
                Upload multiple files and add multiple external links to support
                your resource
              </h1>

              <div className="flex justify-between items-center mt-8 mb-6">
                <h1 className="text-[20px] font-[500] tracking-[-0.2px]">
                  Files ({files.length})
                </h1>
                <button
                  type="button"
                  onClick={handleAddFileClick}
                  className="flex items-center gap-4 w-[200px] h-[40px] rounded-[7px] text-[15px] font-[600] text-gray-600 border border-gray-400 px-4 hover:bg-[#6868681A] cursor-pointer"
                >
                  <File size={14} />
                  Add Another File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
              </div>

              {files.length === 0 ? (
                <div className="border border-dashed border-gray-400 rounded-[7px] h-[360px] flex flex-col items-center justify-center text-gray-500">
                  <File size={70} />
                  <p className="mt-5 text-[22px] text-gray-400 font-[400]">
                    No files added yet
                  </p>
                  <button
                    type="button"
                    onClick={handleAddFileClick}
                    className="mt-4 w-[240px] h-[40px] rounded-[7px] border border-gray-400 text-[16px] font-[600] text-gray-600 tracking-[0.2px] cursor-pointer hover:bg-[#6868681A] flex items-center justify-center"
                  >
                    <span className="text-[25px] mr-4">+</span> Add Your First
                    File
                  </button>
                </div>
              ) : (
                <div className="border border-dashed border-gray-400 rounded-[7px] p-4">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b py-2"
                    >
                      <span className="text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center mt-10 mb-6">
                <h1 className="text-[20px] font-[500] tracking-[-0.2px]">
                  External Links ({externalLinks.length})
                </h1>
                <button
                  type="button"
                  onClick={handleAddLinkClick}
                  className="flex items-center gap-4 w-[200px] h-[40px] rounded-[7px] text-[15px] font-[600] text-gray-600 border border-gray-400 px-4 hover:bg-[#6868681A] cursor-pointer"
                >
                  <Link size={14} />
                  Add Another Link
                </button>
              </div>

              {externalLinks.length === 0 && !showLinkInput && (
                <div className="border border-dashed border-gray-400 rounded-[7px] h-[360px] flex flex-col items-center justify-center text-gray-500">
                  <Link size={70} />
                  <p className="mt-5 text-[22px] text-gray-400 font-[400]">
                    No external links added yet
                  </p>
                  <button
                    type="button"
                    onClick={handleAddLinkClick}
                    className="mt-4 w-[240px] h-[40px] rounded-[7px] border border-gray-400 text-[16px] font-[600] text-gray-600 tracking-[0.2px] cursor-pointer hover:bg-[#6868681A] flex items-center justify-center"
                  >
                    <span className="text-[25px] mr-4">+</span> Add Your First
                    Link
                  </button>
                </div>
              )}

              {showLinkInput && (
                <div className="border border-dashed border-gray-400 rounded-[7px] h-[360px] flex flex-col items-center justify-center text-gray-500 p-6">
                  <input
                    type="text"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    placeholder="Enter external link"
                    className="w-full rounded-[7px] border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#74BF44] mb-4"
                  />
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleSaveLink}
                      className="w-[100px] h-[40px] rounded-[7px] bg-[#74BF44] text-white font-[600]"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelLink}
                      className="w-[100px] h-[40px] rounded-[7px] border border-gray-400 font-[600]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {externalLinks.length > 0 && (
                <div className="border border-dashed border-gray-400 rounded-[7px] p-4">
                  {externalLinks.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b py-2"
                    >
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {link}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-baseline gap-6 py-10 ml-[123vh]">
              <button
                type="submit"
                disabled={submitting}
                className={`flex items-center justify-center text-[16px] font-[600] w-[200px] h-[44px] rounded-[7px] text-white border border-[#68686873] bg-[#74BF44] cursor-pointer ${
                  submitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Download className="mr-2" size={20} />
                {submitting ? "Creating..." : "Create Resource"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Page;
