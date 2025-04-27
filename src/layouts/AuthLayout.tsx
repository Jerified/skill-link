import { Toaster } from "sonner";

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen">
    <div className="bg-[#191B2B] min-h-[100dvh] text-white">
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
    <Toaster />
  </div>
);

export default AuthLayout;
