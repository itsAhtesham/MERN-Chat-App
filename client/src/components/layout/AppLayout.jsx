import Grid from "@mui/material/Grid2";
import Title from "../shared/Title";
import Header from "./Header";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    return (
      <>
        <Title />
        <Header />

        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            size={{ sm: 4, md: 3 }}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
          >
            First
          </Grid>
          <Grid
            size={{ xs: 12, sm: 8, md: 5, lg: 6 }}
            height={"100%"}
            bgcolor="primary.main"
          >
            <WrappedComponent {...props} />
          </Grid>
          <Grid
            size={{ md: 4, lg: 3 }}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0, 0, 0, 0.85)",
            }}
            height={"100%"}
          >
            Third
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
