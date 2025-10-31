import React from "react";

type ButtonType = {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

type ExtraBoxProps = {
  title: string;
  description: string;
  buttons?: ButtonType[];
};

const ExtraBox: React.FC<ExtraBoxProps> = ({ title, description, buttons }) => {
  return (
    <div>
      <p className='text-[#686868] font-[500] mb-6 hover:text-[#74BF44]'>{title}</p>
      <div className=" w-[1270px] h-[210px] rounded-[15px] border-1 p-4 bg-gray-50 space-y-4 hover:border-[#74BF44] hover:border-2">
        <p className="text-[18px] text-gray-700 ml-30 py-6">{description}</p>
        <div className="flex gap-8 px-30">
          {buttons?.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.onClick}
              className="inline-flex items-center px-3 py-1.5 bg-white text-sm border border-gray-300 rounded-md hover:bg-[#74BF44] cursor-pointer transition"
            >
              {btn.icon}
              <span className="ml-1">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExtraBox;
