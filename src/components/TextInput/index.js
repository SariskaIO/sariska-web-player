import React from 'react';
import { color } from '../../assets/styles/_color';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/core";
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: props => props.width || '25ch',
      "& input": {
        color: color.white,
        fontSize: '1.145vw',
      [theme.breakpoints.down("sm")]: {
        fontSize: '0.9rem',
      }
      },
      "&:hover": {
        "& .MuiInput-underline:before": {
          borderBottom: `2px solid ${color.secondaryLight}`
        },
      },
      [theme.breakpoints.down("sm")]: {
        width: '285px !important',
      }
    },
    "& .MuiFormLabel-root": {
      color: color.white,
      fontSize: '1.15vw',
      [theme.breakpoints.down("sm")]: {
        fontSize: '1rem',
      }
    },
    '& .MuiFormLabel-root.Mui-focused': {
        color: color.white,
        fontWeight: '800'
    },
    "& MuiInputBase-input": {
      color: color.white
    },
    "& .MuiInput-underline:before": {
      borderBottom: `1px solid ${color.secondaryLight}`
    },
    '& .MuiInput-underline:after': {
        borderBottom: `2px solid ${color.secondaryLight}`
    },
    "&.MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: `1px solid ${color.white}`
  }
  },
}));

export default function TextInput({label, width, value, onChange, onKeyPress, variant, placeholder}) {
    const props = {width: width};
  const classes = useStyles(props);

  return (
      <Box
      component="form"
      noValidate
      autoComplete="off"
      className={classes.root} 
    >
        <TextField
          id={label}
          label={label}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          variant="standard"
          placeholder={placeholder}
        />
        </Box>
  );
}
