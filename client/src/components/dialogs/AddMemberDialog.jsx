import {Button, Dialog, DialogTitle, Skeleton, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import UserItem from "../shared/UserItem";
import {useDispatch, useSelector} from "react-redux";
import {setIsAddMember} from "../../redux/reducers/misc.js";
import {useAddGroupMembersMutation, useAvailableFriendsQuery} from "../../redux/api/api.js";
import {useAsyncMutation, useErrors} from "../../hooks/hook.jsx";

const AddMemberDialog = ({ chatId }) => {
  const dispatch = useDispatch();

  const {isAddMember} = useSelector(state => state.misc);

  const [addMembers, isLoadingAddMembers] = useAsyncMutation(useAddGroupMembersMutation);
  const {isLoading, isError, error, data} = useAvailableFriendsQuery(chatId);


  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false))
  };

  const addMemberSubmitHandler = () => {
    addMembers("Adding Members", {chatId, members: selectedMembers});
    closeHandler();
  };

  useErrors([{error, isError}]);

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign="center">Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
          {
            isLoading ? <Skeleton /> : data?.friends.length > 0 ? (
                data?.friends.map((i) => (
                    <UserItem
                        key={i._id}
                        user={i}
                        handler={selectMemberHandler}
                        isAdded={selectedMembers.includes(i._id)}
                    />
                ))
            ) : (
                <Typography textAlign="center">No Friends</Typography>
            )
          }
        </Stack>
        <Stack
          direction="row"
          alignItems={"center"}
          justifyContent="space-between"
        >
          <Button color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={isLoadingAddMembers}
            onClick={addMemberSubmitHandler}
          >
            Submit Changes
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
