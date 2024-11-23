import Grid from "@mui/material/Grid2";
import Title from "../shared/Title";
import Header from "./Header";
import ChatList from "../specific/ChatList";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import {useMyChatsQuery} from "../../redux/api/api.js";
import {Drawer, Skeleton} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {setIsMobile} from "../../redux/reducers/misc.js";
import {useErrors, useSocketEvents} from "../../hooks/hook.jsx";
import {getSocket} from "../../../socket.jsx";
import {NEW_MESSAGE_ALERT, NEW_REQUEST} from "../../constants/events.js";
import {useCallback} from "react";
import {incrementNotification} from "../../redux/reducers/chat.js";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;

    const socket = getSocket();

    const dispatch = useDispatch();
    const {isMobile} = useSelector((state) => state.misc);
    const {user} = useSelector((state) => state.auth);

    const {isLoading, data, isError, error, refetch} = useMyChatsQuery("");

    useErrors([{isError, error}])

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("delete Chat", _id, groupChat);
    };
    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertHandler = useCallback(() => {

    }, []);

    const newRequestHandler = useCallback(() => {
        dispatch(incrementNotification())
    }, [dispatch])

    const eventHandlers = {
        [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
        [NEW_REQUEST]: newRequestHandler,
    };

    useSocketEvents(socket, eventHandlers);

    return (
      <>
        <Title />
        <Header />

          {
              isLoading ? <Skeleton /> : (
                  <Drawer open={isMobile} onClose={handleMobileClose}>
                      <ChatList
                          w={"70vw"}
                          chats={data?.chats}
                          chatId={chatId}
                          handleDeleteChat={handleDeleteChat}
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
