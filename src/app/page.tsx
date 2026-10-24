import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MaraudersMapMenu } from "@/components/MaraudersMapMenu";
import { Navbar } from "@/components/Navbar";
import { OwlPostDelivery } from "@/components/OwlPostDelivery";
import { ProphetMarquee } from "@/components/ProphetMarquee";
import { SortingHatQuiz } from "@/components/SortingHatQuiz";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProphetMarquee />
        <SortingHatQuiz />
        <MaraudersMapMenu />
        <OwlPostDelivery />
      </main>
      <Footer />
    </>
  );
}
