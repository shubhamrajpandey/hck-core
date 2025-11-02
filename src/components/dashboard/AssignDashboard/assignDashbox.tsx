"use client";

type Properties = {
  title: string;
  level: string;
  subject: string;
  WeekNo: number;
  ContentsNo: number;
  filesNo: number;
  LinksNo: number;
  SubjectCode: string;
};

export default function ModeratorDashboardBox({
  title,
  level,
  subject,
  WeekNo,
  ContentsNo,
  filesNo,
  LinksNo,
  SubjectCode,
}: Properties) {
  return (
    <div className="w-[430px] bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 truncate">{title}</h2>
        <p className="text-gray-500 text-sm mt-1 flex gap-2">
          <span>{level}</span>
          <span>• {subject}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-gray-600 font-medium">Weeks</span>
          <span className="text-gray-800 font-semibold">{WeekNo}</span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-gray-600 font-medium">Files</span>
          <span className="text-gray-800 font-semibold">{filesNo}</span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-gray-600 font-medium">Contents</span>
          <span className="text-gray-800 font-semibold">{ContentsNo}</span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-gray-600 font-medium">Links</span>
          <span className="text-gray-800 font-semibold">{LinksNo}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-4">
        <span className="text-[#74BF44] font-semibold text-lg">{SubjectCode}</span>
      </div>
    </div>
  );
}
