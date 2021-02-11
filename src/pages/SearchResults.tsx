import { useParams } from "react-router-dom";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  Grid,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import ProductCard from "../components/ProductCard";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import Container from "../components/Container";

interface ParamsTypes {
  name: string;
}

const SearchResults = () => {
  const { products } = useContext(GlobalContext);
  const { name } = useParams<ParamsTypes>();
  const searchedProducts = products!.filter(
    product =>
      (product &&
        product.title &&
        product.title.toLowerCase().includes(name.toLowerCase())) ||
      (product.description &&
        product.description.toLowerCase().includes(name.toLowerCase())) ||
      (product.shortDescription &&
        product.shortDescription.toLowerCase().includes(name.toLowerCase()))
  );
  return (
    <Container>
      <Box p={3}>
        <Breadcrumb
          fontSize="sm"
          spacing="8px"
          mb={6}
          color="gray.500"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">Product</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Grid
          p={3}
          templateColumns="repeat(auto-fit, minmax(240px, 1fr))"
          gap={3}
          placeItems="center"
          placeContent="center"
        >
          {searchedProducts.length > 0 ? (
            searchedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <Text>No products found</Text>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default SearchResults;
