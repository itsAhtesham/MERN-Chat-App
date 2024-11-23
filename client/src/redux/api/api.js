import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {server} from "../../constants/config.js";

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/`,
    }),
    tagTypes: ["Chat", "User", "Message"],
    endpoints: (builder) => ({
        myChats: builder.query({
            query: () => ({
                url: "chat/my",
                credentials: "include"
            }),
            providesTags: ["Chat"]
        }),
        searchUser: builder.query({
            query: (name) => ({
                url: name ? `user/search?name=${name}` : `user/search`,
                credentials: "include"
            }),
            providesTags: ["User"]
        }),

        sendFriendRequest: builder.mutation({
            query: (data) => ({
                url: `user/send-request`,
                method: "PUT",
                credentials: "include",
                body: data
            }),
            invalidatesTags: ["User"]
        }),

        getNotifications: builder.query({
            query: () => ({
                url: `user/notifications`,
                credentials: "include"
            }),
            keepUnusedDataFor: 0
        }),

        acceptFriendRequest: builder.mutation({
            query: (data) => ({
                url: `user/accept-request`,
                method: "PUT",
                credentials: "include",
                body: data
            }),
            invalidatesTags: ["Chat"]
        }),

        chatDetails: builder.query({
            query: ({chatId, populate = false}) => ({
                url: `chat/${chatId}?populate=${populate}`,
                credentials: "include"
            }),
            providesTags: ["Chat"]
        }),

        getMessages: builder.query({
            query: ({chatId, page}) => ({
                url: `chat/${chatId}/messages?page=${page}`,
                credentials: "include"
            }),
            providesTags: ["Message"]
        }),

        sendAttachments: builder.mutation({
            query: (data) => ({
                url: `chat/message`,
                method: "POST",
                credentials: "include",
                body: data
            }),
        }),
    })
});

export default api;
export const {
    useMyChatsQuery,
    useLazySearchUserQuery,
    useSendFriendRequestMutation,
    useGetNotificationsQuery,
    useAcceptFriendRequestMutation,
    useChatDetailsQuery,
    useGetMessagesQuery,
    useSendAttachmentsMutation
} = api;
