import { Box } from '@chakra-ui/react';
import React, { ReactNode } from 'react'

interface GameCardContainerProps {
    children: ReactNode;
}

const GameCardContainer = ({children}: GameCardContainerProps) => {
  return (
    <Box height= '70vh' width="100%" borderRadius ={10} overflow="hidden">
        {children}
    </Box>
  )
}

export default GameCardContainer