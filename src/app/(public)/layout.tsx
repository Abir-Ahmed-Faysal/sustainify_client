import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ChatbotWidget from "@/components/module/chatbot/ChatbotWidget";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 min-h-[calc(100vh-120px)]">{children}</main>
      <Footer />
      <ChatbotWidget embedded={true} position="bottom-right" />
    </div>
  );
}
