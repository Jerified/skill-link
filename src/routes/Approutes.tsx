import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import AuthCallback from "../pages/AuthCallback";
import Explore from "../pages/Explore";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import CreatePost from "../pages/CreatePost";
import { PostDetail } from "../pages/PostDetail";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<SignIn />} />
    <Route path="/register" element={<SignUp />} />
    <Route path="/auth/callback" element={<AuthCallback />} />
    
    <Route path="/profile/:userId" element={<Profile />} />

    <Route element={<ProtectedRoute />}>
      <Route path="/explore" element={<Explore />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/post/:id" element={<PostDetail />} />
    </Route>
  </Routes>
);

export default AppRoutes;
