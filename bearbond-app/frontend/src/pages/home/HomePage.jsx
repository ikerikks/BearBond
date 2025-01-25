import { useState } from "react";

import Posts from "../../components/general/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {

	return (
		<div className="flex-[4_4_0] mr-auto h-screen px-3 scrollbar-none overflow-y-auto overflow-x-hidden">
			<div className="flex w-full sticky top-0 bg-primary/5 backdrop-blur-xl z-10 rounded-2xl">
				<div className="h-[56px] p-3 pb-4 relative">
					<p className="font-bold text-lg text-neutral">Home Feed</p>
				</div>
			</div>
			<CreatePost />
			<Posts feedType={'forYou'} />
		</div>
	);
};


export default HomePage;