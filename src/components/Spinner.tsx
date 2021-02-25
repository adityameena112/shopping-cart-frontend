import { Spinner as Spin, Grid, Progress } from "@chakra-ui/react";

const Spinner = () => {
  return (
    // <Progress
    //   size="xs"
    //   value={50}
    //   colorScheme="appBlue"
    //   // isIndeterminate
    //   hasStripe
    //   isAnimated
    // />
    <Grid placeItems="center" placeContent="center" minH="50vh">
      <Spin
        color="appBlue.500"
        size="xl"
        thickness="4px"
        speed="0.25s"
        // position="absolute"
        // top="-35%"
        // left="0"
        // bottom="0"
        // right="0"
        // margin="auto"
      />
    </Grid>
  );
};

export default Spinner;
