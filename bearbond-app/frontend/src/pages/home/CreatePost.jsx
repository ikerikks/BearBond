import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

import { HiMinusCircle } from "react-icons/hi";
import { TbPhotoVideo } from "react-icons/tb";
import { BsFillPatchCheckFill } from "react-icons/bs";

import EmojiPicker from "../../components/general/EmojiPicker";
import avatar from "../../assets/images/avatar.png";

const CreatePost = () => {

	const queryClient = useQueryClient();
	const { data: authUser } = useQuery({ queryKey: ['authUser'] });

	const [src, setSrc] = useState(null);
	const [fileType, setFileType] = useState(null);
	const [emojiPicker, setEmojiPicker] = useState(false);

	const fileRef = useRef(null);
	const inputRef = useRef(null);

	const addEmoji = (emoji) => {
		let text = inputRef.current.value.split('');
		const cursor = inputRef.current.selectionStart;
		const prev = text.slice(0, cursor);
		const post = text.slice(cursor);

		inputRef.current.value = [...prev, emoji.native, ...post].join('');
		setEmojiPicker(!emojiPicker);
	}

	
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setSrc(reader.result);
				setFileType(reader.result.includes('data:video') ? 'video' : 'image');
			};
			reader.readAsDataURL(file);
		}
	}
	
	const { mutate: createPost, isError, isPending, error } = useMutation({
		mutationFn: async (formData) => {
			try {
				const res = await axios.post('/api/posts/create', formData);
				const { data } = res;
				
				if (data.error) { throw data.error }
				return data
			} catch (err) {
				if (err.response) {
					throw err.response.data.error;
				} else {
					throw err.message;
				}
			}
		},
		onSuccess: () => {
			setSrc(null);
			inputRef.current.value = null;
			fileRef.current.value = null;
			queryClient.invalidateQueries({ queryKey: ['posts'] });
			toast('Post created', {
        icon: <BsFillPatchCheckFill className="text-xl" />,
        style: {
          backgroundColor: '#E91C51',
          color: '#fff',
					fontSize: '14px'
        }
      });
		},
		onError: (err) => { toast.error(err); }
	})

	const handleInput = (ev) => {
		const textarea = ev.target;
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	};
	
	const handleSubmit = (ev) => {
		ev.preventDefault();
		createPost({
			text: inputRef.current.value,
			file: {
				type: fileType,
				src
			}
		});
	};

	return (
		<div className="flex p-3 items-start gap-2 border-b">
			<div className="hidden md:block avatar">
				<div className="size-10 rounded-md">
					<img src={authUser.profileImg || avatar} />
				</div>
			</div>
			<form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
				<textarea
					className="textarea w-full p-0 text-lg resize-none rounded-none border-none focus:outline-none border-gray-800"
					placeholder="What's your wish..."
					ref={inputRef}
					onInput={handleInput}
				/>
				{src && (
					<div className="relative size-auto md:w-56 md:px-4 border border-gray-300">
						<HiMinusCircle
							className="absolute -top-4 -right-3 size-8 text-neutral cursor-pointer z-30"
							onClick={() => {
								setSrc(null);
								fileRef.current.value = null;
							}}
						/>
						{fileType === 'image'
							? <img src={src} className="w-full mx-auto h-72 object-contain rounded" />
							: <video controls src={src} className="w-full mx-auto h-72 object-contain rounded"></video>
						}
					</div>
				)}
				<div className="flex justify-between">
					<div className="flex gap-1 items-center text-info">
						<EmojiPicker inputRef={inputRef} />
						<TbPhotoVideo
							className="size-5 cursor-pointer text-primary"
							onClick={() => { fileRef.current.click() }}
						/>
					</div>
					<input type="file" hidden ref={fileRef} onChange={handleFileChange} />
					<button className="btn btn-neutral btn-sm text-base-100">
						{isPending ? '•••' : 'Post'}
					</button>
				</div>
				{/* {isError && <p className="text-red-500 text-sm">{error}</p>} */}
			</form>
		</div>
	);
};


export default CreatePost;