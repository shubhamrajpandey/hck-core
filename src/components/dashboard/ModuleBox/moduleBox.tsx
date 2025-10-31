"use client";

type ModuleBoxProps = {
	id?: number;
	Title: string;
	Subject: string;
	Level: string;
	Description: string;
	ResourcesContain?: string;
	onClick: () => void;
};

export default function ModuleBox({
	Title,
	Subject,
	Level,
	Description,
	ResourcesContain,
	onClick,
}: ModuleBoxProps) {
	return (
		<div
			className="border border-[#002FFF4D] rounded-lg p-[clamp(1rem,2vw,1.5rem)] sm:p-[clamp(0.75rem,3vw,1rem)] bg-white hover:border-[#002FFF4D] transition-all
        w-full sm:max-w-[48%] lg:max-w-[32%]
        h-auto sm:min-h-[200px] md:h-[390px] cursor-pointer group ring ring-[#00000028] hover:shadow-[2px_3px_10px_rgba(0,0,0,0.5),_-1px_-1px_3px_rgba(0,0,0,0.1)]"
			onClick={onClick}>
			<div className="flex flex-col w-full h-full justify-between px-[clamp(1rem,2vw,1.25rem)] py-[clamp(0.75rem,1.5vw,1rem)] sm:py-[clamp(0.5rem,2vw,0.75rem)]">
				<div className="flex flex-col md:gap-[clamp(1rem,3vw,30px)] gap-[clamp(0.5rem,1.5vw,12px)] sm:gap-[clamp(0.75rem,2vw,20px)]">
					<div className="flex items-center justify-between md:text-[clamp(14px,1.5vw,18px)] text-[12px] sm:text-[clamp(12px,2vw,14px)] font-[300] text-[#000000CC]">
						<span className="truncate overflow-hidden whitespace-nowrap max-w-[60%]">
							{Subject}
						</span>

						<span className="border px-[clamp(0.5rem,1vw,0.75rem)] md:px-[clamp(0.75rem,1.5vw,1rem)] md:py-[clamp(0.4rem,1vw,0.5rem)] py-[clamp(0.2rem,1vw,0.3rem)] rounded-lg bg-[#74BF44] text-white font-semibold text-[10px] sm:text-[clamp(12px,1vw,14px)]">
							{Level}
						</span>
					</div>

					<div className="flex flex-col md:gap-[clamp(16px,2.2vw,22px)] gap-[clamp(8px,1.5vw,14px)]">
						<div className="flex items-center md:space-x-[clamp(20px,3vw,35px)] space-x-[clamp(8px,1.5vw,12px)]">
							<div className="md:py-[clamp(10px,1.5vw,14px)] py-[clamp(5px,1.5vw,8px)] md:px-[clamp(12px,2vw,17px)] px-[clamp(6px,1.5vw,10px)] rounded-lg bg-[#fbfbfb8f] ring ring-[#68686820]">
								<svg
									width="24"
									height="14"
									viewBox="0 0 24 14"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M7.33301 14L0.333008 7L7.33301 0L8.99551 1.6625L3.62884 7.02917L8.96634 12.3667L7.33301 14ZM16.6663 14L15.0038 12.3375L20.3705 6.97083L15.033 1.63333L16.6663 0L23.6663 7L16.6663 14Z"
										fill="#002FFF"
									/>
								</svg>
							</div>
							<p className="text-[#000] font-[500] text-[clamp(0.9rem,2vw,1.25rem)] line-clamp-2 break-words">
								{Title}
							</p>
						</div>
						<p className="text-gray-700 font-[400] text-[clamp(0.8rem,1.8vw,1.125rem)] line-clamp-4">
							{Description}
						</p>
					</div>
				</div>
				<div className="mt-2">
					<div className="flex items-center text-[#000000CC] justify-between md:text-[clamp(13px,1.6vw,16px)] text-[11px] sm:text-[clamp(11px,1.4vw,14px)] font-[300]">
						<span className="text-gray-600">{ResourcesContain}</span>
						<button className="flex md:space-x-[clamp(8px,1vw,12px)] space-x-[clamp(4px,1vw,6px)] items-center justify-center cursor-pointer">
							<span className="text-[#74BF44] font-[600] md:text-[clamp(12px,1.4vw,15px)] text-[10px] sm:text-[clamp(10px,1vw,12px)]">
								Explore
							</span>
							<svg
								width="22"
								height="21"
								viewBox="0 0 22 21"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M19.1564 10.2346C19.3126 10.0783 19.4004 9.86636 19.4004 9.64539C19.4004 9.42442 19.3126 9.21249 19.1564 9.05622L14.4422 4.34205C14.3654 4.26246 14.2734 4.19898 14.1717 4.1553C14.0701 4.11163 13.9607 4.08864 13.8501 4.08768C13.7394 4.08672 13.6297 4.1078 13.5273 4.1497C13.4249 4.1916 13.3318 4.25348 13.2536 4.33172C13.1753 4.40997 13.1135 4.50301 13.0716 4.60542C13.0297 4.70784 13.0086 4.81757 13.0095 4.92822C13.0105 5.03887 13.0335 5.14822 13.0772 5.24989C13.1208 5.35156 13.1843 5.44351 13.2639 5.52039L16.5556 8.81205L0.833256 8.81214C0.612242 8.81214 0.400278 8.89994 0.243999 9.05622C0.0877187 9.2125 -7.84875e-05 10.6351 -7.84442e-05 9.64548C-7.84539e-05 9.86649 0.0877187 10.0785 0.243999 10.2347C0.400278 10.391 0.612241 10.4788 0.833255 10.4788L16.5556 10.4787L13.2639 13.7704C13.1121 13.9276 13.0281 14.1381 13.03 14.3566C13.0319 14.5751 13.1195 14.7841 13.2741 14.9386C13.4286 15.0931 13.6376 15.1807 13.8561 15.1826C14.0746 15.1845 14.2851 15.1005 14.4422 14.9487L19.1564 10.2346Z"
									fill="#74BF44"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
