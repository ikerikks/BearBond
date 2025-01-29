import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";

import { RiBearSmileFill } from "react-icons/ri";
import { 
	TbMessages, TbBell,
	TbUserCircle, TbSmartHome,
	TbDotsCircleHorizontal  
} from "react-icons/tb";
import { PiDotsThreeCircle, PiDotsThreeCircleFill } from "react-icons/pi";
import { BsThreeDots } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { TbLogout } from "react-icons/tb";

import avatar from "../../assets/images/avatar.png";
import toast from "react-hot-toast";
import { IoChatboxEllipses } from "react-icons/io5";

const Sidebar = () => {

	const queryClient = useQueryClient();
	const { data: authUser } = useQuery({ queryKey: ['authUser'] });
	const { data: notifs } = useQuery({ queryKey: ['notifications'] });
	
	const { mutate: logout, isError, isPending, error } = useMutation({
		mutationFn: async () => {
			try {
				const response = await axios.post('/api/auth/logout');
				const { data } = response;

				if (data.error) { throw data.error }
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
			queryClient.invalidateQueries({ queryKey: ['authUser'] })
			toast.success('logged out');
		},
		onError: (err) => { toast.error(err) }
	})

	const { pathname } = useLocation();

	return (
		<aside className="text-neutral font-semibold border-l bg-base-100">
			<div className="md:w-52 w-14 h-screen sticky top-0 left-0 flex flex-col justify-between 
			items-center md:items-start">
				<ul className="mt-2 w-full">
					<li className="px-[9px] mb-3">
						<RiBearSmileFill className="text-4xl text-[#e91c51]" />
					</li>
					<li className="flex items-center md:hover:bg-[#e91c51]/5">
						<NavLink
							to="/home"
							className={({ isActive }) => `flex flex-1 items-center gap-2 justify-center md:justify-start 
							${isActive && 'font-extrabold'}`}
						>
							<div className={`hidden md:block h-6 w-[3px] rounded-full
							${pathname.includes('home') && 'bg-primary opacity-80'}`}>
							</div>
							<div className="flex gap-2 py-2 items-center">
								<TbSmartHome className={
									`size-6 
									${pathname.includes('home')
									&& 'text-primary'}`
								} />
								<p className="text-sm hidden md:block">Home</p>
							</div>
						</NavLink>
					</li>
					<li className="flex  items-center md:hover:bg-[#e91c51]/5">
						<NavLink
							to="/notifications"
							className={({ isActive }) => `flex flex-1 items-center gap-2 justify-center md:justify-start 
							${isActive && 'font-extrabold'}`}
						>
							<div className={`hidden md:block h-6 w-[3px] rounded-full
							${pathname.includes('notifications') && 'bg-primary opacity-80'}`}>
							</div>
							<div className="flex gap-2 py-2 items-center">
								<TbBell className={
									`size-6 
									${pathname.includes('notifications')
									&& 'text-primary'}`
								} />
								<p className="text-sm hidden md:block">Notifications</p>
							</div>
							{notifs && notifs.filter((notif) => notif.read === false).length > 0 && (
								<div className="badge badge-primary text-base-100 font-normal">
									{notifs.filter((notif) => notif.read === false).length}
								</div>)
							}
						</NavLink>
					</li>
					<li className="flex items-center md:hover:bg-[#e91c51]/5">
						<NavLink
							to="/discussions"
							className={({ isActive }) => `flex flex-1 items-center gap-2 justify-center md:justify-start 
							${isActive && 'font-extrabold'}`}
						>
							<div className={`hidden md:block h-6 w-[3px] rounded-sm
							${pathname.includes('discussions') && 'bg-primary opacity-80'}`}>
							</div>
							<div className="flex gap-2 py-2 items-center">
								<TbMessages className={
									`size-6 
									${pathname.includes('discussions')
									&& 'text-primary'}`
								}/>
								<p className="text-sm hidden md:block">Discussions</p>
							</div>
						</NavLink>
					</li>
					<li className="flex items-center md:hover:bg-[#e91c51]/5">
						<NavLink
							to={`/profile/${authUser.userName}`}
							className={({ isActive }) => `flex flex-1 items-center gap-2 justify-center md:justify-start 
							${isActive && 'font-extrabold'}`}
						>
							<div className={`hidden md:block h-6 w-[3px] rounded-sm
							${pathname.includes(`/profile/${authUser.userName}`) && 'bg-primary opacity-80'}`}>
							</div>
							<div className="flex gap-2 py-2 items-center">
								<TbUserCircle className={
									`size-6 
									${pathname.includes(`/profile/${authUser.userName}`)
										&& 'text-primary'}`
								}/>
								<p className="text-sm hidden md:block">Profile</p>
							</div>
						</NavLink>
					</li>
				</ul>
				{authUser && (
					<div className="mb-10 w-full md:px-4 flex md:gap-2 items-center justify-center md:justify-between">
						<NavLink
							to={`/profile/${authUser?.userName}`}
							className={'flex gap-2 items-center'}
							onClick={() => { }}
						>
							<div className="avatar hidden md:inline-flex">
								<div className="size-10 rounded-md">
									<img src={authUser?.profileImg || avatar} />
								</div>
							</div>
							<div className="flex flex-1 md:justify-between justify-center items-center">
								<div className="hidden md:block">
									<p className="font-bold text-xs truncate">{authUser?.fullName}</p>
									<p className="text-xs">@{authUser?.userName}</p>
								</div>
							</div>
						</NavLink>
						<button
							className="text-xl"
							onClick={() => { logout() }}
						>
							<TbLogout />
						</button>
					</div>
				)}
			</div>
		</aside>
	);
};


export default Sidebar;