import PropTypes from "prop-types";
import { useSelector } from "react-redux";

function Messages({ messages }) {
  const auth = useSelector((state) => state.auth);
  const { email } = auth.user || {};
  return (
    <div className="relative w-full p-6 overflow-y-auto">
      <ul className="space-y-2">
        {messages
          ?.slice()
          ?.sort((a, b) => a.timestamp - b.timestamp)
          ?.map((item) => {
            const { message, sender } = item || {};
            const justify = sender.email !== email ? "start" : "end";
            return (
              <li key={item.id} className={`flex justify-${justify}`}>
                <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                  <span className="block">{message}</span>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
Messages.propTypes = {
  messages: PropTypes.any,
};
export default Messages;
