import Navbar from "../components/Navbar";
import { Toaster } from "sonner";

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen">
    <Navbar />
    <div className=" bg-[#191B2B] min-h-[100dvh] text-white">
      <div className="pt-18 max-w-6xl mx-auto">
          {children}
      </div>
    </div>
    <Toaster />
  </div>
);

export default MainLayout;
