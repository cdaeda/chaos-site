import Link from "next/link";
import Stage from "@/app/components/Stage";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Stage />
      <div className="announce">
        🎭 Open board positions available!{" "}
        <Link href="/#contact">Contact us to get involved →</Link>
      </div>
      <Header />
      <div id="view">{children}</div>
      <Footer />
    </>
  );
}
