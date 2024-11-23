import io from 'socket.io-client'
import {createContext, useContext, useMemo} from "react";
import {baseServer} from "./src/constants/config.js";

const SocketContext = createContext();

const SocketProvider = ({children}) => {
    const socket = useMemo(() => (
        io(baseServer, {
            withCredentials: true,
        })
    ), [])

    // socket.on("connect_error", (err) => {
    //     console.log(err.message);
    //     console.log(err.description);
    //     console.log(err.context);
    // });

    return <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
}

const getSocket = () => useContext(SocketContext);

export {
    getSocket,
    SocketProvider,
}