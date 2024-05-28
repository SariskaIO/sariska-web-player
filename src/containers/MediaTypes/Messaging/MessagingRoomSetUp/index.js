
import { Avatar, Box, Button, Container, CssBaseline, TextField, Typography, makeStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import 
LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useStore } from '../../../../api/context';
import { updateUser } from '../../../../api/context/actions/user';
import { SET_IS_CHAT_STARTED, SET_ROOM_NAME, UPDATE_USER } from '../../../../api/context/actions/types';
import { setRoomName } from '../../../../api/context/actions/room';
import { setIsChatStarted } from '../../../../api/context/actions/chat';
import { setIsMeetingStarted } from '../../../../store/actions/auth';
import { useDispatch } from 'react-redux';
import useColor from '../../../../hooks/useColor';

const initialState = {
    roomName: JSON.parse(localStorage.getItem("sariska-chat-room"))?.session_id || '',
    userName: JSON.parse(localStorage.getItem("sariska-chat-user"))?.name || '',
    error: ''
}

const MessagingRoomSetUp = () => {
    const color = useColor();

    const useStyles = makeStyles((theme) => ({
      root: {
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
      },
      paper: {
      // marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      avatar: {
        margin: theme.spacing(2),
        backgroundColor: color.primaryLight,
      },
      form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        paddingTop: theme.spacing(3),
        '& .MuiFormLabel-root': {
          color: `${color.primaryLight} !important`,
          '& .Mui-focused': {
            color: color.primaryLight
          },
        },
        '& .MuiTextField-root:hover .MuiOutlinedInput-notchedOutline':{
          borderColor: `${color.primaryLight} !important`,
        },
        '& .MuiOutlinedInput-input': {
          color: color.white
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: color.white
        }
      },
      submit: {
        margin: theme.spacing(3, 0, 2),
        padding: theme.spacing(1),
        background: color.buttonGradient,
        textTransform: 'capitalize',
        fontWeight: '500',
        borderRadius: '30px',
        fontSize: '1.2rem',
        '&:hover': {
          background: color.buttonGradient,
          opacity: 0.8
        }
      },
    }));
    const classes = useStyles();
    const [state, setState] = useState(initialState);
    const { dispatch } = useStore();
    const reduxDispatch = useDispatch();
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        setState(state => ({...state, [name]: value}));
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!state.roomName && !state.userName) {
          setState(state => ({...state, ['error']: 'Required fields can not be kept blank'}))
          return;
        }
        if(JSON.parse(localStorage.getItem('sariska-chat-roomName')) !== state.roomName){
          dispatch(setRoomName(SET_ROOM_NAME, state.roomName));
        }
        if(JSON.parse(localStorage.getItem('sariska-chat-user'))?.name !== state.userName){
          dispatch(updateUser(UPDATE_USER, state.userName));
        }
        reduxDispatch(setIsMeetingStarted(true));
        dispatch(setIsChatStarted(SET_IS_CHAT_STARTED, true));
    }
    
    useEffect(()=>{
      setState(state => ({
        ...state, 
        roomName: JSON.parse(localStorage.getItem("sariska-chat-room"))?.session_id || '',
        userName: JSON.parse(localStorage.getItem("sariska-chat-user"))?.name || ''
      }))
    },[])

  return (
    <Box className={classes.root}>
        <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" style={{color: color.white}}>
          Create Room
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Room Name"
            name="roomName"
            value={state.roomName}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="userName"
            label="Username"
            value={state.userName}
            onChange={handleChange}
          />
          {state.error ? <Typography style={{color: 'red', textAlign: 'left'}}>( * ) {state.error}</Typography> : null }
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Start Chat
          </Button>
        </form>
      </div>
      {/* <Box mt={8}>
        <Copyright />
      </Box> */}
    </Container>
    </Box>
  )
}

export default MessagingRoomSetUp