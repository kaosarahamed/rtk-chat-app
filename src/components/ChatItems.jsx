import { useSelector } from "react-redux";
import { useGetConversationQuery } from "../redux/rtk/features/conversation/conversationApi";
import ChatItem from "./ChatItem";
import getPartnarInfo from "../redux/rtk/utility/getPartnarInfo";

function ChatItems() {
  const { user } = useSelector((state) => state.auth);
  const { email } = user || {};
  const { data, isLoading, isError, error } = useGetConversationQuery(email);

  // decide what to runder
  let content;
  if (isLoading) {
    content = <div>Loading...</div>;
  }
  if (!isLoading && isError) {
    content = <div>{error}</div>;
  }
  if (!isLoading && !isError && data?.length === 0) {
    content = <div>No conversation found</div>;
  }
  if (!isLoading && !isError && data?.length > 0) {
    content = data?.map((item) => {
      const { name, email: partnarEmail } =
        getPartnarInfo(item.user, email) || {};
      return (
        <ChatItem
          key={item.id}
          conversation={item}
          partnarEmail={partnarEmail}
          partnarName={name}
        />
      );
    });
  }
  return (
    <ul className="overflow-auto">
      <li>{content}</li>
    </ul>
  );
}

export default ChatItems;
