import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { TbSend } from "react-icons/tb";
import { RiBearSmileLine, RiBearSmileFill } from "react-icons/ri";
import { PiChatCenteredDotsBold } from "react-icons/pi";

import TimeAgo from "./TimeAgo";
import avatar from "../../assets/images/avatar.png";
import CommentModal from "./ReplyModal";

const Post = ({ post }) => {
	
	const navigate = useNavigate();

	const postOwner = post.user;
	const { data: authUser } = useQuery({ queryKey: ['authUser'] });
	const queryClient = useQueryClient();

	const bonded = post.likes.includes(authUser._id);
	const replied = post.comments.filter((comment) => (comment.user._id === authUser._id)).length > 0;

	const { mutate: likePost, isPending: likePending, isError: likeError } = useMutation({
		mutationFn: async () => {
			try {
				const res = await axios.post(`/api/posts/like/${post._id}`)
				const { data } = res;
				return data;
			} catch (err) {
				throw err;
			}
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
			toast(data.message, {
				icon: bonded
					? <RiBearSmileLine className="text-xl text-[#fff]" />
					: <RiBearSmileFill className="text-xl text-[#fff]" />,
				style: {
					backgroundColor: '#E91C51',
					color: '#fff',
					fontSize: '14px'
				},
				duration: 2000
			});
		}
	})

	const handleLikePost = (ev) => {
		ev.stopPropagation();
		likePost();
	};

	return (
		<div
			className="flex flex-col gap-1 items-start p-3 bg-base-100 mt-4 rounded-2xl
			md:hover:bg-base-200	md:cursor-pointer"
			onClick={() => { navigate(`/status/${post._id}`) }}
		>
			{/* first block: user details */}
			<div className="flex gap-2">
				<div className="avatar">
					<Link
						to={`/profile/${postOwner.userName}`}
						className="size-10 rounded-md"
						onClick={(ev) => { ev.stopPropagation() }}
					>
						<img src={postOwner.profileImg || avatar} className="rounded-md" />
					</Link>
				</div>
				<div className="flex flex-col">
					<Link
						to={`/profile/${postOwner.userName}`}
						className="font-bold text-sm text-neutral"
						onClick={(ev) => { ev.stopPropagation(); }}
					>
						{postOwner.fullName}
					</Link>
					<div className="text-gray-700 flex flex-1 gap-1 text-sm items-baseline">
						<Link
							to={`/profile/${postOwner.userName}`}
							onClick={(ev) => { ev.stopPropagation(); }}
						>@{postOwner.userName}</Link>
						<p>•</p>
						<TimeAgo timestamp={post.createdAt} />
					</div>
				</div>
			</div>
			{/* post file/text */}
			<div className="flex flex-col w-full gap-2">
				<pre className="text-md font-sans mt-1 text-neutral">{post.text}</pre>
				{post.file.src && post.file.type === 'image' && (
					<div className="w-full max-h-96">
						<img
							src={post.file.src}
							className="w-auto h-96 rounded-xl border border-gray-300 bg-[#ececf0]"
							alt="Image"
						/>
					</div>
				)}
				{post.file.scr && post.file.type === 'video' && (
					<video
						className=" rounded-xl max-w-96" 
						src={post.file.src} 
						controls
					></video>
				)}
			</div>
			{/* options(like/reply) */}
			<div className="flex gap-3 bg-primary/90 py-[2px] px-2 my-2 rounded-lg text-white">
				<p className="text-xs">replies {post.comments.length}</p>
				<p className="text-xs">bonds {post.likes.length}</p>
			</div>
			<div className="flex gap-2 justify-between bg-slate-100 rounded-2xl py-1 px-2">
				<div
					className={`cursor-pointer
					${replied?'text-info md:hover:text-slate-500':'text-slate-500 md:hover:text-info'}`}
					onClick={(ev) => {
						ev.stopPropagation();
						document.getElementById("reply_modal" + post._id).showModal();
					}}
				>
					<TbSend className="text-2xl" />
				</div>
				<CommentModal post={post} />
				<div className={` cursor-pointer
					${bonded?'text-[#e91c51] md:hover:text-slate-500':'text-slate-500 md:hover:text-[#e91c51]'}`}
					onClick={handleLikePost}
				>
					{bonded
						? <RiBearSmileFill
							className="text-2xl"
						/>
						: <RiBearSmileLine
							className="text-2xl"
						/>
					}
				</div>
			</div>
		</div>
	);
};


export default Post;