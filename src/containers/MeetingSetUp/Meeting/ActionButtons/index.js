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
import { color } from "../../../../assets/styles/_color";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CallEndIcon from "@material-ui/icons/CallEnd";
import {
  addLocalTrack,
  removeLocalTrack,
} from "../../../../store/actions/track";
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
  VIDEO_CONFERENCING,
  LIVE_STREAMING,
} from "../../../../constants";
import {
  setFullScreen,
  setLayout,
  setPresenter,
  setPresentationtType,
} from "../../../../store/actions/layout";
import { clearAllReducers } from "../../../../store/actions/conference";
import {
  exitFullscreen,
  isFullscreen,
  requestFullscreen,
  startStreamingInSRSMode,
  stopStreamingInSRSMode,
} from "../../../../utils";
//import ParticipantDetails from "../ParticipantDetails";
//import MoreAction from "../../shared/MoreAction";
import { addSubtitle } from "../../../../store/actions/subtitle";
import { showSnackbar } from "../../../../store/actions/snackbar";
import StyledTooltip from "../../../../components/StyledTooltip";
//import LiveStreamingDetails from "../LiveStreamingDetails";
import { showNotification } from "../../../../store/actions/notification";
import googleApi from "../../../../utils/google-apis";
import { setIsMeetingStarted } from "../../../../store/actions/auth";
import ToolBox from "../../../../components/ToolBox";
//import LiveStreamDialog from "../LiveStreamDialog";





const ActionButtons = ({ dominantSpeakerId }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const conference = useSelector((state) => state.conference);
  const mediaType = useSelector((state) => state.media)?.mediaType;
  const profile = useSelector((state) => state.profile);
  const layout = useSelector((state) => state.layout);
  const [featureStates, setFeatureStates] = useState({});
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
       if(streamingResponse?.started){
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
       if(streamingResponse?.started){
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
      if(!streamingResponse?.started){
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

   // document.addEventListener("dblclick", toggleFullscreen);
    // window.addEventListener("resize", ()=> {
    //   clearTimeout(doit);
    //   doit = setTimeout(resize, 250);
    // });
   // addFullscreenListeners();
    return () => {
   //   document.removeEventListener("dblclick", toggleFullscreen);
    //  removeFullscreenListeners();
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
  
  const useStyles = makeStyles((theme) => ({
    root: {
      height: '100%',
      width: '100%',
      maxHeight: mediaType === LIVE_STREAMING ? '262px' : '100%',
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
      padding: mediaType === VIDEO_CONFERENCING ? '32px' : '18px 32px',
      display: "flex",
      border: `1px solid ${color.secondary}`,
      borderRadius: '8px',
      justifyContent: "space-around",
      flexDirection: 'column',
      alignItems: "center"
    },
    infoContainer: {
      display: "flex"
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
    }
  }));

  const classes = useStyles();

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
      
      <ToolBox />
      </Box>
    </Box>
  );
};

export default ActionButtons;
