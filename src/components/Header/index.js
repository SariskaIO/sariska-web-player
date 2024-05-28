import React from 'react';
import {Box, Button, Typography, makeStyles} from '@material-ui/core';
import Logo from '../Logo';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import { setMediaType } from '../../store/actions/media';
import { removeLocalTrack } from '../../store/actions/track';
import { LIVE_STREAMING, MESSAGING, VIDEO_CONFERENCING } from '../../constants';
import ThemeSwitch from '../ThemeSwitch';
import useColor from '../../hooks/useColor';


const Header = () => {
  const color = useColor();
  const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex', 
      alignItems: 'center',
      [theme.breakpoints.down('md')]: {
        justifyContent: 'space-between'
      }
    },
    titleContainer: {
      flex: 1,
      [theme.breakpoints.down('md')]: {
        flex: 'none',
        marginLeft: '16px',
      }
    },
    title: {
      fontWeight: '700', 
      color: color.white,
      [theme.breakpoints.down('md')]: {
        fontSize: '1.7rem'
      }
    },
    back: {
      color: color.primaryLight,
      borderColor: color.primaryLight,
      textTransform: 'capitalize',
      borderRadius: '20px',
      marginLeft: '24px', 
      marginRight: '24px', 
      fontSize: '2rem', 
      lineHeight: 1,
      '&:hover': {
        opacity: 0.8
      }
    },
    backIcon: {
      fontSize: '1rem',
      marginRight: '5px'
    }
  }))

  const classes = useStyles();
  const mediaType = useSelector(state => state.media)?.mediaType;
  const localTracks = useSelector(state => state.localTrack);
  const dispatch = useDispatch();
  const isMeetingStarted = useSelector(state => state.auth)?.isMeetingStarted;

  const goBack = async() => {
    for (const track of localTracks) {
      await track.dispose();
      dispatch(removeLocalTrack(track))
    }
    dispatch(setMediaType(null))
  }

  const getTitle = () => {
    let title;
    switch(mediaType){
      case VIDEO_CONFERENCING:
        title = 'Video Conferencing';
        break;
      case LIVE_STREAMING:
        title = 'Interactive Live Streaming';
        break;
      case MESSAGING:
        title = 'Real Time Messaging';
        break;
      default:
        title = 'Sariska Web Player';
    }
    return title;
  }
  

  // useEffect(() => {
    
  //   setTitle(getTitle());
  // }, [mediaType])
  
  return (
    <Box className={classes.root} style={{justifyContent: mediaType ? 'space-between' : 'inherit'}}>
        <Box sx={{width: mediaType && !isMeetingStarted ? '172px' : '80px'}}>
          <Logo />
        </Box>
        {!mediaType ? <Box className={classes.titleContainer}>
            <Typography variant='h3' className={classes.title}>
              {getTitle()}
            </Typography>
        </Box> : null}
        {/* {!isMeetingStarted && mediaType  ? <Button className={classes.back} variant= 'outlined' onClick={goBack} >
          <ArrowBackIosOutlinedIcon  className={classes.backIcon} />
          <Typography>Back</Typography>
        </Button> : null} */}
        {
          mediaType ?
          <Box sx={{display: 'flex'}}>
              <Typography variant='h5' className={classes.title} style={{textAlign: 'end'}}>
                {getTitle()}
              </Typography>
          </Box> 
          : null
        }
        <Box sx={{display: 'flex', alignItems: 'center'}}>
        {
          mediaType && !isMeetingStarted  ? 
          <Button className={classes.back} variant= 'outlined' onClick={goBack} >
            <ArrowBackIosOutlinedIcon  className={classes.backIcon} />
            <Typography>Back</Typography>
          </Button> 
          : null
        }
        <Box sx={{width : !(mediaType && !isMeetingStarted) && '80px'}} >
          <ThemeSwitch />
        </Box>
        </Box>
      
    </Box>
  )
}

export default Header