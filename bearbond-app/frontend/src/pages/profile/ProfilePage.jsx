import { useRef, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useNavigation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { TbLink } from "react-icons/tb";
import { BsFillPatchCheckFill } from "react-icons/bs";

import ProfilePosts from "./ProfilePosts";
import ProfileLoader from "../../components/loaders/ProfileLoader";
import PostLoader from "../../components/loaders/PostLoader";
import EditProfileForm from "./EditProfileForm";
import { TbPhotoEdit } from "react-icons/tb";
import Post from "../../components/general/Post";
import avatar from "../../assets/images/avatar.png";
import banner from "../../assets/images/banner.jpg";
import { data } from "autoprefixer";


const ProfilePage = () => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { username } = useParams();
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");
  const profileImgRef = useRef(null);

  const { data: userProfile, isLoading, isError, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/users/profile/${username}`);
        const { data } = res;
        return data;
      } catch (err) {
        throw err;
      }
    },
    retry: false
  })

  const { mutate: editProfile } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await axios.post('/api/users/update', formData);
        const { data } = res;
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
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    }
  })

  // const {data:posts, isLoading:postsLoading, error:postError } = useQuery({
  // 	queryKey: ['userPosts'],
  // 	queryFn: async () => {
  // 		try {
  //       if (user) {
  //         const res = await axios.get(`http://localhost:5000/api/posts/user/${userProfile.userName}`);
  // 				const { data } = res;
  //         console.log('POST', data)
  // 				return data;
  // 			}
  // 			return '';
  // 		} catch (err) {
  // 			if (err.response) {return null}
  // 			throw err;
  // 		}
  // 	},
  //   retry: false
  // })

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const joinedDate = (date) => {
    const data = new Date(date).toDateString().split(' ');
    const month = data[1];
    const year = data.pop();
    return `Joined ${month} ${year}`;
  }


  return (
    <div className="flex-[4_4_0] min-h-screen">
      {/* header */}
      {isLoading && <ProfileLoader />}
      {!isLoading && !userProfile && <p className="text-center text-secondary font-bold">User not found</p>}
      <div className="flex flex-col">
        {!isLoading && userProfile && (
          <>
            <div className="flex pb-1 pr-4 items-center sticky top-0 z-50 backdrop-blur-md">
              <div className="flex flex-1 gap-6 px-4 items-center">
                <Link
                  onClick={() => { navigate(-1) }}
                >
                  <FaArrowLeft className="size-5 md:hover:bg-red-200" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{userProfile?.fullName}</p>
                  <p className="text-sm text-slate-500">{ } posts</p>
                </div>
              </div>
              <div className="py-2 h-[48px]">
                {authUser._id === userProfile._id && <EditProfileForm />}
              </div>
              <div className="">
                {(profileImg) && (
                  <button
                    className="btn btn-neutral btn-sm text-white px-4 ml-1"
                    onClick={async () => {
                      editProfile({
                        profileImg: profileImgRef.current.files[0]
                      })
                    }}
                  >
                    <FiUpload />
                    Save
                  </button>
                )}
              </div>
            </div>
            {/* avatar */}
            <div className="px-4">
              <input
                type="file"
                hidden
                accept="image/png, image/jpeg"
                ref={profileImgRef}
                onChange={(e) => handleImgChange(e, "profileImg")}
              />
              <div className="avatar mt-3">
                <div className="w-32 rounded-3xl">
                  <img src={profileImg || userProfile?.profileImg || avatar} />
                </div>
                {authUser._id === userProfile._id && (
                  < TbPhotoEdit
                    className="size-7 cursor-pointer text-primary rounded-md md:hover:bg-red-200"
                    onClick={() => profileImgRef.current.click()}
                  />
                )}
              </div>
            </div>
            {/* user info */}
            <div className="flex flex-col px-4 gap-2">
              <div className="">
                <p className="font-bold text-lg">{userProfile?.fullName}</p>
                <p className="text-sm text-slate-500">@{userProfile?.userName}</p>
              </div>
              <pre className="text-sm font-sans text-neutral w-[400px]">{userProfile?.bio}</pre>
              <div className="">
                {userProfile?.link && (
                  <a
                    href={userProfile.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {userProfile.link}
                  </a>
                )}
                <div className="flex gap-1">
                  <IoCalendarOutline className="size-[17.5px] text-slate-500" />
                  <p className="text-sm text-slate-500">
                    {joinedDate(userProfile.createdAt)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex w-full border-b mt-4">
              <div
                className="flex justify-center flex-1 p-3 hover:bg-base-300 transition duration-300 relative cursor-pointer"
                onClick={() => setFeedType("posts")}
              >
                <h1 className={`font-bold ${feedType === 'posts' ? 'text-neutral' : 'text-slate-500'}
                  `}>Posts</h1>
                {feedType === "posts" && (
                  <div className="absolute bottom-0 w-10 h-1 rounded-full bg-neutral" />
                )}
              </div>
              <div
                className="flex justify-center flex-1 p-3 hover:bg-base-300 transition duration-300 relative cursor-pointer"
                onClick={() => setFeedType("sparks")}
              >
                <h1 className={`font-bold ${feedType === 'sparks' ? 'text-neutral' : 'text-slate-500'}
                  `}>Sparks</h1>
                {feedType === "sparks" && (
                  <div className="absolute bottom-0 w-10  h-1 rounded-full bg-neutral" />
                )}
              </div>
            </div>
          </>
        )}
        {/* <ProfilePosts user={userProfile} /> */}
        {/* {postsLoading && <PostLoader />} */}
        {/* {!postsLoading &&  (
            <ul>
              {posts?.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </ul>
          )} */}
      </div>
    </div>
  );
};
export default ProfilePage;