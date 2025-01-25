import { Link } from "react-router-dom";

import { USERS_FOR_RIGHT_PANEL } from "../../utils/dummys.js";

import avatar from "../../assets/images/avatar.png";

const RightPanel = () => {
	const isLoading = false;

	return (
		<aside className="hidden lg:block pt-2 p-2">
			<div className="bg-white py-6 px-8 rounded-2xl sticky top-0 border border-gray-200 rounded-2xl">
				<p className="font-bold mb-3">Meet new people</p>
				<div className="flex flex-col gap-5">
					{/* item */}
					{/* {isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)} */}
					{!isLoading &&
						USERS_FOR_RIGHT_PANEL?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className="flex items-center justify-between gap-4"
								key={user._id}
							>
								<div className="flex gap-2 items-center">
									<div className="avatar">
										<div className="size-7 rounded-md">
											<img src={user.profileImg || avatar} />
										</div>
									</div>
									<div className="flex flex-col">
										<span className="text-sm font-semibold tracking-tight truncate w-28">
											{user.fullName}
										</span>
										<span className="text-xs text-slate-500">@{user.username}</span>
									</div>
								</div>
							</Link>
						))}
				</div>
			</div>
		</aside>
	);
};


export default RightPanel;