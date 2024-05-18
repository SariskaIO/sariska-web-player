

import React from 'react';
import { Box, makeStyles, Grid, Typography, Hidden } from '@material-ui/core'
import { useSelector } from "react-redux";
import CloseIcon from '@material-ui/icons/Close';
import VideoBox from "../../../../../components/VideoBox";
import { calculateRowsAndColumns, getAllParticipants, getLeftTop, isMobileOrTab } from "../../../../../utils";
import DrawerBox from '../../../../../components/DrawerBox';
import { color } from '../../../../../assets/styles/_color';
import { PARTICIPANTS_VISIBLE_ON_MOBILE } from '../../../../../constants';

const ParticipantGrid = ({ dominantSpeakerId }) => {
    const [participantState, setParticipantState] = React.useState({
        right: false,
      });
    const layout = useSelector(state => state.layout);
    const useStyles = makeStyles((theme) => ({
        root: {
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        },
        container: {
            position: "relative",
            [theme.breakpoints.down("md")]: {
                justifyContent: 'center'
            }
        },
        containerItem: {
            position: "absolute",
            width: "100%",
            height: "100%"
        },
        participantHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            "& svg": {
              color: color.white
            }
        },
        title: {
            color: color.white,
            fontWeight: "400",
            marginLeft: "8px",
            fontSize: "28px",
            lineHeight: "1",
            [theme.breakpoints.down("md")]: {
              marginLeft: 0,
              fontSize: '24px'
            }
        }
    }));
    const classes = useStyles();
    const conference = useSelector(state => state.conference);
    const localTracks = useSelector(state => state.localTrack);
    const remoteTracks = useSelector(state => state.remoteTrack);
    const localUser = conference.getLocalUser();
    const participants = getAllParticipants(conference, layout);
    // all participants 
    const tracks = { ...remoteTracks, [localUser.id]: localTracks };
    // all tracks
    
    let { viewportWidth, viewportHeight } = {viewportWidth: '100%', viewportHeight: '500px'};

    const {
        rows,
        columns,
        gridItemWidth,
        gridItemHeight
    } = calculateRowsAndColumns(participants.length, viewportWidth, viewportHeight); // get grid item dimension
    // now render them as a grid
    
    // const participantList = (anchor) => (
    //     <>
    //         <Box className={classes.participantHeader}>
    //         <Typography variant="h6" className={classes.title}>
    //             Participants
    //         </Typography>
    //         <Hidden smUp>
    //             <CloseIcon onClick={toggleParticipantDrawer(anchor, false)}/>
    //         </Hidden>
    //         </Box>
    //         <ParticipantDetails />
    //     </>
    //     );
    const toggleParticipantDrawer = (anchor, open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setParticipantState({ ...participantState, [anchor]: open });
        };
        
    return (
        <Box className={classes.root}>
            <Grid className={classes.container} style={{ height: viewportHeight, width: viewportWidth }} container item>
                {[...Array(rows)].map((x, i) =>
                    <>
                        {[...Array(columns)].map((y, j) => {
                            return (tracks[participants[i * columns + j]?._id] || participants[i * columns + j]?._id) &&
                                <Box className={classes.containerItem} style={{ 
                                    left: getLeftTop(i, j, gridItemWidth, gridItemHeight, rows, participants.length, viewportHeight).left, 
                                    top: getLeftTop(i, j, gridItemWidth, gridItemHeight, rows, participants.length, viewportHeight).top, 
                                    width: gridItemWidth,
                                    height: gridItemHeight
                                }}>
                                        <VideoBox key={i * columns + j}
                                            height={gridItemHeight}
                                            width={gridItemWidth}
                                            isBorderSeparator={participants.length > 1}
                                            isFilmstrip={true}
                                            isPresenter={participants[i * columns + j].presenter ? true : false}
                                            isActiveSpeaker={dominantSpeakerId === participants[i * columns + j]._id}
                                            participantDetails={participants[i * columns + j]?._identity?.user}
                                            participantTracks={tracks[participants[i * columns + j]._id]}
                                            localUserId={conference.myUserId()}
                                        />
                                </Box>
                            }
                        )}
                    </>
                )}
            </Grid>
        </Box>
    );
}

export default ParticipantGrid;