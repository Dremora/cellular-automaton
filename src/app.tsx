import '@mantine/core/styles.css';

import {
  AppShell,
  Button,
  Flex,
  InputWrapper,
  MantineProvider,
  Slider,
  Stack,
  TextInput,
} from '@mantine/core';
import { Canvas } from './canvas';
import { theme } from './theme';
import { useConfig } from './gradual-blur';
import { useCallback, useState } from 'react';

export default function App() {
  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(1000);

  const [fps, setFps] = useState(60);

  const { automaton, node } = useConfig({
    width,
    height,
  });

  const resetAutomaton = useCallback(() => {
    automaton.init();
  }, [automaton]);

  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <AppShell
        transitionDuration={500}
        transitionTimingFunction="ease"
        navbar={{
          width: 350,
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
            <InputWrapper label="FPS">
              <Slider
                mb="lg"
                min={1}
                max={60}
                marks={[
                  { value: 1, label: '1' },
                  { value: 60, label: '60' },
                ]}
                value={fps}
                onChange={setFps}
              />
            </InputWrapper>
            {node}
            <Button onClick={resetAutomaton}>Reset</Button>
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main display="flex">
          <Flex direction="column" flex="1" pos="relative">
            <Canvas automaton={automaton} fps={fps} />
          </Flex>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
