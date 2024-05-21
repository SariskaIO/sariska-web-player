import { Box, Divider, Grid, Typography, makeStyles } from "@material-ui/core";
import React from "react";
import { color } from "../../../assets/styles/_color";
import ActionButtons from "./ActionButtons";
import ReconnectDialog from "../../../components/ReconnectDialog";
import { useSelector } from "react-redux";
import GridLayout from "./GridLayout";
// import SpeakerLayout from "../../../components/SpeakerLayout";
// import PresentationLayout from "../../../components/PresentationLayout";
import Notification from "../../../components/Notification";
import {
  GRID,
  ENTER_FULL_SCREEN_MODE,
  LIVE_STREAMING,
} from "../../../constants";
import { useMeeting } from "../../../hooks/useMeeting";
import LobbyHome from "../CreateMeeting/LobbyHome";
import PermissionDialog from "../../../components/PermissionDialog";
import SnackbarBox from "../../../components/Snackbar";
import { getRealParticipants } from "../../../utils";
import StreamingPlayer from "../../MediaTypes/LiveStreaming/StreamingPlayer";
import Title from "../../../components/Title";

const Meeting = () => {
  const {dominantSpeakerId, lobbyUser, denyLobbyAccess, allowLobbyAccess} = useMeeting();
  const layout = useSelector((state) => state.layout);
  const notification = useSelector((state) => state.notification);
  const snackbar = useSelector((state) => state.snackbar);
  const conference = useSelector((state) => state.conference);
  const mediaType = useSelector((state) => state.media)?.mediaType;
  
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      background: color.secondaryDark,
      paddingTop: '16px',
      marginTop:  mediaType === LIVE_STREAMING ? '36px' : '54px',
      minHeight:
        layout.mode === ENTER_FULL_SCREEN_MODE ? "100vh" : "520px",
    },
  }));

  const classes = useStyles();


  if (!conference || !conference.isJoined()) {
    return <LobbyHome />;
  }

  const participants = getRealParticipants(conference, layout);
  
  let justifyContent = "space-between";
  let paddingTop = 16;
  if (layout.mode === ENTER_FULL_SCREEN_MODE) {
    justifyContent = "space-around";
    paddingTop = 0;
  }

  return (
    <Box
      className={classes.root}
    >
      <Grid container>
        {
          mediaType === LIVE_STREAMING ? 
            <Grid item md={12} style={{marginBottom: '24px'}}>
              <Title title={'Generate the Live Streaming URLs'} isDivider={true} />
            </Grid> 
          : null
        }
        <Grid item md={4}>
          <ActionButtons dominantSpeakerId={dominantSpeakerId} />
        </Grid>
        <Grid item md={8}>
          { layout.type === GRID && (
            <GridLayout dominantSpeakerId={dominantSpeakerId} />
          )}
          {participants?.length < 2 ? <>
          {lobbyUser?.map((item) => (
            <PermissionDialog
              denyLobbyAccess={denyLobbyAccess}
              allowLobbyAccess={allowLobbyAccess}
              userId={item.id}
              displayName={item.displayName}
            />
          ))}</> : null }
          <SnackbarBox notification={notification} />
          <ReconnectDialog open={layout.disconnected === "lost"} />
          <Notification snackbar={snackbar} />
        </Grid>
        {
            mediaType === LIVE_STREAMING ? 
                <StreamingPlayer /> 
            : null
        }
      </Grid>
    </Box>
  );
};

export default Meeting;
