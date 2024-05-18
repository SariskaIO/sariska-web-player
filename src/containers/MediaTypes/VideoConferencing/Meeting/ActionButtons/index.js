import {
  Badge,
  Box,
  Button,
  Hidden,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import SariskaMediaTransport from "sariska-media-transport";
import { color } from "../../../../../assets/styles/_color";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import CallEndIcon from "@material-ui/icons/CallEnd";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import PanToolIcon from "@material-ui/icons/PanTool";
import ChatIcon from "@material-ui/icons/Chat";
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import CloseIcon from '@material-ui/icons/Close';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import {
  addLocalTrack,
  localTrackMutedChanged,
  removeLocalTrack,
} from "../../../../../store/actions/track";
import {
  ENTER_FULL_SCREEN_MODE,
  EXIT_FULL_SCREEN_MODE,
  GRID,
  PRESENTATION,
  SHARED_DOCUMENT,
  SPEAKER,
  RECORDING_ERROR_CONSTANTS,
  WHITEBOARD,
  GET_PRESENTATION_STATUS,
  RECEIVED_PRESENTATION_STATUS,
  streamingMode,
} from "../../../../../constants";
import {
  setFullScreen,
  setLayout,
  setPresenter,
  setPresentationtType,
} from "../../../../../store/actions/layout";
import { clearAllReducers } from "../../../../../store/actions/conference";
import {
  exitFullscreen,
  formatAMPM,
  isFullscreen,
  requestFullscreen,
  startStreamingInSRSMode,
  stopStreamingInSRSMode,
} from "../../../../../utils";
//import ParticipantDetails from "../ParticipantDetails";
import { unreadMessage } from "../../../../../store/actions/chat";
import { withStyles } from "@material-ui/styles";
import ChatPanel from "../Chat";
//import MoreAction from "../../shared/MoreAction";
import DrawerBox from "../../../../../components/DrawerBox";
import { addSubtitle } from "../../../../../store/actions/subtitle";
import { showSnackbar } from "../../../../../store/actions/snackbar";
import StyledTooltip from "../../../../../components/StyledTooltip";
//import LiveStreamingDetails from "../LiveStreamingDetails";
import { showNotification } from "../../../../../store/actions/notification";
import googleApi from "../../../../../utils/google-apis";
import CopyMeetingLink from "../../../../../components/CopyMeetingLink";
import { setIsMeetingStarted } from "../../../../../store/actions/auth";
//import LiveStreamDialog from "../LiveStreamDialog";

const StyledBadge = withStyles((theme) => ({
  badge: {
    background: color.primary,
    top: 6,
    right: 10,
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    color: color.white,
    [theme.breakpoints.down("md")]: {
      background: color.secondaryDark
    },
    "& svg": {
      padding: "8px",
      marginRight: "2px",
      fontSize: '2rem',
      border: `1px solid ${color.search}`,
      borderRadius: '50%',
      [theme.breakpoints.down("md")]: {
        background: color.secondary,
        borderRadius: '50%',
        marginRight: "6px !important",
      },
      "&:hover": {
        opacity: "0.8",
        cursor: "pointer",
        color: color.primaryLight,
      },
    },
  },
  actionContainer: {
    width: 'fit-content',
    padding: '32px',
    display: "flex",
    border: `1px solid ${color.secondary}`,
    borderRadius: '8px',
    justifyContent: "space-around",
    flexDirection: 'column',
    alignItems: "center"
  },
  active: {
    opacity: "0.8",
    cursor: "pointer",
    color: color.red,
  },
  panTool: {
    fontSize: "1.6rem !important",
    padding: "12px !important",
    marginRight: "12px",
    [theme.breakpoints.down("md")]: {
      marginRight: "6px !important",
    },
  },
  infoContainer: {
    display: "flex"
  },
  separator: {
    marginLeft: "10px",
    marginRight: "10px",
  },
  screenShare: {
    padding: "8px",
    marginRight: "2px",
    borderRadius: "8px",
    [theme.breakpoints.down("md")]: {
      background: color.secondary,
      borderRadius: '50%',
      marginRight: "6px",
    },
  },
  permissions: {
    display: "flex",
    alignItems: "center",
    flexDirection: 'column',
    minWidth: '250px',
    padding: "24px 12px 0px 12px",
    backgroundColor: color.secondary,
    marginBottom: '24px',
    borderRadius: "8px",
    [theme.breakpoints.down("sm")]: {
      backgroundColor: "transparent",
      margin: 'auto',
      position: 'relative',
      bottom: '0px'
    },
  },
  iconContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '24px'
  },
  end: {
    background: `${color.red} !important`,
    borderColor: `${color.red} !important`,
    padding: "2px 12px !important",
    textAlign: "center",
    borderRadius: "30px !important",
    width: "42px",
    fontSize: "36px",
    marginRight: 0,
    "&:hover": {
      opacity: "0.8",
      background: `${color.red} !important`,
      cursor: "pointer",
      color: `${color.white} !important`,
    },
    [theme.breakpoints.down("sm")]: {
      padding: "8px !important",
      width: "40px",
      fontSize: "24px",
    },
  },
  liveBox: {
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${color.red}`,
    borderRadius: '30px',
    paddingLeft: '8px',
    paddingRight: '8px',
    marginLeft: '8px',
    '& svg': {
      border: 'none !important'
    },
    '&:hover': {
      cursor: 'pointer'
    }
  },
  dot: {
    padding: '2px !important',
    fontSize: '1rem'
  },
  live: {
    color: color.red,
    padding: '6px 6px 6px 0',
    minWidth: '36px'
  },
  subIcon: {
    border: "none !important",
    marginRight: "0px !important",
    marginLeft: "4px !important",
  },
  more: {
    marginRight: "0px !important",
  },
  drawer: {
    "& .MuiDrawer-paper": {
      overflowX: "hidden",
      top: "16px",
      bottom: "80px",
      right: "16px",
      borderRadius: "8px",
      height: "89%",
      width: "360px",
      backgroundColor: color.secondary,
      overflowY: "auto",
    },
  },
  list: {
    padding: theme.spacing(3, 3, 0, 3),
    height: "100%",
  },
  title: {
    color: color.white,
    fontWeight: "400",
    marginLeft: "8px",
    fontSize: "28px",
    lineHeight: "1",
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
      fontSize: '24px'
    }
  },
  participantHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    "& svg": {
      color: color.white
    }
  },
  chatList: {
    height: "100%",
    padding: theme.spacing(3, 3, 0, 3),
  },
  chat: {
    marginRight: "0px !important",
    fontSize: "1.85rem !important",
    padding: "10px !important",
    [theme.breakpoints.down("md")]: {
      marginRight: '6px !important'
    }
  },
  moreActionList: {
    height: "100%",
    width: "260px",
    padding: theme.spacing(1, 0, 0, 0),
    backgroundColor: color.secondary,
  },
}));

const ActionButtons = ({ dominantSpeakerId }) => {
  const navigate = useNavigate()
  const audioTrack = useSelector((state) => state.localTrack).find((track) =>
    track.isAudioTrack()
  );
  const videoTrack = useSelector((state) => state.localTrack).find((track) =>
    track.isVideoTrack()
  );
  const classes = useStyles();
  const dispatch = useDispatch();
  const conference = useSelector((state) => state.conference);
  const localTracks = useSelector((state) => state.localTrack);
  const [presenting, setPresenting] = useState(false);
  const profile = useSelector((state) => state.profile);
  const layout = useSelector((state) => state.layout);
  const unread = useSelector((state) => state.chat.unreadMessage);
  const [raiseHand, setRaiseHand] = useState(false);
  const [featureStates, setFeatureStates] = useState({});
  const [chatState, setChatState] = React.useState({
    right: false,
  });
  const [liveState, setLiveState] = React.useState({
    right: false,
  });
  const [participantState, setParticipantState] = React.useState({
    right: false,
  });
  const [moreActionState, setMoreActionState] = React.useState({
    right: false,
  });

  const [openLivestreamDialog, setOpenLivestreamDialog] = useState(false);
  const [broadcasts, setBroadcasts] = useState([]);
  const [streamingUrls, setStreamingUrls] = useState([]);
  const [streamKey, setStreamKey] = useState('');

  const skipResize = false;
  const streamingSession = useRef(null);

  const action = (actionData) => {
    featureStates[actionData.key] = actionData.value;
    setFeatureStates({ ...featureStates });
  };

  const muteAudio = async () => {
    await audioTrack?.mute();
    dispatch(localTrackMutedChanged());
  };

  const unmuteAudio = async () => {
    await audioTrack?.unmute();
    dispatch(localTrackMutedChanged());
  };

  const muteVideo = async () => {
    await videoTrack?.mute();
    dispatch(localTrackMutedChanged());
  };

  const unmuteVideo = async () => {
    await videoTrack?.unmute();
    dispatch(localTrackMutedChanged());
  };

  const shareScreen = async () => {
    let desktopTrack;
    try {
      const tracks = await SariskaMediaTransport.createLocalTracks({
        resolution: 720,
        devices: ["desktop"],
      });
      desktopTrack = tracks.find((track) => track.videoType === "desktop");
    } catch (e) {
      dispatch(
        showSnackbar({
          autoHide: true,
          message:
            "Oops, Something wrong with screen sharing permissions. Try reload",
        })
      );
      return;
    }
    await conference.addTrack(desktopTrack);
    desktopTrack.addEventListener(
      SariskaMediaTransport.events.track.LOCAL_TRACK_STOPPED,
      async () => {
        stopPresenting();
      }
    );
    conference.setLocalParticipantProperty("presenting", "start");
    dispatch(addLocalTrack(desktopTrack));
    dispatch(
      setPresenter({ participantId: conference.myUserId(), presenter: true })
    );
    setPresenting(true);
  };

  const stopPresenting = async () => {
    const desktopTrack = localTracks.find(
      (track) => track.videoType === "desktop"
    );
    await conference.removeTrack(desktopTrack);
    dispatch(
      setPresenter({ participantId: conference.myUserId(), presenter: false })
    );
    dispatch(removeLocalTrack(desktopTrack));
    conference.setLocalParticipantProperty("presenting", "stop");
    setPresenting(false);
  };

  const startRaiseHand = () => {
    conference.setLocalParticipantProperty("handraise", "start");
    setRaiseHand(true);
  };

  const stopRaiseHand = () => {
    conference.setLocalParticipantProperty("handraise", "stop");
    setRaiseHand(false);
  };

  const startStreaming = async () => {
    if (featureStates.streaming) {
      return;
    }

    if (conference?.getRole() === "none") {
      return dispatch(
        showNotification({
          severity: "info",
          autoHide: true,
          message: "You are not moderator!!",
        })
      );
    }
    if(streamingMode === 'srs'){
      dispatch(
        showSnackbar({
          severity: "info",
          message: "Starting Live Streaming",
          autoHide: false,
        })
      );
      const streamingResponse = await startStreamingInSRSMode(profile.meetingTitle, streamKey);
       if(streamingResponse.started){
        setStreamingUrls(streamingResponse);
          conference.setLocalParticipantProperty("streaming", true);
            dispatch(
              showSnackbar({ autoHide: true, message: "Live streaming started" })
            );
          action({ key: "streaming", value: true }); 
       } 
    }else{
      await googleApi.signInIfNotSignedIn();
      let youtubeBroadcasts;

      try {
        youtubeBroadcasts = await googleApi.requestAvailableYouTubeBroadcasts();
      } catch (e) {
        dispatch(
          showNotification({
            autoHide: true,
            message: e?.result?.error?.message,
            severity: "info",
          })
        );
        return;
      }

      if (youtubeBroadcasts.status !== 200) {
        dispatch(
          showNotification({
            autoHide: true,
            message: "Could not fetch YouTube broadcasts",
            severity: "info",
          })
        );
      }
      setBroadcasts(youtubeBroadcasts.result.items);
      setOpenLivestreamDialog(true);
    }
  };

  const createLiveStream = async () => {
    const title = `test__${Date.now()}`;
    const resposne = await googleApi.createLiveStreams(title);

    const streamName = resposne.cdn?.ingestionInfo?.streamName;
    if (!streamName) {
      return;
    }

    dispatch(
      showSnackbar({
        severity: "info",
        message: "Starting Live Streaming",
        autoHide: false,
      })
    );
    if(streamingMode === 'srs'){
       const streamingResponse = await startStreamingInSRSMode(profile.meetingTitle);
       if(streamingResponse.started){
          conference.setLocalParticipantProperty("streaming", true);
            dispatch(
              showSnackbar({ autoHide: true, message: "Live streaming started" })
            );
          action({ key: "streaming", value: true }); 
       }
    }else{
      const session = await conference.startRecording({
        mode: SariskaMediaTransport.constants.recording.mode.STREAM,
        streamId: `rtmp://a.rtmp.youtube.com/live2/${streamName}`,
      });
      streamingSession.current = session;
    }
    setOpenLivestreamDialog(false);
  };

  const selectedBroadcast = async (boundStreamID) => {
    const selectedStream =
      await googleApi.requestLiveStreamsForYouTubeBroadcast(boundStreamID);

    if (selectedStream.status !== 200) {
      dispatch(
        showNotification({
          autoHide: true,
          message: "No live streams found",
          severity: "error",
        })
      );
      return;
    }

    dispatch(
      showSnackbar({
        severity: "info",
        message: "Starting Live Streaming",
        autoHide: false,
      })
    );
    const streamName =
      selectedStream.result.items[0]?.cdn?.ingestionInfo?.streamName;
    setOpenLivestreamDialog(false);

      const session = await conference.startRecording({
        mode: SariskaMediaTransport.constants.recording.mode.STREAM,
        streamId: `rtmp://a.rtmp.youtube.com/live2/${streamName}`,
      });
      streamingSession.current = session;
  };

  const stopStreaming = async () => {
    if (!featureStates.streaming) {
      return;
    }
    if (conference?.getRole() === "none") {
      return dispatch(
        showNotification({
          severity: "info",
          autoHide: true,
          message: "You are not moderator!!",
        })
      );
    }
    if(streamingMode === 'srs'){
     const streamingResponse = await stopStreamingInSRSMode(profile.meetingTitle);
      if(!streamingResponse.started){
        setStreamingUrls({});
          conference.removeLocalParticipantProperty("streaming");
            dispatch(
              showSnackbar({ autoHide: true, message: "Live streaming stopped" })
            );
          action({ key: "streaming", value: false });
      }
    }else{
      await conference.stopRecording(
        localStorage.getItem("streaming_session_id")
      );
    }
  };

  const closeLiveStreamDialog = () => {
    setOpenLivestreamDialog(false);
  };

  const toggleLiveDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setLiveState({ ...liveState, [anchor]: open });
  };
  const toggleParticipantDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setParticipantState({ ...participantState, [anchor]: open });
  };

  const handleStreamKeyChange=(e)=>{
    setStreamKey(e.target.value);
  }
  
  // const liveList = (anchor) => (
  //   <>
  //     <Box className={classes.participantHeader}>
  //       <Typography variant="h6" className={classes.title}>
  //         Live Streaming Details
  //       </Typography>
  //       <Hidden mdUp>
  //         <CloseIcon onClick={toggleLiveDrawer("right", false)}/>
  //       </Hidden>
  //     </Box>
  //     <LiveStreamingDetails streamingUrls={streamingUrls} featureStates={featureStates} stopStreaming={stopStreaming} startStreaming={startStreaming} handleStreamKeyChange={handleStreamKeyChange} streamKey={streamKey}/>
  //   </>
  // );

  // const participantList = (anchor) => (
  //   <>
  //     <Box className={classes.participantHeader}>
  //       <Typography variant="h6" className={classes.title}>
  //         Participants
  //       </Typography>
  //       <Hidden mdUp>
  //         <CloseIcon onClick={toggleParticipantDrawer("right", false)}/>
  //       </Hidden>
  //     </Box>
  //     <ParticipantDetails />
  //   </>
  // );

  const toggleChatDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setChatState({ ...chatState, [anchor]: open });
    dispatch(unreadMessage(0));
  };

  const chatList = (anchor) => (
    <>
      <Box className={classes.participantHeader}>
        <Typography variant="h6" className={classes.title}>
          Messages
        </Typography>
        <Hidden mdUp>
          <CloseIcon onClick={toggleChatDrawer("right", false)}/>
        </Hidden>
      </Box>
      <ChatPanel />
    </>
  );

  const toggleFullscreen = () => {
    if (isFullscreen()) {
      exitFullscreen();
    } else {
      requestFullscreen();
    }
  };

  const AddFShandler = () => {
    if (isFullscreen()) {
      dispatch(setFullScreen(ENTER_FULL_SCREEN_MODE));
    } else {
      dispatch(setFullScreen(EXIT_FULL_SCREEN_MODE));
    }
  };

  const addFullscreenListeners = () => {
    document.addEventListener("fullscreenchange", AddFShandler);
    document.addEventListener("webkitfullscreenchange", AddFShandler);
    document.addEventListener("mozfullscreenchange", AddFShandler);
    document.addEventListener("MSFullscreenChange", AddFShandler);
  };

  const removeFullscreenListeners = () => {
    document.removeEventListener("fullscreenchange", AddFShandler);
    document.removeEventListener("webkitfullscreenchange", AddFShandler);
    document.removeEventListener("mozfullscreenchange", AddFShandler);
    document.removeEventListener("MSFullscreenChange", AddFShandler);
  };

  const resize = () => {
    if (skipResize) {
      return;
    }
    if (window.innerHeight == window.screen.height) {
      dispatch(setFullScreen(ENTER_FULL_SCREEN_MODE));
    } else {
      dispatch(setFullScreen(EXIT_FULL_SCREEN_MODE));
    }
  };

  const toggleView = () => {
    if (layout.type === PRESENTATION || layout.type === SPEAKER) {
      dispatch(setLayout(GRID));
    } else if (featureStates.whiteboard || featureStates.sharedDocument) {
      dispatch(setLayout(PRESENTATION));
    } else {
      dispatch(setLayout(SPEAKER));
    }
  };

  const toggleMoreActionDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setMoreActionState({ ...moreActionState, [anchor]: open });
  };

  const moreActionList = (anchor) => (
    <>
      {/* <MoreAction
        dominantSpeakerId={dominantSpeakerId}
        action={action}
        featureStates={featureStates}
        setLayoutAndFeature={setLayoutAndFeature}
        onClick={toggleMoreActionDrawer("right", false)}
        participantOnClick = {toggleParticipantDrawer("right", true)}
        participantTitle = "Participants Details"
        chatOnClick = {toggleChatDrawer("right", true)}
        chatTitle="Chat Box"
        layoutOnClick = {toggleView}
      /> */}
    </>
  );

  const setLayoutAndFeature = (layoutType, presentationType, actionData) => {
    dispatch(setLayout(layoutType));
    dispatch(setPresentationtType({ presentationType }));
    action(actionData);
  };

  useEffect(() => {
    // let doit;
    // document.documentElement.addEventListener('mouseleave', () => skipResize = false);
    // document.documentElement.addEventListener('mouseenter', () => skipResize = true)

    document.addEventListener("dblclick", toggleFullscreen);
    // window.addEventListener("resize", ()=> {
    //   clearTimeout(doit);
    //   doit = setTimeout(resize, 250);
    // });
    addFullscreenListeners();
    return () => {
      document.removeEventListener("dblclick", toggleFullscreen);
      removeFullscreenListeners();
      // window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (conference.getParticipantsWithoutHidden()[0]?._id) {
      setTimeout(
        () =>
          conference.sendEndpointMessage(
            conference.getParticipantsWithoutHidden()[0]?._id,
            { action: GET_PRESENTATION_STATUS }
          ),
        1000
      );
    }
    const checkPresentationStatus = (participant, payload) => {
      if (payload?.action === GET_PRESENTATION_STATUS) {
        conference.sendEndpointMessage(participant._id, {
          action: RECEIVED_PRESENTATION_STATUS,
          status: featureStates.whiteboard
            ? "whiteboard"
            : featureStates.sharedDocument
            ? "sharedDocument"
            : "none",
        });
      }

      if (payload?.action === RECEIVED_PRESENTATION_STATUS) {
        if (payload.status === "whiteboard") {
          setLayoutAndFeature(PRESENTATION, WHITEBOARD, {
            key: "whiteboard",
            value: true,
          });
          action({ key: "sharedDocument", value: false });
        }

        if (payload.status === "sharedDocument") {
          setLayoutAndFeature(PRESENTATION, SHARED_DOCUMENT, {
            key: "sharedDocument",
            value: true,
          });
          action({ key: "whiteboard", value: false });
        }
      }
    };
    conference.addEventListener(
      SariskaMediaTransport.events.conference.ENDPOINT_MESSAGE_RECEIVED,
      checkPresentationStatus
    );
    return () => {
      conference.removeEventListener(
        SariskaMediaTransport.events.conference.ENDPOINT_MESSAGE_RECEIVED,
        checkPresentationStatus
      );
    };
  }, [featureStates.whiteboard, featureStates.sharedDocument]);

  useEffect(() => {
    conference.getParticipantsWithoutHidden()?.forEach((item) => {
      if (item._properties?.transcribing) {
        action({ key: "caption", value: true });
      }

      if (item._properties?.recording) {
        action({ key: "recording", value: true });
      }

      if (item._properties?.streaming) {
        action({ key: "streaming", value: true });
      }

      if (item._properties?.whiteboard === "start") {
        setLayoutAndFeature(PRESENTATION, WHITEBOARD, {
          key: "whiteboard",
          value: true,
        });
      }

      if (item._properties?.sharedDocument === "start") {
        setLayoutAndFeature(PRESENTATION, SHARED_DOCUMENT, {
          key: "sharedDocument",
          value: true,
        });
      }
    });

    conference.addEventListener(
      SariskaMediaTransport.events.conference.PARTICIPANT_PROPERTY_CHANGED,
      (participant, key, oldValue, newValue) => {
        if (key === "whiteboard" && newValue === "start") {
          setLayoutAndFeature(PRESENTATION, WHITEBOARD, {
            key: "whiteboard",
            value: true,
          });
        }

        if (key === "whiteboard" && newValue === "stop") {
          setLayoutAndFeature(SPEAKER, null, {
            key: "whiteboard",
            value: false,
          });
        }

        if (key === "sharedDocument" && newValue === "stop") {
          setLayoutAndFeature(SPEAKER, null, {
            key: "sharedDocument",
            value: false,
          });
        }

        if (key === "sharedDocument" && newValue === "start") {
          setLayoutAndFeature(PRESENTATION, SHARED_DOCUMENT, {
            key: "sharedDocument",
            value: true,
          });
        }
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.TRANSCRIPTION_STATUS_CHANGED,
      (status) => {
        if (status === "ON") {
          conference.setLocalParticipantProperty("transcribing", true);
          dispatch(
            showSnackbar({ autoHide: true, message: "Caption started" })
          );
          action({ key: "caption", value: true });
        }

        if (status === "OFF") {
          conference.removeLocalParticipantProperty("transcribing");
          dispatch(
            showSnackbar({ autoHide: true, message: "Caption stopped" })
          );
          dispatch(addSubtitle({}));
          action({ key: "caption", value: false });
        }
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.RECORDER_STATE_CHANGED,
      (data) => {
          if (streamingMode !== 'srs' && data._statusFromJicofo === "on" && data._mode === "stream") {
            conference.setLocalParticipantProperty("streaming", true);
            dispatch(
              showSnackbar({ autoHide: true, message: "Live streaming started" })
            );
            action({ key: "streaming", value: true });
            localStorage.setItem("streaming_session_id", data?._sessionID);
          }
          
          if (streamingMode !== 'srs' && data._statusFromJicofo === "off" && data._mode === "stream") {
            conference.removeLocalParticipantProperty("streaming");
            dispatch(
              showSnackbar({ autoHide: true, message: "Live streaming stopped" })
            );
            action({ key: "streaming", value: false });
          }

        if (data._statusFromJicofo === "on" && data._mode === "file") {
          conference.setLocalParticipantProperty("recording", true);
          dispatch(
            showSnackbar({ autoHide: true, message: "Recording started" })
          );
          action({ key: "recording", value: true });
          localStorage.setItem("recording_session_id", data?._sessionID);
        }

        if (data._statusFromJicofo === "off" && data._mode === "file") {
          conference.removeLocalParticipantProperty("recording");
          dispatch(
            showSnackbar({ autoHide: true, message: "Recording stopped" })
          );
          action({ key: "recording", value: false });
        }

        if (streamingMode !== 'srs' && data._mode === "stream" && data._error) {
          conference.removeLocalParticipantProperty("streaming");
          dispatch(
            showSnackbar({
              autoHide: true,
              message: RECORDING_ERROR_CONSTANTS[data._error],
            })
          );
          action({ key: "streaming", value: false });
        }

        if (data._mode === "file" && data._error) {
          conference.removeLocalParticipantProperty("recording");
          dispatch(
            showSnackbar({
              autoHide: true,
              message: RECORDING_ERROR_CONSTANTS[data._error],
            })
          );
          action({ key: "recording", value: false });
        }
      }
    );
  }, []);

  const leaveConference = () => {
    dispatch(clearAllReducers());
    dispatch(setIsMeetingStarted(false))
  };
  
  return (
    <Box id="footer" className={classes.root}>
      <Box className={classes.actionContainer}>
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        <Box className={classes.infoContainer}>
          <Typography variant="h6">Meeting Title : &nbsp;</Typography>
          <Typography style={{color: color.primaryLight, fontSize: '1.4rem'}}>{profile.meetingTitle}</Typography>
        </Box>
      </Box>
      {/* <LiveStreamDialog
        close={closeLiveStreamDialog}
        createLiveStream={createLiveStream}
        open={openLivestreamDialog}
        broadcasts={broadcasts}
        selectedBroadcast={selectedBroadcast}
      /> */}
      <Box className={classes.permissions}>
        <Box className={classes.iconContainer}>
        <StyledTooltip
          title={
            audioTrack
              ? audioTrack?.isMuted()
                ? "Unmute Audio"
                : "Mute Audio"
              : "Check the mic or Speaker"
          }
        >
          {audioTrack ? (
            audioTrack?.isMuted() ? (
              <MicOffIcon onClick={unmuteAudio} className={classes.active} />
            ) : (
              <MicIcon onClick={muteAudio} />
            )
          ) : (
            <MicIcon onClick={muteAudio} style={{ cursor: "unset" }} />
          )}
        </StyledTooltip>
        <StyledTooltip
          title={videoTrack?.isMuted() ? "Unmute Video" : "Mute Video"}
        >
          {videoTrack?.isMuted() ? (
            <VideocamOffIcon onClick={unmuteVideo} className={classes.active} />
          ) : (
            <VideocamIcon onClick={muteVideo} />
          )}
        </StyledTooltip>
        <StyledTooltip title={presenting ? "Stop Presenting" : "Share Screen"}>
          {presenting ? (
            <StopScreenShareIcon className={classnames(classes.active, classes.screenShare)}
            onClick={stopPresenting} />
          ) : (
            <ScreenShareIcon className={ classes.screenShare}
             onClick={shareScreen} />
          )}
        </StyledTooltip>
        </Box>
        <Box className={classes.iconContainer}>
        <StyledTooltip title={raiseHand ? "Hand Down" : "Raise Hand"}>
          {raiseHand ? (
            <PanToolIcon
              onClick={stopRaiseHand}
              className={classnames(classes.active, classes.panTool)}
            />
          ) : (
            <PanToolIcon onClick={startRaiseHand} className={classes.panTool} />
          )}
        </StyledTooltip>
        <CopyMeetingLink textToCopy={profile.meetingTitle} />
        {/* <Hidden smDown>
          <StyledTooltip title="Participants Details">
            <GroupIcon onClick={toggleParticipantDrawer("right", true)} />
          </StyledTooltip>
        </Hidden> */}
        {/* <DrawerBox
          open={participantState["right"]}
          onClose={toggleParticipantDrawer("right", false)}
        >
          {participantList("right")}
        </DrawerBox> */}
        <StyledTooltip title="Chat Box">
          <StyledBadge badgeContent={unread}>
            <ChatIcon
              onClick={toggleChatDrawer("right", true)}
              className={classes.chat}
            />
          </StyledBadge>
        </StyledTooltip>
        <DrawerBox
          open={chatState["right"]}
          onClose={toggleChatDrawer("right", false)}
        >
          {chatList("right")}
        </DrawerBox>
        {/* <Hidden smDown>
        <StyledTooltip
          title={
            layout.type === SPEAKER || layout.type === PRESENTATION
              ? "Grid View"
              : "Speaker View"
          }
        >
          {layout.type === SPEAKER || layout.type === PRESENTATION ? (
            <ViewListIcon onClick={toggleView} className={classes.subIcon} />
          ) : (
            <ViewComfyIcon
              onClick={toggleView}
              className={classnames(classes.subIcon, classes.active)}
            />
          )}
        </StyledTooltip>
        </Hidden> */}
        </Box>
        <Hidden mdUp>
        <StyledTooltip title="Leave Call">
          <CallEndIcon onClick={leaveConference} className={classes.end} />
        </StyledTooltip>
      </Hidden>
        {/* <StyledTooltip title="More Actions">
          <MoreVertIcon
            onClick={toggleMoreActionDrawer("right", true)}
            className={classes.more}
          />
        </StyledTooltip> */}
        {/* <DrawerBox
          open={moreActionState["right"]}
          onClose={toggleMoreActionDrawer("right", false)}
        >
          {moreActionList("right")}
        </DrawerBox> */}
      </Box>

      <Hidden smDown>
        <Box sx={{display: 'flex'}}>
        <StyledTooltip title="Leave Call">
          <CallEndIcon onClick={leaveConference} className={classes.end} />
        </StyledTooltip>
        {/* <StyledTooltip title={"Go Live"}>
          <Box className={classes.liveBox} onClick={toggleLiveDrawer("right", true)} >          
            <FiberManualRecordIcon className={classes.dot} />
            <Button className={classes.live}>{"Go Live"}</Button>
          </Box>
        </StyledTooltip> */}
        </Box>
        {/* <DrawerBox
          open={liveState["right"]}
          onClose={toggleLiveDrawer("right", false)}
        >
          {liveList("right")}
        </DrawerBox> */}
      </Hidden>
      </Box>
    </Box>
  );
};

export default ActionButtons;
