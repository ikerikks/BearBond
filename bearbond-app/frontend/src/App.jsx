import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import '@fontsource-variable/inter';

import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import Sidebar from "./components/general/SideBar";
import RightPanel from "./components/general/RightPanel"
import HomePage from "./pages/home/HomePage";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import DiscussionsPage from "./pages/discussions/DiscussionsPage";
import Chat from "./pages/discussions/Chat";
import ProfilePage from "./pages/profile/ProfilePage";
import PostDetailsPage from "./pages/post/PostDetailsPage";
import Spinner from "./components/loaders/Spinner"

function App() {

	const { isLoading, data: authUser } = useQuery({
		queryKey: ['authUser'],
		queryFn: async () => {
			try {
				const res = await axios.get('/api/auth/auth-verification');
				const { data } = res;
				if (data.error) { throw data.error }
				return data;
			} catch (err) {
				if (err.response) { return null }
				throw err;
			}
		},
		retry: false,

	})

	if (isLoading) {
		return (
			<div className="flex flex-1 h-screen justify-center items-center">
				<Spinner />
			</div>
		)
	}

	return (
		<div className="flex md:max-w-[80%] mx-auto">
			{authUser && <Sidebar />}
			<Routes>
				<Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/login" />} />
				<Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/home" />} />
				<Route path="/home" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
				<Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to="/login" />} />
				<Route path="/discussions" element={authUser ? <DiscussionsPage /> : <Navigate to="/login" />} />
				<Route path="/discussions/:id" element={authUser ? <Chat /> : <Navigate to="/login" />} />
				<Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
				<Route path="/status/:id" element={authUser ? <PostDetailsPage /> : <Navigate to="/login" />} />
				{/* <Route path="/messages" element={<LoginPage />} /> */}
			</Routes>
			{authUser && <RightPanel />}
			<Toaster toastOptions={{ duration: 2000 }} />
		</div>
	);
}

export default App;
