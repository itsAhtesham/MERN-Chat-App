import {Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography,} from "@mui/material";
import {useFileHandler, useInputValidation} from "6pp";
import {CameraAlt as CameraAltIcon} from "@mui/icons-material";
import {useState} from "react";
import {VisuallyHiddenInput} from "../components/styles/StyledComponents";
import {userNameValidator} from "../utils/validators";
import {bgGradient} from "../constants/color";
import axios from "axios";
import {server} from "../constants/config.js";
import {useDispatch} from "react-redux";
import {userExists} from "../redux/reducers/auth.js";
import toast from "react-hot-toast";

function Login() {
    const dispatch = useDispatch()
    const [isLogin, setIsLogin] = useState(true);

    const toggleLogin = () => setIsLogin((c) => !c);

    const name = useInputValidation("");
    const username = useInputValidation("", userNameValidator);
    const bio = useInputValidation("");
    const password = useInputValidation("");

    const avatar = useFileHandler("single");

    const handleLogin = async (e) => {
        e.preventDefault();
        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            },
        }
        try {
            const {data} = await axios.post(`${server}/user/login`, {
                username: username.value,
                password: password.value,
            }, config);

            dispatch(userExists(true));
            toast.success(data.message);
        } catch (e) {
            toast.error(e?.response?.data?.message || "Something went wrong");
        }
    };
    const handleSignUp = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name.value);
        formData.append("username", username.value);
        formData.append("bio", bio.value);
        formData.append("password", password.value);
        formData.append("avatar", avatar.file);

        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
        try {
            const {data} = await axios.post(`${server}/user/new`, formData, config);
            dispatch(userExists(true));
            toast.success(data.message);
        } catch (e) {
            toast.error(e?.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div
            style={{
                backgroundImage: bgGradient,
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div>
                <Container
                    component={"main"}
                    maxWidth="xs"
                    sx={{
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            height: "fit-content",
                            padding: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        {isLogin ? (
                            <>
                                <Typography variant="h5">Login</Typography>
                                <form
                                    style={{
                                        width: "100%",
                                        marginTop: "1rem",
                                    }}
                                    onSubmit={handleLogin}
                                >
                                    <TextField
                                        required
                                        fullWidth
                                        label="Username"
                                        margin="normal"
                                        variant="outlined"
                                        value={username.value}
                                        onChange={username.changeHandler}
                                    />

                                    {username.error && (
                                        <Typography color="error" variant="caption">
                                            {username.error}
                                        </Typography>
                                    )}

                                    <TextField
                                        required
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        margin="normal"
                                        variant="outlined"
                                        value={password.value}
                                        onChange={password.changeHandler}
                                    />
                                    <Button
                                        sx={{
                                            marginTop: "1rem",
                                        }}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        fullWidth
                                    >
                                        Login
                                    </Button>

                                    <Typography textAlign="center" m={"1rem"}>
                                        OR
                                    </Typography>

                                    <Button
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "primary.dark",
                                                color: "white"
                                            },
                                        }}
                                        variant="outlined"
                                        type="submit"
                                        fullWidth
                                        onClick={toggleLogin}
                                    >
                                        SignUp instead
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div>
                                <Typography variant="h5">Sign Up</Typography>
                                <form
                                    style={{
                                        width: "100%",
                                        marginTop: "1rem",
                                    }}
                                    onSubmit={handleSignUp}
                                >
                                    <Stack position="relative" width={"10rem"} margin={"auto"}>
                                        <Avatar
                                            sx={{
                                                width: "10rem",
                                                height: "10rem",
                                                objectFit: "contain",
                                            }}
                                            src={avatar.preview}
                                        />
                                        <IconButton
                                            sx={{
                                                position: "absolute",
                                                bottom: 0,
                                                right: 0,
                                                color: "white",
                                                bgcolor: "rgba(0, 0, 0, 0.5)",
                                                ":hover": {
                                                    bgcolor: "rgba(0, 0, 0, 0.7)",
                                                },
                                            }}
                                            component={"label"}
                                        >
                                            <CameraAltIcon/>
                                            <VisuallyHiddenInput
                                                type="file"
                                                onChange={avatar.changeHandler}
                                            />
                                        </IconButton>
                                    </Stack>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Name"
                                        margin="normal"
                                        variant="outlined"
                                        value={name.value}
                                        onChange={name.changeHandler}
                                    />
                                    <TextField
                                        required
                                        fullWidth
                                        label="Bio"
                                        margin="normal"
                                        variant="outlined"
                                        value={bio.value}
                                        onChange={bio.changeHandler}
                                    />
                                    <TextField
                                        required
                                        fullWidth
                                        label="Username"
                                        margin="normal"
                                        variant="outlined"
                                        value={username.value}
                                        onChange={username.changeHandler}
                                    />

                                    {username.error && (
                                        <Typography color="error" variant="caption">
                                            {username.error}
                                        </Typography>
                                    )}

                                    <TextField
                                        required
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        margin="normal"
                                        variant="outlined"
                                        value={password.value}
                                        onChange={password.changeHandler}
                                    />
                                    <Button
                                        sx={{
                                            marginTop: "1rem",
                                        }}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        fullWidth
                                    >
                                        Sign Up
                                    </Button>

                                    <Typography textAlign="center" m={"1rem"}>
                                        OR
                                    </Typography>

                                    <Button
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "primary.dark",
                                                color: "white"
                                            },
                                        }}
                                        variant="outlined"
                                        type="submit"
                                        fullWidth
                                        onClick={toggleLogin}
                                    >
                                        Login instead
                                    </Button>
                                </form>
                            </div>
                        )}
                    </Paper>
                </Container>
            </div>
        </div>
    );
}

export default Login;
