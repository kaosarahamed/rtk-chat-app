import Chatbody from "../components/Chatbody";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function Chat() {
  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto -mt-1">
        <div className="min-w-full border rounded flex lg:grid lg:grid-cols-3">
          <Sidebar />
          <Chatbody />
        </div>
      </div>
    </>
  );
}

export default Chat;
