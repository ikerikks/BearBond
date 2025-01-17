import { useState } from "react";

import Posts from "../../components/general/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {

	return (
		<div className="flex-[4_4_0] mr-auto pb-[5%] h-screen border-x scrollbar-none overflow-y-auto">
			<div className="flex w-full sticky top-0 bg-white/70 backdrop-blur-xl z-10">
				<div className="px-3 pt-3 pb-4 relative">
					<p className="font-bold text-lg text-neutral">Home Feed</p>
				</div>
			</div>
			<CreatePost />
			<Posts />
		</div>
	);
};


export default HomePage;