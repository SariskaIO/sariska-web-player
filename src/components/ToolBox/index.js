import React, { useEffect, useState } from 'react';
import SariskaMediaTransport from "sariska-media-transport";
import {
    Badge,
    Box,
    Button,
    Hidden,
    Typography,
    makeStyles,
    withStyles
  } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import PanToolIcon from "@material-ui/icons/PanTool";
import ChatIcon from "@material-ui/icons/Chat";
import CloseIcon from '@material-ui/icons/Close';
import CallEndIcon from "@material-ui/icons/CallEnd";
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import classnames from "classnames";
import DrawerBox from "../../components/DrawerBox";
import CopyMeetingLink from "../../components/CopyMeetingLink";
import { color } from '../../assets/styles/_color';
import StyledTooltip from '../StyledTooltip';
import { useDispatch, useSelector } from 'react-redux';
import { addLocalTrack, localTrackMutedChanged, removeLocalTrack } from '../../store/actions/track';
import { showSnackbar } from '../../store/actions/snackbar';
import { setPresenter } from '../../store/actions/layout';
import { unreadMessage } from '../../store/actions/chat';
import ChatPanel from '../../containers/MeetingSetUp/Meeting/Chat';
import { clearAllReducers } from '../../store/actions/conference';
import { setIsMeetingStarted } from '../../store/actions/auth';
import { STREAMING_TYPES, VIDEO_CONFERENCING } from '../../constants';
import DialogBox from '../DialogBox';
import { showNotification } from '../../store/actions/notification';
import { getObjectKeysLength, startStreamingInSRSMode, stopStreamingInSRSMode } from '../../utils';
import { setStreamingUrls } from '../../store/actions/media';

const StyledBadge = withStyles((theme) => ({
    badge: {
      background: color.primary,
      top: 6,
      right: 10,
    },
  }))(Badge);


const ToolBox = () => {
    const dispatch = useDispatch();
    const conference = useSelector((state) => state.conference);
    const localTracks = useSelector((state) => state.localTrack);
    const profile = useSelector((state) => state.profile);
    const mediaType = useSelector((state) => state.media)?.mediaType;
    const [presenting, setPresenting] = useState(false);
    const unread = useSelector((state) => state.chat.unreadMessage);
    const [raiseHand, setRaiseHand] = useState(false);
    const [openStreamingMenu, setOpenStreamingMenu] = React.useState(false);
    const [streamingFlags, setStreamingFlags] = useState([STREAMING_TYPES[0].value]);
    const [streamingUrlsArray, setStreamingUrlsArray] = useState({});
    const [chatState, setChatState] = React.useState({
      right: false,
    });
    const audioTrack = useSelector((state) => state.localTrack).find((track) =>
      track.isAudioTrack()
    );
    const videoTrack = useSelector((state) => state.localTrack).find((track) =>
      track.isVideoTrack()
    );
    let streamingUrlsArrayLength = getObjectKeysLength(streamingUrlsArray);

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

      const handleOpenStreamingMenu = () => {
        setOpenStreamingMenu(true);
      };

      const handleCloseStreamingMenu = () => {
        setOpenStreamingMenu(false);
      };

      const handleStreamingFlagChange = (value) => {
        const currentIndex = streamingFlags.indexOf(value);
        const newChecked = [...streamingFlags];

        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }

        setStreamingFlags(newChecked);
      };

      const startStreaming = async () => {
        if (conference?.getRole() === "none") {
          return dispatch(
            showNotification({
              severity: "info",
              autoHide: true,
              message: "You are not moderator!!",
            })
          );
        }
          dispatch(
            showSnackbar({
              severity: "info",
              message: "Starting Live Streaming",
              autoHide: false,
            })
          );
          const streamingResponse = await startStreamingInSRSMode(profile.meetingTitle, streamingFlags);
           if(streamingResponse?.started){
            setStreamingUrlsArray(streamingResponse);
            dispatch(setStreamingUrls(streamingResponse));
              conference.setLocalParticipantProperty("streaming", true);
                dispatch(
                  showSnackbar({ autoHide: true, message: "Live streaming started" })
                );
           } 
      };
    
      const stopStreaming = async () => {
        if (conference?.getRole() === "none") {
          return dispatch(
            showNotification({
              severity: "info",
              autoHide: true,
              message: "You are not moderator!!",
            })
          );
        }
         const streamingResponse = await stopStreamingInSRSMode(profile.meetingTitle);
          if(!streamingResponse?.started){
            setStreamingUrlsArray({});
            dispatch(setStreamingUrls({}));
              conference.removeLocalParticipantProperty("streaming");
                dispatch(
                  showSnackbar({ autoHide: true, message: "Live streaming stopped" })
                );
          }
      };
      
      const leaveConference = () => {
        dispatch(clearAllReducers());
        dispatch(setIsMeetingStarted(false))
      };

      const useStyles = makeStyles((theme) => ({
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
          backgroundColor: mediaType === VIDEO_CONFERENCING ? color.secondary : 'transparent',
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
          justifyContent: mediaType === VIDEO_CONFERENCING ? 'space-around' : 'center',
          marginBottom: '24px',
          alignItems: 'center'
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
          marginLeft: mediaType && '16px',
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
        chat: {
          marginRight: "0px !important",
          fontSize: "1.85rem !important",
          padding: "10px !important",
          [theme.breakpoints.down("md")]: {
            marginRight: '6px !important'
          }
        },

  liveBox: {
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${streamingUrlsArrayLength ? color.primaryLight : color.white}`,
    borderRadius: '30px',
    padding: ' 1px 12px',
   // paddingRight: '24px',
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
    color: streamingUrlsArrayLength ? color.primaryLight : color.white,
   // padding: '6px 6px 6px 0',
    minWidth: '36px'
  }
      }));

    const classes = useStyles();

  return (
    <>
    {mediaType === VIDEO_CONFERENCING ? <>
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
        </>
        :
        <Box className={classes.permissions}>
            <Box className={classes.iconContainer}>
                <CopyMeetingLink textToCopy={profile.meetingTitle} />
                <StyledTooltip title="Leave Call">
                    <CallEndIcon onClick={leaveConference} className={classes.end} />
                </StyledTooltip>
            </Box>

                <Box className={ classes.liveBox} onClick={ streamingUrlsArrayLength ? stopStreaming : handleOpenStreamingMenu }>          
                    {/* <FiberManualRecordIcon className={classes.dot} /> */}
                    <Button className={classes.live}>{streamingUrlsArrayLength ? 'Stop Streaming' : 'Start Streaming'}</Button>
                </Box>
            <DialogBox 
                open={openStreamingMenu} 
                handleOpen={handleOpenStreamingMenu} 
                handleClose={handleCloseStreamingMenu} 
                value={streamingFlags} 
                handleChange={handleStreamingFlagChange}
                startStreaming={startStreaming}
            />
        </Box>
        }
        </>
  )
}

export default ToolBox