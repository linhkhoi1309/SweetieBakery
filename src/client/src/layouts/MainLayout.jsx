import { Outlet } from "react-router-dom";
import Header from "../components/layouts/header/Header";
import Footer from "../components/layouts/footer/Footer";
import ChatWidget from "../components/shared/ChatWidget";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default MainLayout;
