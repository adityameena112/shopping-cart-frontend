import { Spinner } from "@chakra-ui/react";

import { lazy, Suspense } from "react";
import Container from "../components/Container";

const Main = lazy(() => import("../components/Main"));

const Home = () => {
  return (
    <Container>
      <Suspense
        fallback={
          <Spinner
            color="appBlue.500"
            size="xl"
            thickness="4px"
            position="absolute"
            top="-35%"
            left="0"
            bottom="0"
            right="0"
            margin="auto"
          />
        }
      >
        <Main />
      </Suspense>
    </Container>
  );
};

export default Home;
