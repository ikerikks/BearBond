const ProfileLoader = () => {
	
  return (
		<div className='flex flex-col gap-2 w-full my-2 p-4 bg-base-100 rounded-2xl'>
			<div className='flex gap-2 items-center'>
				<div className='flex flex-1 gap-1'>
					<div className='flex flex-col gap-1 w-full'>
						<div className='skeleton h-4 w-12 rounded-md'></div>
						<div className='skeleton h-4 w-16 rounded-md'></div>
						<div className='skeleton h-40 w-full relative'>
							<div className='skeleton h-20 w-20 rounded-md border absolute -bottom-10 left-3'></div>
						</div>
						<div className='skeleton h-6 mt-4 w-24 ml-auto rounded-md'></div>
						<div className='skeleton h-4 w-14 rounded-md mt-4'></div>
						<div className='skeleton h-4 w-20 rounded-md'></div>
						<div className='skeleton h-4 w-2/3 rounded-md'></div>
					</div>
				</div>
			</div>
		</div>
	);
};


export default ProfileLoader;