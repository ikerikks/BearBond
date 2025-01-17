import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import Post from "../../components/general/Post.jsx";
import PostLoader from "../../components/loaders/PostLoader.jsx";

const ProfilePosts = ({user}) => {

	const queryClient = useQueryClient();

	const { isLoading, error, data:posts } = useQuery({
		queryKey: ['userPosts'],
		queryFn: async () => {
			try {
				if (user) {
					const res = await axios.get(`http://localhost:5000/api/posts/user/${user?.userName}`);
					const { data } = res;
					return data;
				}
				return '';
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
					<p className="font-bold">No posts</p>
				</div>
			}
			{!isLoading && posts?.length > 0 && (
				<main className="">
					{posts && posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
					{posts && <div>data ok</div>
					}
				</main>
			)}
		</>
	);
};

export default ProfilePosts;