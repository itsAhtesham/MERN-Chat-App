import {lazy, Suspense, useEffect} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProtectRoutes from "./components/auth/ProtectRoutes";
import {LayoutLoader} from "./components/layout/Loaders";
import axios from "axios";
import {server} from "./constants/config.js"
import {useDispatch, useSelector} from "react-redux";
import {userExists, userNotExists} from "./redux/reducers/auth.js";
import {Toaster} from "react-hot-toast"
import {SocketProvider} from "../socket.jsx";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Groups = lazy(() => import("./pages/Groups"));
const Chat = lazy(() => import("./pages/Chat"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
const MessageManagement = lazy(() => import("./pages/admin/MessageManagement.jsx"));

function App() {
    const {user, loader} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        axios.get(`${server}/user/me`, {withCredentials: true})
            .then(({data}) => dispatch(userExists(data.user)))
            .catch(() => dispatch(userNotExists()));
    }, [dispatch]);

    return loader ? <LayoutLoader/> : (
        <BrowserRouter>
            <Suspense fallback={<LayoutLoader/>}>
                <Routes>
                    <Route element={
                        <SocketProvider>
                            <ProtectRoutes user={user}/>
                        </SocketProvider>
                    }>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/chat/:chatId" element={<Chat/>}/>
                        <Route path="/groups" element={<Groups/>}/>
                    </Route>

                    <Route
                        path="/login"
                        element={
                            <ProtectRoutes user={!user} redirect="/">
                                <Login/>
                            </ProtectRoutes>
                        }
                    />

                    <Route path="/admin" element={<AdminLogin/>}/>
                    <Route path="/admin/dashboard" element={<Dashboard/>}/>
                    <Route path="/admin/users" element={<UserManagement/>}/>
                    <Route path="/admin/chats" element={<ChatManagement/>}/>
                    <Route path="/admin/messages" element={<MessageManagement/>}/>

                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Suspense>
            <Toaster position="bottom-center"/>
        </BrowserRouter>
    );
}

export default App;
