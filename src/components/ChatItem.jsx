import PropTypes from "prop-types";
import moment from "moment/moment";
import gravatarUrl from "gravatar-url";
import { Link } from "react-router-dom";

function ChatItem({ conversation, partnarEmail, partnarName }) {
  const { message, timestamp, id } = conversation || {};

  return (
    <Link
      to={`/inbox/${id}`}
      className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none"
    >
      <img
        className="object-cover w-10 h-10 rounded-full"
        src={gravatarUrl(partnarEmail || "kasoar@gmail.com")}
        alt={partnarEmail}
      />
      <div className="w-full pb-2 hidden md:block">
        <div className="flex justify-between">
          <span className="block ml-2 font-semibold text-gray-600">
            {partnarName}
          </span>
          <span className="block ml-2 text-sm text-gray-600">
            {moment(timestamp).fromNow()}
          </span>
        </div>
        <span className="block ml-2 text-sm text-gray-600">{message}</span>
      </div>
    </Link>
  );
}
ChatItem.propTypes = {
  conversation: PropTypes.any,
  partnarEmail: PropTypes.any,
  partnarName: PropTypes.any,
};
export default ChatItem;
