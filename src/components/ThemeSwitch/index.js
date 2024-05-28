//import { IconButton } from '@material-ui/core'
//import { PhotoCamera } from '@material-ui/icons'
import React, { useState } from "react";
import Brightness2OutlinedIcon from '@material-ui/icons/Brightness2Outlined';
import WbSunnyOutlinedIcon from '@material-ui/icons/WbSunnyOutlined';
import { Box, Checkbox, Tooltip, makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../../store/actions/theme";
import useColor from "../../hooks/useColor";
//import { useColor } from "hooks/useColor";




const ThemeSwitch = () => {
  const [checked, setChecked] = useState( JSON.parse(localStorage.getItem('color-theme')) === 'dark' || false);
  const color = useColor();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setChecked(e.target.checked);
    if(!e.target.checked){
      localStorage.setItem('color-theme', JSON.stringify('light'))
      dispatch(toggleTheme('light'))
    }else{
      localStorage.setItem('color-theme', JSON.stringify('dark'))
      dispatch(toggleTheme('dark'))
    }
  };

  const useStyles = makeStyles(() => ({
    checkbox: {
        "& .MuiCheckbox-colorSecondary.Mui-checked": {
            color: color.secondary,
            backgroundColor: color.white1,
            border: `1px solid ${color.white1}`,
            "&:hover": {
                backgroundColor: color.white1,
                border: `1px solid ${color.primaryLight}`,
                '& svg': {
                  fill: color.primaryLight
                }
            },
            '& svg': {
              fill: color.secondary
            }
        },
        "& .MuiIconButton-colorSecondary": {
            
          //  backgroundColor: color.primaryLight,
            "&:hover": {
                backgroundColor: color.whiteEEE,
            },
            '& svg': {
              fill: color.white,
            }
        },
        "& .MuiButtonBase-root": {
            padding: '6px'
        }
    }
}));
 
const classes = useStyles();

  return (
    <Box className={classes.checkbox}>
      <Tooltip title={checked ? 'Dark Theme' : 'Light Theme'}>
        <Checkbox
          checked={checked}
          onChange={handleChange}
          icon={ <WbSunnyOutlinedIcon /> }
          checkedIcon={<Brightness2OutlinedIcon style={{ transform: 'rotate(180deg)' }} />}
         />
      </Tooltip>
    </Box>
  );
};

export default ThemeSwitch;
