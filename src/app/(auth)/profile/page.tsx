"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
// import { axiosInstance } from "@/services/axiosInstance";
import { useGetFaculty } from "@/services/modules.service";
import ProfileLoading from "./ProfileLoading";

interface StudentInfo {
  id: number;
  email: string;
  facultyId: number;
  role: string;
}

// interface Faculty {
// 	id: number;
// 	name: string;
// }

export default function Profile() {
  const router = useRouter();
  const [isChecked, setisChecked] = useState(false);
  const [student, setStudent] = useState<StudentInfo | null>(null);
  // const [faculty, setFaculty] = useState<Faculty | null>(null);

  const { data: studentFaculty, error, isError, isLoading } = useGetFaculty();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const role = localStorage.getItem("Role") || sessionStorage.getItem("Role");

    if (role !== "Student" || !token) {
      router.push("/");
      return;
    }
    setisChecked(true);

    const email =
      localStorage.getItem("email") || sessionStorage.getItem("email");
    const facultyId =
      localStorage.getItem("facultyId") || sessionStorage.getItem("facultyId");
    const id = localStorage.getItem("id") || sessionStorage.getItem("id");

    if (email && facultyId && id) {
      setStudent({
        id: Number(id),
        email,
        facultyId: Number(facultyId),
        role: "Student",
      });
    }

    // const fetchStudentInfo = async () => {
    // 	try {
    // 		if (facultyId && token) {
    // ✅ Fetch faculties with Authorization header
    // const facultyRes = await axiosInstance.get("/student/faculty", {
    // 	headers: {
    // 		Authorization: `Bearer ${token}`,
    // 	},
    // });
    // console.log(facultyRes);
    // const facultyList: Faculty[] = facultyRes.data;
    // const matchedFaculty = facultyList.find(
    // 	(f) => f.id === Number(facultyId)
    // );
    // console.log("Matched Faculty:", matchedFaculty);
    // if (matchedFaculty) setFaculty(matchedFaculty);
    // ✅ Alternative: If your backend has /faculty/:id endpoint
    // const facultyRes = await axiosInstance.get(`/faculty/${facultyId}`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // setFaculty(facultyRes.data);

    // 			setFaculty(studentFaculty || null);
    // 		}
    // 	} catch (error) {
    // 		console.error("Error fetching student profile:", error);
    // 		throw new Error("Something went wrong");
    // 	} finally {
    // 		setisChecked(true);
    // 	}
    // };

    // fetchStudentInfo();
  }, [router]);

  // Loader / Error UI
  if (isLoading) return <ProfileLoading />;
  if (isError)
    return (
      <p className="mt-[90px]">
        {error.message || "Failed to load faculty info"}
      </p>
    );

 

  return (
    <>
      {isChecked && (
        <div className="flex flex-col items-center min-h-screen w-full bg-[#F8F8F8] px-4 sm:px-6 lg:px-8 mt-[90px]">
          {/* Header */}
          <div className="mt-20 w-full text-center flex flex-col">
            <h1 className="text-[28px] sm:text-[35px] text-[#74BF44] font-[500] mb-4 tracking-[1.3px]">
              Profile
            </h1>
            <p className="text-[#00000099] font-[400] text-[15px] sm:text-[20px] tracking-[0.2px]">
              Manage your account and view your activity
            </p>
          </div>

          {/* Activity Summary */}
          <div className="mt-12 order-2 sm:order-1 w-full max-w-4xl bg-white rounded-md shadow-md p-6 sm:p-10">
            <h2 className="text-[20px] sm:text-[24px] text-[#74BF44] font-[500] mb-8">
              Activity Summary
            </h2>
            <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-0">
              {/* Submitted */}
              <div className="flex flex-col items-center gap-3 flex-1">
                <div className="w-14 h-14 flex items-center justify-center bg-[#F5F5F5] rounded-lg shadow-sm">
                  <Image
                    src="/imgs/icons/submitted.svg"
                    alt="Submitted Icon"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="text-[32px] sm:text-[40px] font-light">3</p>
                <span className="text-[#00000099] text-[16px] sm:text-[19px] font-[400] text-center">
                  Resource Submitted
                </span>
              </div>

              {/* Approved */}
              <div className="flex flex-col items-center gap-3 flex-1">
                <div className="w-14 h-14 flex items-center justify-center bg-[#E9F7EC] rounded-lg shadow-sm">
                  <Image
                    src="/imgs/icons/approved.svg"
                    alt="Approved Icon"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="text-[32px] sm:text-[40px] text-[#74BF44] font-light">
                  2
                </p>
                <span className="text-[#00000099] text-[16px] sm:text-[19px] font-[400] text-center">
                  Resources Approved
                </span>
              </div>

              {/* Rejected */}
              <div className="flex flex-col items-center gap-3 flex-1">
                <div className="w-14 h-14 flex items-center justify-center bg-[#FDEDED] rounded-lg shadow-sm">
                  <Image
                    src="/imgs/icons/rejected.svg"
                    alt="Rejected Icon"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="text-[32px] sm:text-[40px] text-[#FF6262] font-light">
                  1
                </p>
                <span className="text-[#00000099] text-[16px] sm:text-[19px] font-[400] text-center">
                  Resources Rejected
                </span>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-10 order-1 sm:order-2 w-full max-w-4xl bg-white rounded-md shadow-md p-6 sm:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 sm:gap-0">
            <div className="space-y-6 w-full sm:w-auto">
              <h2 className="text-[20px] sm:text-[24px] text-[#74BF44] font-[500] mb-8">
                Account Information
              </h2>

              {/* Name */}
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-[#E9F7EC] rounded-lg">
                  <Image
                    src="/imgs/icons/user.svg"
                    alt="User Icon"
                    width={22}
                    height={22}
                  />
                </div>
                <div className="ml-2 sm:ml-4">
                  <p className="text-[15px] text-[#00000099] font-[300]">
                    Name
                  </p>
                  <p className="text-base">
                    {student ? student.email.split("@")[0] : "Loading..."}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-[#F5F5F5] rounded-lg">
                  <Image
                    src="/imgs/icons/email.svg"
                    alt="Email Icon"
                    width={22}
                    height={22}
                  />
                </div>
                <div className="ml-2 sm:ml-4">
                  <p className="text-[15px] text-[#00000099] font-[300]">
                    Email
                  </p>
                  <p className="text-base break-words">
                    {student?.email || "Loading..."}
                  </p>
                </div>
              </div>

              {/* Program */}
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-[#E9F7EC] rounded-lg">
                  <Image
                    src="/imgs/icons/program.svg"
                    alt="Program Icon"
                    width={22}
                    height={22}
                  />
                </div>
                <div className="ml-2 sm:ml-4">
                  <p className="text-[15px] text-[#00000099] font-[300]">
                    Program
                  </p>
                  <p className="text-base">
                    {studentFaculty?.name || "Loading..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
