import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { BsFillPatchCheckFill } from "react-icons/bs";

const EditProfileForm = () => {

	const queryClient = useQueryClient();
	const {data:authUser} = useQuery({ queryKey: ['authUser'] });

	const { mutate: editProfile, isError, error } = useMutation({
		mutationFn: async (formData) => {
			try {
				const res = await axios.post('/api/users/update', formData);
				const {data} = res;
				return data;
			} catch (err) {
				if (err.response) {
					throw err.response.data.error;
				} else {
					throw err.message;
				}
			}
		},
		onSuccess: () => {
			toast('profile updated', {
				icon: <BsFillPatchCheckFill className="text-xl" />,
				style: {
					backgroundColor: '#E91C51',
					color: '#fff',
					fontSize: '14px'
				}
			});
			queryClient.invalidateQueries({queryKey:['userProfile']});
		}
	})

	const handleSubmit = (ev) => {
		ev.preventDefault();
		const formData = new FormData(ev.target);
		editProfile(formData);
	};

	const [bio, setBio] = useState(authUser.bio || '');
	const [link, setLink] = useState(authUser.link || '');

	return (
		<>
			<button
				className="btn btn-sm btn-neutral text-base-100"
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id="edit_profile_modal" className="modal">
				<div className="modal-box rounded-md shadow-md w-full">
					<h3 className="font-bold text-md">Edit Profile</h3>
					{isError && <p className="text-error text-sm font-bold ">{error}</p>}
					<form
						className="flex flex-col gap-4 mt-3"
						onSubmit={handleSubmit}
					>
						<div className="flex flex-wrap gap-2">
							<input
								type="text"
								placeholder="Full Name"
								className="flex-1 input border border-gray-500 rounded p-2 input-md text-neutral font-bold"
								name="fullName"
							/>
							<input
								type="text"
								placeholder="Username"
								className="flex-1 input border border-gray-500 rounded p-2 input-md text-neutral font-bold"
								name="userName"
							/>
						</div>
						<div className="flex flex-wrap gap-2">
							<input
								type="email"
								placeholder="Email"
								className="flex-1 input border border-gray-500 rounded p-2 input-md text-neutral font-bold"
								name="email"
							/>
							<textarea
								placeholder="Bio"
								className="flex-1 input border border-gray-500 rounded p-2 input-md text-neutral font-bold"
								name="bio"
								value={bio}
								onChange={(ev) =>{setBio(ev.target.value)}}
							/>
						</div>
						<div className="flex flex-wrap gap-2">
							<input
								type="password"
								placeholder="Current Password"
								className="flex-1 input border border-gray-500 rounded p-2 input-md text-neutral font-bold"
								name="currentPassword"
							/>
							<input
								type="password"
								placeholder="New Password"
								className="flex-1 input border border-gray-500 rounded p-2 input-md text-neutral font-bold"
								name="newPassword"
							/>
						</div>
						<input
							type="text"
							placeholder="Link"
							className="flex-1 input border border-gray-500 rounded p-2 input-md text-neutral font-bold"
							name="link"
							value={link}
							onChange={(ev)=>{setLink(ev.target.value)}}
						/>
						<button className="btn btn-neutral rounded-md btn-sm text-white">Save</button>
					</form>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button className="outline-none">close</button>
				</form>
				<Toaster />
			</dialog>
		</>
	);
};


export default EditProfileForm;