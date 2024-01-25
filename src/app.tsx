import '@mantine/core/styles.css';

import { AppShell, Flex, MantineProvider, Stack } from '@mantine/core';
import { Canvas } from './canvas';
import { theme } from './theme';
import { GradualBlur, useConfig } from './gradual-blur';
import { useEffect, useState } from 'react';

export default function App() {
  const { config, node } = useConfig();
  const [automaton, setAutomaton] = useState(new GradualBlur(config));

  useEffect(() => {
    setAutomaton(new GradualBlur(config));
  }, [config]);

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
          <Stack gap="md">{node}</Stack>
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
