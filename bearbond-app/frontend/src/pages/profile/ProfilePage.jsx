import { useRef, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useNavigation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { TbPhotoEdit, TbArrowLeftToArc } from "react-icons/tb";

import ProfileLoader from "../../components/loaders/ProfileLoader";
import Posts from "../../components/general/Posts";
import EditProfileForm from "./EditProfileForm";
import avatar from "../../assets/images/avatar.png";
import { data } from "autoprefixer";


const ProfilePage = () => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { username } = useParams();
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("likes");
  const profileImgRef = useRef(null);

  const { data: userProfile, isLoading, refetch, isFetching } = useQuery({
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

  const { mutate: editProfile, isPending:saving } = useMutation({
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
      setProfileImg(null);
    }
  })

  const handleImgChange = (ev) => {
    const file = ev.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImg(reader.result);
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

  useEffect(() => {
    refetch()
  }, [username, refetch])

  return (
    <div className="flex-[4_4_0] h-screen px-3 scrollbar-none overflow-y-auto">
      {(isLoading || isFetching) && <ProfileLoader />}
      {!isLoading && !userProfile && <p className="text-center text-secondary font-bold">User not found</p>}
      {/* <div className="flex flex-col"> */}
      {(!isLoading && !isFetching) && userProfile && (
        <>
          {/* header */}
          <div className="flex items-center sticky top-0 z-50 bg-primary/5 rounded-2xl backdrop-blur-md">
            <div className="flex flex-1 gap-3 h-[56px] p-3 pb-4 items-center">
              {authUser._id !== userProfile._id && (
                <Link
                  onClick={() => { navigate(-1) }}
                  className=""
                >
                  <TbArrowLeftToArc className="size-6" />
                </Link>
              )}
              <p className="font-bold text-lg">{userProfile?.fullName}</p>
            </div>
            <div className="py-2 h-[48px]">
              {authUser._id === userProfile._id && <EditProfileForm />}
            </div>
            <div className="">
              {(profileImg) && (
                <button
                  className="btn btn-neutral btn-sm text-white mx-1"
                  onClick={async () => {
                    editProfile({ profileImg })
                  }}
                >
                  {saving
                    ? ('•••')
                    : <><FiUpload />save</>}
                </button>
              )}
            </div>
          </div>
          {/* content */}
          <div className="bg-base-100 p-4 pb-8 mt-5 rounded-2xl">
            {/* avatar */}
            <div className="">
              <input
                type="file"
                hidden
                accept="image/png, image/jpeg"
                ref={profileImgRef}
                onChange={(e) => handleImgChange(e, "profileImg")}
              />
              <div className="avatar">
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
            <div className="flex flex-col gap-2">
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
          </div>
          <div className="">
            <div className="flex w-full border-b mt-0">
              <div
                className="flex justify-center flex-1 p-3 hover:bg-primary/10 rounded-2xl transition duration-300 relative cursor-pointer"
                onClick={() => setFeedType("posts")}
              >
                <h1 className={`font-bold ${feedType === 'posts' ? 'text-neutral' : 'text-slate-500'}
                  `}>Posts</h1>
                {feedType === "posts" && (
                  <div className="absolute bottom-0 w-10 h-[3px] rounded-full bg-primary" />
                )}
              </div>
              <div
                className="flex justify-center flex-1 p-3 hover:bg-primary/10 rounded-2xl transition duration-300 relative cursor-pointer"
                onClick={() => setFeedType("likes")}
              >
                <h1 className={`font-bold ${feedType === 'likes' ? 'text-neutral' : 'text-slate-500'}
                  `}>Bonds</h1>
                {feedType === "likes" && (
                  <div className="absolute bottom-0 w-10  h-[3px] rounded-full bg-primary" />
                )}
              </div>
            </div>
            {feedType === 'posts' && userProfile && (
              <Posts feedType={'profile'} userId={userProfile._id} />
            )}
            {feedType === 'likes' && userProfile && (
              <Posts feedType={'likes'} userId={userProfile._id} />
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default ProfilePage;