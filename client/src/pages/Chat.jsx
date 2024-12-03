import {AttachFile as AttachFileIcon, Send as SendIcon,} from "@mui/icons-material";
import {IconButton, Skeleton, Stack} from "@mui/material";
import {useCallback, useEffect, useRef, useState} from "react";
import FileMenu from "../components/dialogs/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import MessageComponent from "../components/shared/MessageComponent";
import {InputBox} from "../components/styles/StyledComponents";
import {grayColor, orange} from "../constants/color";
import {getSocket} from "../../socket.jsx";
import {useInfiniteScrollTop} from "6pp";
import {ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING} from "../constants/events.js";
import {useChatDetailsQuery, useGetMessagesQuery} from "../redux/api/api.js";
import {useErrors, useSocketEvents} from "../hooks/hook.jsx";
import {useDispatch} from "react-redux";
import {setIsFileMenu} from "../redux/reducers/misc.js";
import {removeNewMessagesAlert} from "../redux/reducers/chat.js";
import {TypingLoader} from "../components/layout/Loaders.jsx";
import {useNavigate} from "react-router-dom";

function Chat({chatId, user}) {
    const socket = getSocket();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const containerRef = useRef(null);
    const bottomRef = useRef(null);

    const [message, setMessage] = useState("");
    const [page, setPage] = useState(1);
    const [messages, setMessages] = useState([]);
    const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
    const [IamTyping, setIamTyping] = useState(false);
    const [userTyping, setUserTyping] = useState(false);
    const typingTimeout = useRef(null);

    const chatDetails = useChatDetailsQuery({chatId, skip: !chatId})
    const oldMessagesChunk = useGetMessagesQuery({chatId, page})

    const {data: oldMessages, setData: setOldMessages} = useInfiniteScrollTop(
        containerRef,
        oldMessagesChunk.data?.totalPages,
        page,
        setPage,
        oldMessagesChunk.data?.messages
    )

    const errors = [
        {isError: chatDetails.isError, error: chatDetails.error},
        {isError: oldMessagesChunk.isError, error: oldMessagesChunk.error},
    ]

    useErrors(errors);

    const allMessages = [...oldMessages, ...messages];

    const members = chatDetails?.data?.chat?.members;

    const messageOnChange = (e) => {
        setMessage(e.target.value);
        if (!IamTyping) {
            socket.emit(START_TYPING, {members, chatId});
            setIamTyping(true);
        }

        if (typingTimeout.current) clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
            socket.emit(STOP_TYPING, {members, chatId});
            setIamTyping(false);
        }, 2000)
    }

    const handleFileOpen = (e) => {
        dispatch(setIsFileMenu(true));
        setFileMenuAnchor(e.currentTarget)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        socket.emit(NEW_MESSAGE, {chatId, members, message});
        setMessage("")
    }

    useEffect(() => {

        socket.emit(CHAT_JOINED, { userId: user._id, members })
        dispatch(removeNewMessagesAlert(chatId));

        return () => {
            setMessage("");
            setMessages([]);
            setOldMessages([]);
            setPage(1);
            socket.emit(CHAT_LEAVED, { userId: user._id, members })
        }
    }, [chatId, dispatch]);

    useEffect(() => {
        if (bottomRef.current) bottomRef.current.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    useEffect(() => {
        if (chatDetails.isError) return navigate('/');
    }, [chatDetails.isError, navigate]);

    const newMessageListener = useCallback((data) => {
        if (data.chatId !== chatId) return;
        setMessages(prev => [...prev, data.message])
    }, [chatId]);

    const startTypingListener = useCallback((data) => {
        if (data.chatId !== chatId) return;
        setUserTyping(true);
    }, [chatId])

    const stopTypingListener = useCallback((data) => {
        if (data.chatId !== chatId) return;
        setUserTyping(false);
    }, [chatId])

    const alertListener = useCallback((data) => {
        if (data.chatId !== chatId) return;
        const messageForAlert = {
            content: data.message,
            sender: {
                _id: "lkjnbwdevnjm",
                name: "Admin",
            },
            chat: chatId,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, messageForAlert])
    }, [chatId])

    const eventHandlers = {
        [ALERT]: alertListener,
        [NEW_MESSAGE]: newMessageListener,
        [START_TYPING]: startTypingListener,
        [STOP_TYPING]: stopTypingListener,
    };

    useSocketEvents(socket, eventHandlers);


    return (
        chatDetails.isLoading ? <Skeleton/> :
            <>
                <Stack
                    ref={containerRef}
                    boxSizing="border-box"
                    bgcolor={grayColor}
                    padding={"1rem"}
                    spacing={"1rem"}
                    height={"90%"}
                    sx={{
                        overflowX: "hidden",
                        overflowY: "auto",
                        "&::-webkit-scrollbar": {
                            width: "12px",
                        },
                        "&::-webkit-scrollbar-track": {
                            WebkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
                            borderRadius: "10px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            borderRadius: "10px",
                            WebkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.5)",
                        },
                    }}
                >
                    {
                        allMessages.map((i) => (
                            <MessageComponent message={i} user={user} key={i._id}/>
                        ))
                    }

                    {userTyping && <TypingLoader/>}
                    <div ref={bottomRef}/>

                </Stack>

                <form
                    style={{
                        height: "10%",
                    }}
                    onSubmit={handleSubmit}
                >
                    <Stack
                        direction="row"
                        height={"100%"}
                        padding={"1rem"}
                        alignItems={"center"}
                        position="relative"
                    >
                        <IconButton
                            sx={{
                                position: "absolute",
                                left: "1.5rem",
                                rotate: "30deg",
                            }}
                            onClick={handleFileOpen}
                        >
                            <AttachFileIcon/>
                        </IconButton>

                        <InputBox placeholder="Type a message..." value={message}
                                  onChange={messageOnChange}/>

                        <IconButton
                            type="submit"
                            sx={{
                                rotate: "-30deg",
                                bgcolor: orange,
                                color: "white",
                                marginLeft: "1rem",
                                padding: "0.5rem",
                                "&:hover": {
                                    bgcolor: "error.dark",
                                    ...(message.length === 0 && {
                                        cursor: "not-allowed",
                                    })
                                },
                            }}
                        >
                            <SendIcon/>
                        </IconButton>
                    </Stack>
                </form>

                <FileMenu anchorE1={fileMenuAnchor} chatId={chatId}/>
            </>
    );
}

export default AppLayout()(Chat);
