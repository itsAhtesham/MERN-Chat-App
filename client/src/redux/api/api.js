import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {server} from "../../constants/config.js";

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/`,
    }),
    tagTypes: ["Chat", "User", "Message", "Admin"],
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
            keepUnusedDataFor: 0,
        }),

        sendAttachments: builder.mutation({
            query: (data) => ({
                url: `chat/message`,
                method: "POST",
                credentials: "include",
                body: data
            }),
        }),

        myGroups: builder.query({
            query: () => ({
                url: `chat/my/groups`,
                credentials: "include"
            }),
            providesTags: ["Chat"]
        }),

        availableFriends: builder.query({
            query: (chatId) => {
                let url = `user/friends`;
                if (chatId) url += `?chatId=${chatId}`;

                return {
                    url,
                    credentials: "include"
                }
            },
            providesTags: ["Chat"]
        }),

        newGroup: builder.mutation({
            query: ({name, members}) => ({
                url: `chat/new`,
                method: "POST",
                credentials: "include",
                body: {name, members}
            }),
            invalidatesTags: ["Chat"]
        }),

        renameGroup: builder.mutation({
            query: ({chatId, name}) => ({
                url: `chat/${chatId}`,
                method: "PUT",
                credentials: "include",
                body: { name }
            }),
            invalidatesTags: ["Chat"]
        }),

        removeGroupMember: builder.mutation({
            query: ({chatId, userId}) => ({
                url: `chat/remove-member`,
                method: "PUT",
                credentials: "include",
                body: { chatId, userId }
            }),
            invalidatesTags: ["Chat"]
        }),

        addGroupMembers: builder.mutation({
            query: ({chatId, members}) => ({
                url: `chat/add-members`,
                method: "PUT",
                credentials: "include",
                body: { chatId, members }
            }),
            invalidatesTags: ["Chat"]
        }),

        deleteChat: builder.mutation({
            query: (chatId) => ({
                url: `chat/${chatId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Chat"]
        }),

        leaveGroup: builder.mutation({
            query: (chatId) => ({
                url: `chat/leave/${chatId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Chat"]
        }),

        dashboardStats: builder.query({
            query: () => ({
                url: `admin/dashboard/stats`,
                credentials: "include"
            }),
            providesTags: ["Admin"]
        }),

        adminUsers: builder.query({
            query: () => ({
                url: `admin/users`,
                credentials: "include"
            }),
            providesTags: ["Admin"]
        }),

        adminMessages: builder.query({
            query: () => ({
                url: `admin/messages`,
                credentials: "include"
            }),
            providesTags: ["Admin"]
        }),

        adminChats: builder.query({
            query: () => ({
                url: `admin/chats`,
                credentials: "include"
            }),
            providesTags: ["Admin"]
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
    useSendAttachmentsMutation,
    useMyGroupsQuery,
    useAvailableFriendsQuery,
    useNewGroupMutation,
    useRenameGroupMutation,
    useRemoveGroupMemberMutation,
    useAddGroupMembersMutation,
    useDeleteChatMutation,
    useLeaveGroupMutation,
    useDashboardStatsQuery,
    useAdminUsersQuery,
    useAdminMessagesQuery,
    useAdminChatsQuery,
} = api;
