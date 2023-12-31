import { apiSlice } from "../apis/apiSlice";
import { messageApi } from "../messages/messageApi";
import io from "socket.io-client";
export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversation: builder.query({
      query: (email) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${
          import.meta.env.VITE_CONVERSATION_PER_PAGE
        }`,
      transformResponse(apiresponse, meta) {
        const totalCount = meta.response.headers.get("X-Total-Count");
        return {
          data: apiresponse,
          count: totalCount,
        };
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // create socket
        const socket = io("http://localhost:9000", {
          reconnectionDelay: 1000,
          reconnection: true,
          reconnectionAttemps: 10,
          transports: ["websocket"],
          agent: false,
          upgrade: false,
          rejectUnauthorized: false,
        });

        try {
          await cacheDataLoaded;

          socket.on("conversation", (data) => {
            updateCachedData((draft) => {
              const conversation = draft.data.find(
                (c) => c.id == data?.data?.id
              );

              if (conversation?.id) {
                conversation.message = data?.data?.message;
                conversation.timestamp = data?.data?.timestamp;
              } else {
                // do nothing
              }
            });
          });
        } catch (err) {
          //
        }

        await cacheEntryRemoved;
        socket.close();
      },
    }),
    getMoreConversation: builder.query({
      query: ({ email, page }) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=${page}&_limit=${
          import.meta.env.VITE_CONVERSATION_PER_PAGE
        }`,
      async onQueryStarted({ email }, { queryFulfilled, dispatch }) {
        // cache update start
        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.length > 0) {
            // update messages cache pessimistically start
            dispatch(
              apiSlice.util.updateQueryData(
                "getConversation",
                email,
                (draft) => {
                  return {
                    data: [...draft.data, ...conversation.data],
                    count: Number(draft.count),
                  };
                }
              )
            );
            // update messages cache pessimistically end
          }
        } catch (error) {
          // do nothing
        }
      },
    }),
    getConversationOne: builder.query({
      query: ({ userEmail, parEmail }) =>
        `/conversations?participants_like=${userEmail}-${parEmail}&&participants_like=${parEmail}-${userEmail}`,
    }),
    addConversation: builder.mutation({
      query: ({ sender, data }) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const conversation = await queryFulfilled;
        if (conversation?.data?.id) {
          // silent entry to message table
          const users = arg.data.users;
          const senderUser = users.find((user) => user.email === arg.sender);
          const receiverUser = users.find((user) => user.email !== arg.sender);

          dispatch(
            messageApi.endpoints.addMessage.initiate({
              conversationId: conversation?.data?.id,
              sender: senderUser,
              receiver: receiverUser,
              message: arg.data.message,
              timestamp: arg.data.timestamp,
            })
          );
        }
      },
    }),
    editConversation: builder.mutation({
      query: ({ data, id, sender }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        // cache update start
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getConversation",
            arg.sender,
            (draft) => {
              const draftConversation = draft.data.find((c) => c.id == arg.id);
              draftConversation.message = arg.data.message;
              draftConversation.timestamp = arg.data.timestamp;
            }
          )
        );
        // optimistic cache update end
        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            // silent entry to message table
            const users = arg.data.user;
            const senderUsers = users.find((user) => user.email === arg.sender);
            const receiverUsers = users.find(
              (user) => user.email !== arg.sender
            );
            const res = await dispatch(
              messageApi.endpoints.addMessage.initiate({
                conversationId: conversation.data.id,
                sender: senderUsers,
                receiver: receiverUsers,
                message: arg.data.message,
                timestamp: arg.data.timestamp,
              })
            ).unwrap();

            // update messages cache pessimistically start
            dispatch(
              apiSlice.util.updateQueryData(
                "getMessages",
                res.conversationId.toString(),
                (draft) => {
                  draft.push(res);
                }
              )
            );
            // update messages cache pessimistically end
          }
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetConversationQuery,
  useGetConversationOneQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationApi;
