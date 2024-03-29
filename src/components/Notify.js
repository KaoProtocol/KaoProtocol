import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={50} ref={ref}  variant="outlined" {...props} />;
});

export default function CustomizedSnackbars(props) {



  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={props.open} autoHideDuration={6000} onClose={props.handleClose}>
        <Alert onClose={props.handleClose} severity={props.severity} sx={{ width: '100%' }}>
          {props.notificationMessage}
        </Alert>
      </Snackbar>

    </Stack>
  );
}