import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import {useEffect, useState} from "react";
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem";
import {useDispatch, useSelector} from "react-redux";
import {setIsSearch} from "../../redux/reducers/misc.js";
import {useLazySearchUserQuery, useSendFriendRequestMutation} from "../../redux/api/api.js";
import {useAsyncMutation} from "../../hooks/hook.jsx";

const Search = () => {
  const dispatch = useDispatch();
  const {isSearch} = useSelector((state) => state.misc)

  const [searchUser] = useLazySearchUserQuery("");
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);
  const search = useInputValidation("");

  const addFriendHandler = async (id) => {
      await sendFriendRequest("Sending Friend Request",{userId: id});
  };

  const [users, setUsers] = useState([]);

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value).then(({data}) => {setUsers(data.users)}).catch((e) => console.log(e));
    }, 500)

    return () => clearTimeout(timeOutId);
  }, [search.value, searchUser]);

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction="column" width={"25rem"}>
        <DialogTitle textAlign="center">Find People</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List>
          {users.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
