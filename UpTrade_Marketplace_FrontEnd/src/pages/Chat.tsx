import ChatListPage from "../layouts/ChatListPage";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";

function Chat() {
  return (
    <div className="bg-primary flex flex-col justify-center  font-display text-white">
      <Header />
      <ChatListPage />
      <Footer />
    </div>
  );
}

export default Chat;
