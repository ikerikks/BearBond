import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import Post from "./Post";
import PostLoader from "../loaders/PostLoader.jsx";

const Posts = () => {

	const queryClient = useQueryClient();

	const { isLoading, error, data: posts } = useQuery({
		queryKey: ['posts'],
		queryFn: async () => {
			try {
				const res = await axios.get('/api/posts/all');
				const { data } = res;
				
				if (data.error) { throw data.error }
				return data;
			} catch (err) {
				if (err.response) {return null}
				throw err;
			}
		},
	})


	return (
		<>
			{isLoading && (
				<div className="flex flex-col justify-center">
					<PostLoader />
					<PostLoader />
					<PostLoader />
				</div>
			)}
			{!isLoading && posts?.length === 0 &&
				<div className="flex flex-1 justify-center mt-8">
					<p className="badge border-2 border-info py-3">No posts</p>
				</div>
			}
			{!isLoading && posts.length > 0 && (
				<>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</>
			)}
		</>
	);
};
export default Posts;