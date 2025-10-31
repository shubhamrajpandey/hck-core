import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaGithub } from "react-icons/fa";
import { LiaLinkedin } from "react-icons/lia";

export default function Footer() {
	return (
		<footer className="bg-[#FDFDFD] text-[#000000CC] border-t border-gray-200">
			{/* container */}
			<div className="max-w-[1730px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-10">
				{/* top grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20 text-center md:text-left">
					{/* Contact Info */}
					<div className="flex flex-col items-center md:items-start space-y-4">
						<Image
							src="/imgs/logos/HearldCollegeLogo.svg"
							alt="Herald College Logo"
							width={180}
							height={180}
							className="mb-6"
						/>
						<div>
							<p className="text-base sm:text-lg text-[#000000CC] font-[300] tracking-[0.5px] leading-6">
								Bhagawati Marga, Naxal
							</p>
							<p className="text-base sm:text-lg text-[#000000CC] font-[300] mt-3 mb-3">
								+977 9801022637
							</p>
							<Link
								href="mailto:info@heraldcollege.edu.np"
								className="hover:underline text-base sm:text-lg text-[#000000CC] font-[300] tracking-[0.5px]">
								info@heraldcollege.edu.np
							</Link>
						</div>
					</div>

					{/* Programs */}
					<div className="flex flex-col items-center md:items-start">
						<h3 className="font-[700] text-lg sm:text-xl mb-4 text-[#000000CC] tracking-[0.6px]">
							Programs
						</h3>
						<ul className="space-y-4 text-base sm:text-lg text-[#000000CC] font-[300] tracking-[0.5px]">
							{[
								"Information Technology",
								"Cybersecurity",
								"International Business Management",
								"Business Administration",
							].map((program, i) => (
								<li key={i}>
									<Link
										href="#"
										className="hover:text-[#74BF44] transition-colors duration-200">
										{program}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Socials + Subscribe */}
					<div className="flex flex-col items-center md:items-start">
						<h3 className="font-[700] text-lg sm:text-xl mb-4 text-[#000000CC] tracking-[0.6px]">
							Stay Updated
						</h3>
						<p className="text-base sm:text-lg text-[#000000CC] font-[300] leading-6 text-center md:text-left">
							Subscribe to get the latest updates about new resources & platform
							features.
						</p>

						{/* responsive form */}
						<div className="w-full mt-6">
							<form className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
								<input
									type="email"
									placeholder="Enter your email"
									className="flex-1 min-w-0 px-4 py-2 rounded-[7px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#74BF44] text-sm sm:text-base"
								/>
								<button
									type="submit"
									className="px-5 py-2 bg-[#74BF44] text-white rounded-[7px] hover:bg-green-600 transition-colors text-sm sm:text-base w-full sm:w-auto">
									Subscribe
								</button>
							</form>
						</div>

						{/* social icons */}
						<div className="flex space-x-4 mt-6">
							{/* Instagram */}
							<Link
								href="https://www.instagram.com/herald.developmentplatform/"
								className="group bg-gray-100 p-3 rounded-xl transition-all duration-200 hover:scale-110 hover:bg-[#74BF44]">
								<FaInstagram
									size={22}
									className="text-gray-700 group-hover:text-white"
								/>
							</Link>

							{/* LinkedIn */}
							<Link
								href="https://www.linkedin.com/company/development-platform-hck/posts/?feedView=all"
								className="group bg-gray-100 p-3 rounded-xl transition-all duration-200 hover:scale-110 hover:bg-[#74BF44]">
								<LiaLinkedin
									size={22}
									className="text-gray-700 group-hover:text-white"
								/>
							</Link>

							{/* GitHub */}
							<Link
								href="https://github.com/Development-Platform-Projects-2025/herald-hub-frontend"
								className="group bg-gray-100 p-3 rounded-xl transition-all duration-200 hover:scale-110 hover:bg-[#74BF44]">
								<FaGithub
									size={22}
									className="text-gray-700 group-hover:text-white"
								/>
							</Link>
						</div>
					</div>
				</div>

				{/* Footer bottom */}
				<div className="border-t border-gray-300 mt-10 pt-6 text-center">
					<p className="text-[#00000099] text-sm mb-4">Developed by</p>

					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
						{[
							["Swornim Sanjel", "UI/UX Designer"],
							["Shubham Pandey", "Frontend Developer"],
							["Samir Premi Magar", "Frontend Developer"],
							["Nabin Lamsal", "Backend Developer"],
						].map(([name, role], i) => (
							<div key={i}>
								<p className="font-medium text-gray-900 text-sm sm:text-base">
									{name}
								</p>
								<p className="text-gray-600 text-xs sm:text-sm">{role}</p>
							</div>
						))}
					</div>

					<p className="text-[#00000099] text-xs sm:text-sm mt-6">
						© 2025 Herald College Kathmandu. All Rights Reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
