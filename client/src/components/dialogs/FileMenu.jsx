import {ListItemText, Menu, MenuItem, MenuList} from "@mui/material";
import React, {useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setIsFileMenu, setUploadingLoader} from "../../redux/reducers/misc.js";
import {
    AudioFile as AudioFileIcon,
    Image as ImageIcon,
    UploadFile as UploadFileIcon,
    VideoFile as VideoFileIcon
} from "@mui/icons-material";
import toast from "react-hot-toast";
import {useSendAttachmentsMutation} from "../../redux/api/api.js";

const FileMenu = ({anchorE1, chatId}) => {
    const dispatch = useDispatch();
    const {isFileMenu} = useSelector((state) => state.misc);

    const [sendAttachments] = useSendAttachmentsMutation();

    const imageRef = useRef(null);
    const audioRef = useRef(null);
    const videoRef = useRef(null);
    const fileRef = useRef(null);

    const handleClose = () => {
        dispatch(setIsFileMenu(false))
    }

    const fileChangeHandler = async (e, key) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        if (files.length > 5) return toast.error(`Can select only upto 5 ${key}`);

        dispatch(setUploadingLoader(true));

        const toastId = toast.loading(`Sending ${key}`);
        handleClose();

        try {
            const formData = new FormData();
            formData.append("chatId", chatId);
            files.forEach((file) => formData.append("files", file))
            const resp = await sendAttachments(formData);
            if (resp.data) toast.success(`${key} sent successfully`, {id: toastId});
            else toast.error(resp.error?.message || `Failed to send ${key}`, {id: toastId});
        } catch (e) {
            toast.error(e, {id: toastId});
        } finally {
            dispatch(setUploadingLoader(false))
        }
    }

    const selectImage = () => imageRef.current?.click();
    const selectAudio = () => audioRef.current?.click();
    const selectVideo = () => videoRef.current?.click();
    const selectFile = () => fileRef.current?.click();

    return (
        <Menu anchorEl={anchorE1} open={isFileMenu} onClose={handleClose}>
            <div style={{
                width: "10rem",
            }}>
                <MenuList>
                    <MenuItem onClick={selectImage}>
                        <ImageIcon/>
                        <ListItemText sx={{marginLeft: "0.5rem"}}>Image</ListItemText>
                        <input type={"file"}
                               multiple
                               accept={"image/jpg, image/jpeg, image/gif"}
                               style={{display: "none"}}
                               onChange={(e) => fileChangeHandler(e, "Images")}
                               ref={imageRef}
                        />
                    </MenuItem>

                    <MenuItem onClick={selectAudio}>
                        <AudioFileIcon/>
                        <ListItemText sx={{marginLeft: "0.5rem"}}>Audio</ListItemText>
                        <input type={"file"} multiple accept={"audio/mpeg, audio/wav"}
                               ref={audioRef}
                               style={{display: "none"}} onChange={(e) => fileChangeHandler(e, "Audios")}/>
                    </MenuItem>


                    <MenuItem onClick={selectVideo}>
                        <VideoFileIcon/>
                        <ListItemText sx={{marginLeft: "0.5rem"}}>Video</ListItemText>
                        <input type={"file"} multiple accept={"video/mp4, video/webm, video/ogg, video/mkv"}
                               ref={videoRef}
                               style={{display: "none"}} onChange={(e) => fileChangeHandler(e, "Videos")}/>
                    </MenuItem>


                    <MenuItem onClick={selectFile}>
                        <UploadFileIcon/>
                        <ListItemText sx={{marginLeft: "0.5rem"}}>File</ListItemText>
                        <input type={"file"} multiple accept={"*"}
                               ref={fileRef}
                               style={{display: "none"}} onChange={(e) => fileChangeHandler(e, "Files")}/>
                    </MenuItem>
                </MenuList>
            </div>
        </Menu>
    );
};

export default FileMenu;
