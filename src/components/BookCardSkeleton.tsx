import { Card, CardBody, Skeleton, SkeletonText } from "@chakra-ui/react";

const BookCardSkeleton = () => {
  return (
    <Card width="300px">
      <Skeleton borderRadius={10} height="40vh" width="100%"/>
      <CardBody>
        <SkeletonText />
      </CardBody>
    </Card>
  );
};
export default BookCardSkeleton;
