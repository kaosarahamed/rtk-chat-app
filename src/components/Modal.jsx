import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import IsValidEmail from "../redux/rtk/utility/isValidEmail";
import { useGetUserQuery } from "../redux/rtk/features/users/userApi";
import { useDispatch, useSelector } from "react-redux";
import {
  conversationApi,
  useAddConversationMutation,
  useEditConversationMutation,
} from "../redux/rtk/features/conversation/conversationApi";

export default function Modal({ open, control }) {
  const [to, setTo] = useState("");
  const [resError, setResError] = useState("");
  const [conversation, setconversation] = useState(undefined);
  const [userCheck, setUserCheck] = useState(false);
  const { user: loggedInUser } = useSelector((state) => state.auth) || {};
  const { email: myEmail } = loggedInUser || {};
  const { data } = useGetUserQuery(to, {
    skip: !userCheck,
  });
  const [addConversation, { isSuccess: isAddConSucess }] =
    useAddConversationMutation();
  const [editConversation, { isSuccess: isEditConSucess }] =
    useEditConversationMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (data?.length > 0 && data[0].email !== myEmail) {
      // check converstions esistance
      dispatch(
        conversationApi.endpoints.getConversationOne.initiate({
          userEmail: myEmail,
          parEmail: to,
        })
      )
        .unwrap()
        .then((res) => {
          setconversation(res);
        })
        .catch((err) => {
          setResError(err);
        });
    }
  }, [data, myEmail, to, dispatch]);
  useEffect(() => {
    if (isAddConSucess || isEditConSucess) {
      control();
    }
  }, [isEditConSucess, isAddConSucess]);
  const [message, setMessage] = useState("");
  const doSearch = (value) => {
    if (IsValidEmail(value)) {
      setUserCheck(true);
      setTo(value);
    }
  };
  const debounceHandler = (fn, delay) => {
    let timeOutId;
    return (...arg) => {
      clearTimeout(timeOutId);
      timeOutId = setTimeout(() => {
        fn(...arg);
      }, delay);
    };
  };
  const handleSearch = debounceHandler(doSearch, 500);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (conversation?.length > 0) {
      // edit converstation
      editConversation({
        id: conversation[0].id,
        sender: myEmail,
        data: {
          participants: `${myEmail}-${data[0].email}`,
          user: [loggedInUser, data[0]],
          message,
          timestamp: new Date().getTime(),
        },
      });
    } else if (conversation?.length === 0) {
      addConversation({
        sender: myEmail,
        data: {
          participants: `${myEmail}-${data[0].email}`,
          user: [loggedInUser, data[0]],
          message,
          timestamp: new Date().getTime(),
        },
      });
    }
  };
  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        ></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Send message
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  onChange={(e) => handleSearch(e.target.value)}
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  type="message"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={
                  conversation === undefined ||
                  (data?.length > 0 && data[0].email === myEmail)
                }
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                Send Message
              </button>
            </div>

            {data?.length === 0 && <div>This user does not exist!</div>}
            {resError && <div>{resError}</div>}
            {data?.length > 0 && data[0].email === myEmail && (
              <div>You can not send message to your self</div>
            )}
          </form>
        </div>
      </>
    )
  );
}

Modal.propTypes = {
  open: PropTypes.any,
  control: PropTypes.any,
};
