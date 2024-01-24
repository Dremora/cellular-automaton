import '@mantine/core/styles.css';

import {
  AppShell,
  Checkbox,
  Flex,
  InputWrapper,
  MantineProvider,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { Canvas } from './canvas';
import { theme } from './theme';
import { GradualBlur, Operation } from './gradual-blur';
import { useEffect, useState } from 'react';

export default function App() {
  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(1000);
  const [iterations, setIterations] = useState(10000);
  const [operation, setOperation] = useState<Operation>('replace');
  const [monochrome, setMonochrome] = useState(false);
  const [automaton, setAutomaton] = useState(
    new GradualBlur({ width, height, iterations, operation, monochrome })
  );

  useEffect(() => {
    setAutomaton(
      new GradualBlur({ width, height, iterations, operation, monochrome })
    );
  }, [width, height, iterations, operation, monochrome]);

  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <AppShell
        transitionDuration={500}
        transitionTimingFunction="ease"
        navbar={{
          width: 300,
          breakpoint: 'sm',
        }}
      >
        <AppShell.Navbar p="md">
          <Stack gap="md">
            <TextInput
              placeholder="200"
              label="Width"
              value={width}
              type="number"
              onChange={(e) => setWidth(+e.currentTarget.value)}
            />
            <TextInput
              placeholder="200"
              label="Height"
              value={height}
              type="number"
              onChange={(e) => setHeight(+e.currentTarget.value)}
            />
            <TextInput
              placeholder="100"
              label="Iterations"
              value={iterations}
              type="number"
              onChange={(e) => setIterations(+e.currentTarget.value)}
            />
            <InputWrapper label="Operation">
              <Select
                data={['blur', 'replace']}
                value={operation}
                onChange={(operation) => setOperation(operation as Operation)}
              />
            </InputWrapper>
            <Checkbox
              label="Monochrome"
              checked={monochrome}
              onChange={() => setMonochrome(!monochrome)}
            />
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main display="flex">
          <Flex direction="column" flex="1" pos="relative">
            <Canvas automaton={automaton} />
          </Flex>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
