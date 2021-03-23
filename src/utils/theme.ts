import { createMuiTheme } from '@material-ui/core/styles';
import { blue, yellow } from '@material-ui/core/colors';

// Create a theme instance.
const Theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: yellow,
    type: 'dark',
  },
  props: {
    MuiButton: {
      size: 'small',
    },
    MuiFilledInput: {
      margin: 'dense',
    },
    MuiFormControl: {
      margin: 'dense',
    },
    MuiFormHelperText: {
      margin: 'dense',
    },
    MuiIconButton: {
      size: 'small',
    },
    MuiInputBase: {
      margin: 'dense',
    },
    MuiInputLabel: {
      margin: 'dense',
    },
    MuiListItem: {
      dense: true,
    },
    MuiOutlinedInput: {
      margin: 'dense',
    },
    MuiFab: {
      size: 'small',
    },
    MuiTable: {
      size: 'small',
    },
    MuiTextField: {
      margin: 'dense',
    },
    MuiToolbar: {
      variant: 'dense',
    },
  },
  overrides: {
    MuiDialogActions: {
      root: {
        padding: '8px 24px',
      },
    },
  },
});

export default Theme;
