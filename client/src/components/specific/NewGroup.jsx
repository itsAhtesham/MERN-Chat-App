import {useInputValidation} from "6pp";
import {Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography,} from "@mui/material";
import {useState} from "react";
import UserItem from "../shared/UserItem";
import {useDispatch, useSelector} from "react-redux";
import {useAvailableFriendsQuery, useNewGroupMutation} from "../../redux/api/api.js";
import {useAsyncMutation, useErrors} from "../../hooks/hook.jsx";
import {setIsNewGroup} from "../../redux/reducers/misc.js";
import toast from "react-hot-toast";

const NewGroup = () => {
    const dispatch = useDispatch();

    const {isNewGroup} = useSelector((state) => state.misc)

    const {isError, isLoading, error, data} = useAvailableFriendsQuery();
    const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation)

    const errors = [{
        isError,
        error,
    }]

    useErrors(errors);

    // const [members, setMembers] = useState(sampleUsers);
    const [selectedMembers, setSelectedMembers] = useState([]);

    const groupName = useInputValidation("");

    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const submitHandler = () => {
        if (!groupName.value) return toast.error("Group Name is required");
        if (selectedMembers.length < 2) return toast.error("Please select at least 3 members");

        newGroup("Creating new Group", {name: groupName.value, members:selectedMembers});

        closeHandler();
    };
    const closeHandler = () => {
        dispatch(setIsNewGroup(false))
    };

    return (
        <Dialog open={isNewGroup} onClose={closeHandler}>
            <Stack p={{xs: "1rem", sm: "3rem"}} width={"25rem"} spacing={"2rem"}>
                <DialogTitle textAlign={"center"} variant="h4">
                    New Group
                </DialogTitle>

                <TextField
                    label="Group Name"
                    value={groupName.value}
                    onChange={groupName.changeHandler}
                    required
                />

                <Typography variant="body1">Members</Typography>

                <Stack>
                    {isLoading ? <Skeleton/> : data?.friends.map((i) => (
                        <UserItem
                            user={i}
                            key={i._id}
                            handler={selectMemberHandler}
                            isAdded={selectedMembers.includes(i._id)}
                        />
                    ))}
                </Stack>

                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Button variant="outlined" color="error" size="large" onClick={closeHandler}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={submitHandler}
                        disabled={isLoadingNewGroup}
                    >
                        Create
                    </Button>
                </Stack>
            </Stack>
        </Dialog>
    );
};

export default NewGroup;
