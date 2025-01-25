import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import Post from "./Post";
import PostLoader from "../loaders/PostLoader";

const Posts = ({ feedType, userId }) => {

	const getUrl = () => {
		switch (feedType) {
			case 'forYou':
				return '/api/posts/all';
			case 'profile':
				return `/api/posts/user/${userId}`;
			case 'likes':
				return `/api/posts/likes/${userId}`;
			default:
				return '/api/posts/all';
		}
	}

	const postUrl = getUrl();

	const { isLoading, error, data: posts } = useQuery({
		queryKey: ['posts'],
		queryFn: async () => {
			try {
				const res = await axios.get(postUrl);
				const { data } = res;

				if (data.error) { throw data.error }
				return data;
			} catch (err) {
				if (err.response) { return null }
				throw err;
			}
		},
		retry: false
	})


	return (
		<>
			{isLoading && (
				<div className="flex flex-col justify-center">
					<PostLoader />
				</div>
			)}
			{!isLoading && posts?.length === 0 && (
				<p className="text-center text-secondary font-bold">No posts here</p>
			)}
			{!isLoading && posts.length > 0 && (
				<div className="flex flex-col w-full pb-10">
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}

		</>
	);
};
export default Posts;