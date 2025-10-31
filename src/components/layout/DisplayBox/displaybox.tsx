type DisplayBoxProps = {
  image: React.ReactNode;
  title: string;
  value: number;
};

export default function DisplayBox({ image, title, value }: DisplayBoxProps) {
  return (
    <div className="group w-[305px] h-[180px] pt-[16px] pr-[48px] pb-[22px] pl-[20px] hover:scale-99 hover:border-[#74BF44] hover:border-1 shadow-sm rounded-xl shadow-gray-400">
      <div className="flex flex-col p-[5px] gap-[32px]">
        <div className="flex space-x-[8px] items-center justify-start">
          <div className="bg-[#74BF44] rounded-full items-center justify-center p-3 w-fit h-fit">
            {image}
          </div>
          <span className="group font-[500] text-[18px] group-hover:text-[17px]">
            {title}
          </span>
        </div>
        <span className="group text-[37px] font-[400] group-hover:text-[36px] mb-[5px]">
          {value}
        </span>
      </div>
    </div>
  );
}
