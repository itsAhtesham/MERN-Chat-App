import {Button, Container, Stack, Typography} from "@mui/material";
import {Error as ErrorIcon} from "@mui/icons-material";
import {Link} from "react-router-dom";

function NotFound() {
  return <Container maxWidth="lg">
    <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: "100vh" }} spacing={"2rem"}>
      <ErrorIcon sx={{ fontSize: "5rem" }}  />
      <Typography variant="h1" color="textSecondary" component="div">404</Typography>
      <Typography variant="h3" color="textSecondary" component="div">Not Found</Typography>
      <Link to={'/'} style={{ textDecoration: 'none' }} ><Button variant="contained" color="error">Go back to home</Button></Link>
    </Stack>
  </Container>
}

export default NotFound;
