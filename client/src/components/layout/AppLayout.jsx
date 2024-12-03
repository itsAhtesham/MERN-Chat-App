import Grid from "@mui/material/Grid2";
import Title from "../shared/Title";
import Header from "./Header";
import ChatList from "../specific/ChatList";
import {useNavigate, useParams} from "react-router-dom";
import Profile from "../specific/Profile";
import {useMyChatsQuery} from "../../redux/api/api.js";
import {Drawer, Skeleton} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {setIsDeleteMenu, setIsMobile, setSelectedDeleteChat} from "../../redux/reducers/misc.js";
import {useErrors, useSocketEvents} from "../../hooks/hook.jsx";
import {getSocket} from "../../../socket.jsx";
import {NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS} from "../../constants/events.js";
import {useCallback, useEffect, useRef, useState} from "react";
import {incrementNotification, setNewMessagesAlert} from "../../redux/reducers/chat.js";
import {getOrSaveFromStorage} from "../../lib/features.js";
import DeleteChatMenu from "../dialogs/DeleteChatMenu.jsx";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();

    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const socket = getSocket();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {isMobile} = useSelector((state) => state.misc);
    const {user} = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const {isLoading, data, isError, error, refetch} = useMyChatsQuery("");

    useErrors([{isError, error}]);

    useEffect(() => {
        getOrSaveFromStorage({key: NEW_MESSAGE_ALERT, value: newMessagesAlert});
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, _id, groupChat) => {
      // e.preventDefault();
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({chatId: _id, groupChat}));
      deleteMenuAnchor.current = e.currentTarget;
    };
    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertListener = useCallback((data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
    }, [dispatch, chatId]);

    const newRequestListener = useCallback(() => {
        dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
        refetch();
        navigate('/');
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
        setOnlineUsers(data)
    }, []);

    const eventHandlers = {
        [NEW_MESSAGE_ALERT]: newMessageAlertListener,
        [NEW_REQUEST]: newRequestListener,
        [REFETCH_CHATS]: refetchListener,
        [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

    return (
      <>
        <Title />
        <Header />

          <DeleteChatMenu dispatch={dispatch} deleteOptionAnchor={deleteMenuAnchor.current}/>

          {
              isLoading ? <Skeleton /> : (
                  <Drawer open={isMobile} onClose={handleMobileClose}>
                      <ChatList
                          w={"70vw"}
                          chats={data?.chats}
                          chatId={chatId}
                          handleDeleteChat={handleDeleteChat}
                          newMeassagesAlert={newMessagesAlert}
                          onlineUsers={onlineUsers}
                      />
                  </Drawer>
              )
          }

        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            size={{ sm: 4, md: 3 }}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
          >
              {
                  isLoading ? <Skeleton /> : (
                      <ChatList
                          chats={data?.chats}
                          chatId={chatId}
                          handleDeleteChat={handleDeleteChat}
                          newMeassagesAlert={newMessagesAlert}
                          onlineUsers={onlineUsers}
                      />
                  )
              }
          </Grid>
          <Grid size={{ xs: 12, sm: 8, md: 5, lg: 6 }} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user}/>
          </Grid>
          <Grid
            size={{ md: 4, lg: 3 }}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0, 0, 0, 0.85)",
            }}
            height={"100%"}
          >
            <Profile user={user}/>
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
