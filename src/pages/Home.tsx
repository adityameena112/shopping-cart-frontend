import { Box, Flex, Spinner } from "@chakra-ui/react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import FooterMobile from "../components/FooterMobile";
import React, { lazy, Suspense } from "react";

const Main = lazy(() => import("../components/Main"));

const Home = () => {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Flex flex={1} minH="100%" mt={["120px", "72px"]}>
        <Box
          display={["none", "block"]}
          minH="100%"
          w="220px"
          py={8}
          color="gray.600"
        >
          <Sidebar />
        </Box>
        <Box flex={1} py={[0, 8]}>
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
        </Box>
      </Flex>
      <Footer />
      <FooterMobile />
    </Flex>
  );
};

export default Home;
