import {
  Box,
  CircularProgress,
  Hidden,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState, useRef } from "react";
import SariskaMediaTransport from "sariska-media-transport";
import { useLocation, useNavigate } from "react-router-dom";
import { addConference } from "../../../../store/actions/conference";
import {
  getToken,
  trimSpace,
  getRandomColor
} from "../../../../utils";
import { addThumbnailColor } from "../../../../store/actions/color";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TextInput from "../../../../components/TextInput";
import { setProfile, setMeeting , updateProfile} from "../../../../store/actions/profile";
import JoinTrack from "../JoinTrack";
import { addConnection } from "../../../../store/actions/connection";
import SnackbarBox from "../../../../components/Snackbar";
import { showNotification } from "../../../../store/actions/notification";
import { setDisconnected } from "../../../../store/actions/layout";
import FancyButton from '../../../../components/FancyButton';
import { setIsMeetingStarted } from "../../../../store/actions/auth";
import SettingsBox from "../../../../components/Settings";
import DrawerBox from "../../../../components/DrawerBox";
import { VIDEO_CONFERENCING } from "../../../../constants";
import useColor from "../../../../hooks/useColor";


const LobbyRoom = ({ tracks }) => {
  const navigate = useNavigate();
  const audioTrack =  useSelector((state) => state.localTrack).find(track=>track?.isAudioTrack());  
  const videoTrack =  useSelector((state) => state.localTrack).find(track=>track?.isVideoTrack());  
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [name, setName] = useState("");
  const [buttonText, setButtonText] = useState("Start Meeting");
  const [accessDenied, setAccessDenied] = useState(false);
  const profile = useSelector((state) => state.profile);
  const queryParams = useParams();
  const location = useLocation();
  const iAmRecorder = window.location.hash.indexOf("iAmRecorder") >= 0;
  const testMode = window.location.hash.indexOf("testMode") >= 0;
  const notification = useSelector((state) => state.notification);
  const mediaType = useSelector((state) => state.media)?.mediaType;
  const auth = useSelector(state => state.auth);
  const {apiKey, isApiKey} = auth;
  const [settingsState, setSettingsState] = React.useState({
    right: false,
  });
  const moderator = useRef(true);
  const color = useColor();

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: 'center',
      width: '100%'
    },
  
    disable: {
      background: color.red,
      "&:hover": {
        opacity: "0.8",
        background: `${color.red} !important`,
      },
    },
    textBox: {
      width: "100%",
      //marginBottom: "60px"
    },
    userBox: {
      marginTop: '1vh',
      marginBottom: '1vh',
      [theme.breakpoints.down("sm")]: {
        marginTop: '10px',
        marginBottom: '10px'
      }
    },
    moderatorBox: {
      display: "flex",
      justifyContent: "space-between",
      color: color.lightgray1,
      alignItems: "center",
      padding: "0px 8px 8px",
    },
    action: {
      opacity: .9
    },
    anchor: {
      color: color.white,
      textDecoration: "none",
      border: `1px solid ${color.primaryLight}`,
      padding: theme.spacing(0.5, 5),
      borderRadius: "10px",
      textTransform: "capitalize",
      marginTop: '5.4vh',
      width: '178.69px',
      "&:hover": {
        fontWeight: "900",
        background: `linear-gradient(to right, ${color.primaryLight}, ${color.buttonGradient}, ${color.primary})`,
      }
    },
    videoContainer: {
      borderRadius: "0 0 4px 4px",
      backgroundColor: color.blurEffect,
      backdropFilter: `blur(48px)`,	
      '-webkit-backdrop-filter': 'blur(48px)',
      transition: `background-color .2s ease`,
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "column",
      zIndex: 1,
      padding: "12px",
     // border: `1px solid ${color.whitePointOne}`,
      [theme.breakpoints.down("md")]: {
        padding: "12px",
        backgroundColor: videoTrack?.isMuted() ? color.blurEffect : color.lightBlurEffect,
        border: `none`,
        borderRadius: "0px 0px 4px 4px",
      }
    },
    wrapper: {
      margin: "2.3vh 0px 0.5vh 0px",
      position: "relative",
      textAlign: "center",
      [theme.breakpoints.down("sm")]: {
        marginTop: 0,
        marginBottom: 0,
      }
    },
    buttonSuccess: {
      backgroundColor: color.primary,
      "&:hover": {
        backgroundColor: color.primary,
      },
    },
    buttonProgress: {
      color: color.primary,
      position: "absolute",
      bottom: "4.5vh",
      top: "30px",
      left: "50%",
      marginLeft: -12,
    },
    buttonProgressJoin: {
      color: color.primary,
      top: "30px",
      position: "absolute",
      bottom: '4.5vh',
      left: "50%",
      marginLeft: -12,
    },
  }));

  const classes = useStyles();

  const handleTitleChange = (e) => {
    setMeetingTitle(trimSpace(e.target.value.toLowerCase()));
  };

  const handleUserNameChange = (e) => {
    setName(e.target.value);
    if (e.target.value.length === 1 ) {
      dispatch(updateProfile({key: "color", value: getRandomColor()}));
    }
    if (!e.target.value) {
      dispatch(updateProfile({key: "color", value: null}));
    }
  };

  const handleSubmit = async () => {
    if (!meetingTitle) {
      dispatch(
        showNotification({
          message: "Meeting Name is required",
          severity: "warning",
          autoHide: true,
        })
      );
      return;
    }

    setLoading(true);
    let avatarColor = profile?.color ?  profile?.color : getRandomColor();
    dispatch(updateProfile({key: "color", value: avatarColor}));

    const token = await getToken(profile, name, avatarColor, isApiKey, apiKey);
    const connection = new SariskaMediaTransport.JitsiConnection(
      token,
      meetingTitle,
      process.env.REACT_APP_ENV === "development" ? true : false
    );

    connection.addEventListener(
      SariskaMediaTransport.events.connection.CONNECTION_ESTABLISHED,
      () => {
        dispatch(addConnection(connection));
        createConference(connection);
      }
    );

    connection.addEventListener(
      SariskaMediaTransport.events.connection.CONNECTION_FAILED,
      async (error) => {
        console.log(" CONNECTION_DROPPED_ERROR", error);
        if (
          error === SariskaMediaTransport.errors.connection.PASSWORD_REQUIRED
        ) {
          const token = await getToken(profile, name, moderator.current, isApiKey, apiKey);
          connection.setToken(token); // token expired, set a new token
        }
        if (
          error ===
          SariskaMediaTransport.errors.connection.CONNECTION_DROPPED_ERROR
        ) {
          dispatch(setDisconnected("lost"));
        }
      }
    );

    connection.addEventListener(
      SariskaMediaTransport.events.connection.CONNECTION_DISCONNECTED,
      (error) => {
        console.log("connection disconnect!!!", error);
      }
    );

    connection.connect();
  };

  const createConference = async (connection) => {
    // const conference = connection.initJitsiConference({
    //   createVADProcessor: SariskaMediaTransport.effects.createRnnoiseProcessor,
    // });
    const conference = connection.initJitsiConference();
    tracks.forEach(async track => await conference.addTrack(track));

    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONFERENCE_JOINED,
      () => {
        setLoading(false);
        dispatch(addConference(conference));
        dispatch(setProfile(conference.getLocalUser()));
        dispatch(setMeeting({ meetingTitle }));
        dispatch(addThumbnailColor({participantId: conference?.myUserId(), color:  profile?.color}));
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.USER_ROLE_CHANGED,
      (id, role) => {
        console.log('USER_ROLE_CHANGED', id, role)
        if (conference.isModerator() && !testMode) {
          conference.enableLobby();
          dispatch(setIsMeetingStarted(true));
        } else {
          dispatch(setIsMeetingStarted(true));
        }
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONFERENCE_ERROR,
      () => {
        setLoading(false);
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.USER_JOINED,
      (id) => {
        dispatch(
          addThumbnailColor({ participantId: id, color: getRandomColor() })
        );
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONFERENCE_FAILED,
      async (error) => {
        if (
          error === SariskaMediaTransport.errors.conference.MEMBERS_ONLY_ERROR
        ) {
          setButtonText("Asking to join");
          conference.joinLobby(name || conference?.getLocalUser()?.name);
        }

        if (
          error ===
          SariskaMediaTransport.errors.conference.CONFERENCE_ACCESS_DENIED
        ) {
          setAccessDenied(true);
          setButtonText("Join Meeting");
          setLoading(false);
          setTimeout(() => setAccessDenied(false), 2000);
        }
      }
    );
    conference.join();
  };


  if (iAmRecorder && !meetingTitle) {
    setName("recorder");
    setMeetingTitle(queryParams.meetingId);
  }

  useEffect(() => {
    if (meetingTitle && (testMode || iAmRecorder)) {
      handleSubmit();
    }
  }, [meetingTitle]);

  useEffect(() => {
    if ((!audioTrack || !videoTrack) && !iAmRecorder ) {
        setLoading(true);
    } else {
        setLoading(false);
    }
  }, [audioTrack, videoTrack]);


  useEffect(() => {
    if (queryParams.meetingId) {
      setButtonText("Join Meeting");
      setMeetingTitle(queryParams.meetingId);
    }
    setName(profile.name);
  }, [profile?.name]);

  const toggleSettingsDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setSettingsState({ ...settingsState, [anchor]: open });
  };

  const settingsList = (anchor) => (
    <Box
      onKeyDown={toggleSettingsDrawer(anchor, false)}
    >
      <SettingsBox onClick={toggleSettingsDrawer("right", false)}/>
    </Box>
  );

  return (
    <Box className={classes.root}>
      <Box className={classes.videoContainer}>
        
        <Box className={classes.action}>
          <div className={classes.wrapper}>
            <Box className={classes.textBox}>
              {!queryParams.meetingId ? <>
              <TextInput
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit();
                  }
                  // if (e.charCode === 32) {
                  //   dispatch(
                  //     showNotification({
                  //       message: "Space is not allowed",
                  //       severity: "warning",
                  //       autoHide: true,
                  //     })
                  //   );
                  // // } else if (detectUpperCaseChar(e.key)) {
                  // //   dispatch(
                  // //     showNotification({
                  // //       message: "Capital Letter is not allowed",
                  // //       severity: "warning",
                  // //       autoHide: true,
                  // //     })
                  // //   );
                  // }
                }}
                label="Meeting Name"
                placeholder="Enter Meeting Name"
                width="280px"
                value={meetingTitle}
                onChange={handleTitleChange}
                variant={'standard'}
              />
              </> : 
              null}
             {mediaType === VIDEO_CONFERENCING ? <Box className={classes.userBox}>
                <TextInput
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  label="Username"
                  width="280px"
                  value={name}
                  onChange={handleUserNameChange}
                  variant={'standard'}
                />
              </Box> : null}
            </Box>
            
          </div>
        </Box>
        <Box style={{textAlign: 'center', position: 'relative'}}>
        <FancyButton
              homeButton={true}
              disabled={loading}
              onClick={handleSubmit}
              buttonText={buttonText}
            />
            {loading && (
              <CircularProgress size={24} className={ !queryParams?.meetingId ? classes.buttonProgress : classes.buttonProgressJoin} />
            )}
            </Box>
      </Box>

      <JoinTrack tracks={tracks} name={name} toggleSettingsDrawer={toggleSettingsDrawer} mediaType={mediaType}/>
      <DrawerBox
        open={settingsState["right"]}
        onClose={toggleSettingsDrawer("right", false)}
        top="17px"
      >
        {settingsList("right")}
      </DrawerBox>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        autoHideDuration={2000}
        open={accessDenied}
        message="Conference access denied by moderator"
      />
      <SnackbarBox notification={notification} />
    </Box>
  );
};

export default LobbyRoom;