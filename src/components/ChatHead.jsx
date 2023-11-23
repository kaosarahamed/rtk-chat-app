import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import getAvater from "gravatar-url";

function ChatHead({ messages }) {
  const { sender, receiver } = messages || {};
  const { user } = useSelector((state) => state.auth);
  const { email } = user || {};
  const partnerEmail = sender.email === email ? receiver.email : sender.email;
  const partnerName = sender.email === email ? receiver.name : sender.name;
  return (
    <div className="relative flex items-center p-3 border-b border-gray-300">
      <img
        className="object-cover w-10 h-10 rounded-full"
        src={getAvater(partnerEmail)}
        alt={partnerName}
      />
      <span className="block ml-2 font-bold text-gray-600">{partnerName}</span>
      <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
    </div>
  );
}

ChatHead.propTypes = {
  messages: PropTypes.any,
};

export default ChatHead;
