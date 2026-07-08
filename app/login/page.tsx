import TopBar from "@/app/components/TopBar";
import Header from "@/app/components/Header";
import LoginPage from "../components/Login";


import Copyright from "@/app/components/Copyright";

import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <TopBar />

      <Header />
        <LoginPage />
      <Footer/>
      <Copyright/>

      
    </main>
  );
}