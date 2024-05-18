import { Avatar, Box, Hidden } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import SettingsIcon from '@material-ui/icons/Settings';
import { color } from "../../../../../assets/styles/_color";
import VideoBox from "../../../../../components/VideoBox";
import Logo from "../../../../../components/Logo";
import StyledTooltip from "../../../../../components/StyledTooltip";
import { localTrackMutedChanged } from "../../../../../store/actions/track";

const JoinTrack = ({ tracks, name, toggleSettingsDrawer }) => {
  const videoTrack = tracks.find((track) => track && track.isVideoTrack());
  const audioTrack = tracks.find((track) => track && track.isAudioTrack());
  const {documentHeight, documentWidth} = {documentHeight: 240, documentWidth: 320};
  const bgColor = useSelector(state=>state.profile?.color);
  const dispatch = useDispatch();


  const unmuteAudioLocalTrack = async () => {
    await audioTrack?.unmute();
    dispatch(localTrackMutedChanged());
  };

  const muteAudioLocalTrack = async () => {
    await audioTrack?.mute();
    dispatch(localTrackMutedChanged());
  };

  const unmuteVideoLocalTrack = async () => {
    await videoTrack?.unmute();
    dispatch(localTrackMutedChanged());
  };

  const muteVideoLocalTrack = async () => {
    await videoTrack?.mute();
    dispatch(localTrackMutedChanged());
  };

  const useStyles = makeStyles((theme) => ({
    localStream: {
      margin: "0px",
      position: "relative",
      background: color.secondaryDark,
      "& .widthAuto  video" :  {
        width: "auto!important"
      },
      "& .heightAuto  video": {
        height: "auto!important"
      }
    },
    avatarBox: {
        height: '240px',
        width: '320px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        borderRadius: '8px',
        position: 'relative',
        background: color.secondary
    },
    avatar: {
      borderRadius: "50%",
      transition: "box-shadow 0.3s ease",
      height: '80px',
      width: '80px',
      fontSize: name && '40px', 
      fontWeight: name && '100', 
      backgroundColor: bgColor,
      "& span": {
          fontSize: '150px'
      },
      "& svg": {
          fontSize: "150px"
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: '40px',
        height: '8px',
        width: '8px'
      }
    },
    videoWrapper: {
      borderRadius: '8px',
       "& > div": { 
           borderRadius: 0
       },
       "& .rightControls": {
          display: "none"
       },
       "& .userDetails": {
          display: "none"
       },
       "& .audioBox": {
          display: "none"
       }
    },
    permissions: {
      display: "flex",
      justifyContent: "space-around",
      marginTop: "1rem",
      "& svg": {
        //border: `1px solid ${color.white}`,
        padding: "4px 0px",
        borderRadius: "7.5px",
        color: color.white,
        fontSize: "24px",
        "&:hover": {
          color: color.primaryLight,
          cursor: "pointer",
        },
        [theme.breakpoints.down("sm")]: {
          fontSize: "1.6rem",
        }
      },
      [theme.breakpoints.down("sm")]: {
        marginTop: "10px !important",
        padding: '0',
        width: '250px',
        margin: 'auto'
      }
    },
  }));

  const classes = useStyles();

  return (
    <div
      className={classes.localStream}
    >
      {videoTrack?.isMuted() ? (
        <Box className={classes.avatarBox} 
        style={{ width: documentWidth, height: documentHeight }}>
          <Avatar className={classes.avatar}>
            {!name ? (
              <PersonOutlinedIcon />
            ) : (
              name?.slice(0, 1).toUpperCase()
            )}
          </Avatar>
        </Box>
      ) : (
        <div  className={classes.videoWrapper} style={{ width: documentWidth, height: documentHeight, overflow: "hidden", position: "relative"}} >
          <VideoBox width={documentWidth} height={documentHeight} participantTracks={tracks} />
        </div>
      )}
      <Box className={ classes.permissions }>
          {audioTrack?.isMuted() ? (
            <StyledTooltip title="Unmute Audio">
              <MicOffIcon onClick={unmuteAudioLocalTrack} />
            </StyledTooltip>
          ) : (
            <StyledTooltip title="Mute Audio">
              <MicIcon onClick={muteAudioLocalTrack} />
            </StyledTooltip>
          )}
          {videoTrack?.isMuted() ? (
            <StyledTooltip title="Unmute Video">
              <VideocamOffIcon onClick={unmuteVideoLocalTrack} />
            </StyledTooltip>
          ) : (
            <StyledTooltip title="Mute Video">
              <VideocamIcon onClick={muteVideoLocalTrack} />
            </StyledTooltip>
          )}
          <StyledTooltip title="Settings">
            <SettingsIcon onClick={toggleSettingsDrawer("right", true)} />
          </StyledTooltip>
        </Box>
    </div>
  );
};

export default JoinTrack;