import TopBar from "@/app/components/TopBar";
import Header from "@/app/components/Header";
import QuoteForm from "../components/QuoteForm";

import Copyright from "@/app/components/Copyright";

import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <TopBar />

      <Header />
        <QuoteForm />
      <Footer/>
      <Copyright/>

      
    </main>
  );
}