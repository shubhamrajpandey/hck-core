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
    <div className="w-[430px] h-auto p-[33px] border border-gray-300 flex flex-col rounded-lg gap-[32px] bg-white shadow-[0.531px_2.124px_3.186px_1.062px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-[30px]">
        <section className="flex flex-col gap-[15px]">
          <span className="text-[#000000BF]  text-[22px] font-[600] truncate">
            {title}
          </span>
          <div className="flex space-x-[19px]">
            <span className="text-[16px] font-[400] tracking-[-0.1px] text-[#000000BF] ">
              {level}
            </span>
            <span className="text-[16px] font-[400] tracking-[-0.1px] text-[#000000BF]">
              ● {subject}
            </span>
          </div>
        </section>

        <section className="flex flex-row gap-[20px] pr-[10%] justify-between items-center">
          <div className="flex flex-col gap-[25px]">
            <span className="flex space-x-[10px] items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.75 24H2.25C1.005 24 0 22.995 0 21.75V3.75C0 2.505 1.005 1.5 2.25 1.5H21.75C22.995 1.5 24 2.505 24 3.75V21.75C24 22.995 22.995 24 21.75 24Z"
                  fill="black"
                  fillOpacity="0.65"
                />
              </svg>
              <span className="text-[#000000BF] font-400 text-[18px]">
                {WeekNo} Weeks
              </span>
            </span>
            <span className="flex space-x-[10px] items-center">

              <svg
                width="20"
                height="24"
                viewBox="0 0 20 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.0836 7.9032L11.6484 0.3516C11.5461 0.252998 11.427 0.173361 11.2968 0.1164C11.2608 0.0995999 11.2224 0.0899999 11.184 0.0767999C11.0836 0.0427556 10.979 0.0221765 10.8732 0.0156C10.848 0.0132 10.8252 0 10.8 0H2.4C1.0764 0 0 1.0764 0 2.4V21.6C0 22.9236 1.0764 24 2.4 24H16.8C18.1236 24 19.2 22.9236 19.2 21.6V8.4C19.2 8.3748 19.1868 8.352 19.1844 8.3256C19.1778 8.21975 19.1572 8.11524 19.1232 8.0148C19.112 7.9764 19.0988 7.9392 19.0836 7.9032Z"
                  fill="black"
                  fillOpacity="0.55"
                />
              </svg>
              <span className="text-[#000000BF] font-400 text-[18px]">
                {filesNo} files
              </span>
            </span>
          </div>

          <div className="flex flex-col gap-[25px]">
            <span className="flex space-x-[10px] items-center">
              <svg
                width="24"
                height="22"
                viewBox="0 0 24 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5.44444V21M12 5.44444C12 4.2657 11.5364 3.13524 10.7113 2.30175C9.88611 1.46825 8.76695 1 7.6 1H2.1C1.80826 1 1.52847 1.11706 1.32218 1.32544C1.11589 1.53381 1 1.81643 1 2.11111V16.5556C1 16.8502 1.11589 17.1329 1.32218 17.3412C1.52847 17.5496 1.80826 17.6667 2.1 17.6667H8.7C9.57521 17.6667 10.4146 18.0179 11.0335 18.643C11.6523 19.2681 12 20.1159 12 21"
                  stroke="black"
                  strokeOpacity="0.65"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[#000000BF] font-400 text-[18px]">
                {ContentsNo} Contents
              </span>
            </span>
            <span className="flex space-x-[10px] items-center">

              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.1429 4.14286L14.4286 1.85714C15.5714 0.714286 17.8571 0.714286 19 1.85714L20.1429 3C21.2857 4.14286 21.2857 6.42857 20.1429 7.57143L14.4286 13.2857C13.2857 14.4286 11 14.4286 9.85714 13.2857M9.85714 17.8571L7.57143 20.1429C6.42857 21.2857 4.14286 21.2857 3 20.1429L1.85714 19C0.714286 17.8571 0.714286 15.5714 1.85714 14.4286L7.57143 8.71429C8.71429 7.57143 11 7.57143 12.1429 8.71429"
                  stroke="black"
                  strokeOpacity="0.65"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[#000000BF] font-400 text-[18px]">
                {LinksNo} Links
              </span>
            </span>
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-[17px]">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-[#74BF44] text-[20px] font-[400]">
          {SubjectCode}
        </span>
      </div>
    </div>
  );
}
