import React from 'react';
import {Box, Button, Typography, makeStyles} from '@material-ui/core';
import Logo from '../Logo';
import { color } from '../../assets/styles/_color';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import { setMediaType } from '../../store/actions/media';
import { removeLocalTrack } from '../../store/actions/track';

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
    marginLeft: '-100px',
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
    color: color.white,
    borderColor: color.white,
    textTransform: 'capitalize',
    borderRadius: '20px',
    '&:hover': {
      opacity: 0.8
    }
  },
  backIcon: {
    fontSize: '1rem',
    marginRight: '5px'
  }
}))
const Header = () => {
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
  return (
    <Box className={classes.root}>
        <Logo />
        <Box className={classes.titleContainer}>
            <Typography variant='h3' className={classes.title}>
              Sariska Web Player
            </Typography>
        </Box>
        {mediaType && !isMeetingStarted ? <Button className={classes.back} variant= 'outlined' onClick={goBack} >
          <ArrowBackIosOutlinedIcon  className={classes.backIcon} />
          <Typography>Back</Typography>
        </Button> : null}
    </Box>
  )
}

export default Header