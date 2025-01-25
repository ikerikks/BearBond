const UserLoader = () => {

	return (
		<div className="flex flex-col gap-4 w-full p-4 bg-base-100 rounded-2xl">
			<div className="flex gap-4 items-center">
				<div className="skeleton w-10 h-10 rounded-md shrink-0"></div>
				<div className="flex flex-col gap-2 w-full">
					<div className="skeleton h-2 w-[65%] rounded-full"></div>
					<div className="skeleton h-2 w-[45%] rounded-full"></div>
				</div>
			</div>
		</div>
	);
};


export default UserLoader;