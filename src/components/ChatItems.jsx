import { useDispatch, useSelector } from "react-redux";
import {
  conversationApi,
  useGetConversationQuery,
} from "../redux/rtk/features/conversation/conversationApi";
import ChatItem from "./ChatItem";
import getPartnarInfo from "../redux/rtk/utility/getPartnarInfo";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";

function ChatItems() {
  const { user } = useSelector((state) => state.auth);
  const { email } = user || {};
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const { data, isLoading, isError, error } =
    useGetConversationQuery(email) || {};
  const { data: newData, count } = data || {};

  const fetchMore = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (page > 1) {
      dispatch(
        conversationApi.endpoints.getMoreConversation.initiate({ email, page })
      );
    }
  }, [page, email, dispatch]);
  useEffect(() => {
    if (count > 0) {
      const more =
        Math.ceil(count / Number(import.meta.env.VITE_CONVERSATION_PER_PAGE)) >
        page;
      setHasMore(more);
    }
  }, [count, page]);

  // decide what to runder
  let content;
  if (isLoading) {
    content = <div>Loading...</div>;
  }
  if (!isLoading && isError) {
    content = <div>{error}</div>;
  }
  if (!isLoading && !isError && newData?.length === 0) {
    content = <div>No conversation found</div>;
  }
  if (!isLoading && !isError && newData?.length > 0) {
    content = (
      <InfiniteScroll
        dataLength={newData?.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        height={window.innerHeight - 129}
      >
        {newData?.map((item, index) => {
          const { name, email: partnarEmail } =
            getPartnarInfo(item.user, email) || {};
          return (
            <ChatItem
              key={index}
              conversation={item}
              partnarEmail={partnarEmail}
              partnarName={name}
            />
          );
        })}
      </InfiniteScroll>
    );
  }
  return (
    <ul className="overflow-auto">
      <li>{content}</li>
    </ul>
  );
}

export default ChatItems;
