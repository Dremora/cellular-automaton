import { style } from '@vanilla-extract/css';
import { vars } from './theme';

export const appShellStyle = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',

  '@media': {
    [vars.largerThan(vars.breakpoints.md)]: {
      flexDirection: 'row',
    },
  },
});

export const sidebarStyle = style({
  height: '50%',
  overflow: 'auto',

  '@media': {
    [vars.largerThan(vars.breakpoints.md)]: {
      height: '100%',
    },
  },
});
