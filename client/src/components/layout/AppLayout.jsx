import { Grid } from "@mui/material";
import Title from "../shared/Title";
import Header from "./Header";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    return (
      <>
        <Title />
        <Header />

        <Grid container height={"calc(100vh-4rem)"}>
          <Grid item xs={4} height={"100vh"}>
            First
          </Grid>
          <Grid item xs={4} height={"100vh"} bgcolor="primary.main">
            <WrappedComponent {...props} />
          </Grid>
          <Grid item xs={4} height={"100vh"}>
            Third
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
