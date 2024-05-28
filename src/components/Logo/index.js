import { Box } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import { clearAllReducers } from '../../store/actions/conference';
import { useDispatch, useSelector } from 'react-redux';
import { removeLocalTrack } from '../../store/actions/track';
import useColor from '../../hooks/useColor';

const Logo = ({height}) => {
  const mediaType = useSelector(state => state.media)?.mediaType;
  const color = useColor();

  const useStyles = makeStyles((theme)=>({
    logo: {
      display: 'flex',
        textDecoration: 'none',
        color: color.white,
        alignItems: 'center',
        justifyContent: 'center',
        "&:hover": {
            textDecoration: 'none',
            color: color.white,
        }
    },
    logoImage: {
      height: mediaType ? '60px' : '80px',
      [theme.breakpoints.down('md')]: {
        height: '50px'
      }
    },
    logoText: {
      fontFamily: `'DM Sans', sans-serif`,
      width: 'fit-content',
      height: "63px",
      display: "flex",
      alignItems: "center",
      color: `${color.white}`,
      fontSize: '1.2rem'
    },
    }))
      const classes = useStyles();
      const navigate = useNavigate();
      const dispatch = useDispatch();
      const localTracks = useSelector(state => state.localTrack);

      const goHome = () => {
        dispatch(clearAllReducers());
        for (let track of localTracks){
          dispatch(removeLocalTrack(track));
        }
        navigate('/');
      }
      return (
          <Box className={classes.logo} onClick={goHome}>
              <img src={'https://assets.sariska.io/Logo_Sariska.svg'} alt="logo" className={classes.logoImage}/>
              {/* <Typography className={classes.logoText}>SARISKA</Typography> */}
          </Box>
      )
}

export default Logo
