import Link from "next/link";

type ResourceDetail = {
	submittedBy: string;
	role: string;
	subject: string;
	level4: string;
};

type TypeItem = {
	values: string;
};
type DocumentItem = {
	fileId: number;
	fileName: string;
	filePath: string;
};

type LinkItem = {
	id: number;
	linkName: string;
	linkUrl: string;
};

type Attachments = {
	documents: DocumentItem[];
	links: LinkItem[];
};

type ResourceProps = {
	title: string;
	detail: ResourceDetail;
	type: TypeItem[];
	description: string;
	attachments: Attachments;
};

export default function ResourcesContent({
	title,
	detail,
	type,
	description,
	attachments,
}: ResourceProps) {
	return (
		<div className="w-full flex flex-col p-4 sm:p-6 md:p-8 gap-4 sm:gap-6 md:gap-8 border border-gray-300 rounded-lg bg-white shadow-sm">
			{/* Title */}
			<h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black truncate">
				{title}
			</h2>

			{/* Details */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-sm sm:text-base">
				<span>
					By <span className="font-medium">{detail.submittedBy}</span>
				</span>
				<span className="px-3 py-1 bg-[#74BF44] text-white rounded-md text-xs sm:text-sm">
					{detail.role}
				</span>
				<span
					className="truncate"
					title={detail.subject}>
					{detail.subject}
				</span>
			</div>

			{/* Type tags */}
			<div className="flex flex-wrap gap-2">
				{type.map((t) => (
					<span
						key={t.values}
						className="font-medium text-xs sm:text-sm px-3 py-1 bg-gray-50 border border-gray-300 rounded-md">
						{t.values}
					</span>
				))}
			</div>

			{/* Description */}
			<div
				className="text-sm sm:text-base leading-relaxed text-gray-800"
				dangerouslySetInnerHTML={{ __html: description }}
			/>

			{/* Attachments */}
			<div className="flex flex-col gap-5">
				{/* Documents */}
				<div>
					<h3 className="text-sm sm:text-base font-semibold mb-2">Documents</h3>
					<div className="flex flex-wrap gap-2">
						{attachments.documents.length > 0 ? (
							attachments.documents.map((doc) => (
								<a
									key={doc.fileId}
									href={doc.filePath}
									target="_blank"
									className="py-2 px-3 bg-gray-100 border border-gray-300 rounded-md text-xs sm:text-sm hover:bg-gray-200 transition">
									📄 {doc.fileName}
								</a>
							))
						) : (
							<p className="text-gray-500 text-sm">No documents</p>
						)}
					</div>
				</div>

				{/* Links */}
				<div>
					<h3 className="text-sm sm:text-base font-semibold mb-2">Links</h3>
					<div className="flex flex-col gap-2">
						{attachments.links.length > 0 ? (
							attachments.links.map((link) => (
								<Link
									key={link.id}
									href={link.linkUrl}
									title={link.linkUrl}
									target="_blank"
									className="text-sm sm:text-base text-[#74BF44] underline hover:text-green-700 flex items-center gap-1">
									🔗 {link.linkName}
								</Link>
							))
						) : (
							<p className="text-gray-500 text-sm">No links</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
