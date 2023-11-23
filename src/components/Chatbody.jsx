import { useParams } from "react-router-dom";
import { useGetMessagesQuery } from "../redux/rtk/features/messages/messageApi";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import ChatBox from "./ChatBox";

function Chatbody() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetMessagesQuery(id);

  // what to render
  let content;
  if (isLoading) {
    content = <div>Loading...</div>;
  }
  if (!isLoading && isError) {
    content = <div>{error.data}</div>;
  }
  if (!isLoading && !isError && data?.length === 0) {
    content = <div>no messages found</div>;
  }
  if (!isLoading && !isError && data?.length > 0) {
    content = (
      <>
        <ChatHead messages={data[0]} />
        <Messages messages={data} />
        <ChatBox messages={data[0]} />
      </>
    );
  }

  return (
    <div className="w-full lg:col-span-2 lg:block">
      <div className="w-full grid conversation-row-grid">{content}</div>
    </div>
  );
}

export default Chatbody;
