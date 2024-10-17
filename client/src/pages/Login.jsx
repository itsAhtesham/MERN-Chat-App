import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Stack,
  Avatar,
  IconButton,
} from "@mui/material";
import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import React, { useState } from "react";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { userNameValidator } from "../utils/validators";

function Login() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleLogin = () => setIsLogin((c) => !c);

  const name = useInputValidation("");
  const username = useInputValidation("", userNameValidator);
  const bio = useInputValidation("");
  const password = useInputValidation("");

  const avatar = useFileHandler("single");

  const handleLogin = (e) => {
    e.preventDefault();
  };
  const handleSignUp = (e) => {
    e.preventDefault();
  };

  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,158,0.5691526610644257) 35%, rgba(252,176,69,1) 100%)",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={
          {
            // height: "300px",
            // height: "fit-content",
            // border: "2px black dotted",
          }
        }
      >
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

                  <Typography textAlign={"center"} m={"1rem"}>
                    OR
                  </Typography>

                  <Button
                    sx={{
                      "&:hover": {
                        backgroundColor: "primary.dark",
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
              <div
              // style={{
              //   height: "400px",
              //   border: "4px red groove",
              // }}
              >
                <Typography variant="h5">Sign Up</Typography>
                <form
                  style={{
                    width: "100%",
                    marginTop: "1rem",
                  }}
                  onSubmit={handleSignUp}
                >
                  <Stack position={"relative "} width={"10rem"} margin={"auto"}>
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
                      <CameraAltIcon />
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

                  <Typography textAlign={"center"} m={"1rem"}>
                    OR
                  </Typography>

                  <Button
                    sx={{
                      "&:hover": {
                        backgroundColor: "primary.dark",
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
