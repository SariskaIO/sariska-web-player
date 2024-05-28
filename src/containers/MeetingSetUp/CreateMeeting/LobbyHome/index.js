import { Box, Grid } from '@material-ui/core'
import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDevices } from '../../../../store/actions/media';
import { addLocalTrack } from '../../../../store/actions/track';
import SariskaMediaTransport from "sariska-media-transport";
import LobbyRoom from '../LobbyRoom';
import { useNavigate } from 'react-router-dom';
import Title from '../../../../components/Title';
import useColor from '../../../../hooks/useColor';
import { VIDEO_CONFERENCING } from '../../../../constants';


const LobbyHome = ({link}) => {
    const color = useColor();
    const useStyles = makeStyles((theme) => ({
        root: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: 'column',
            color: "white",
            marginTop: '16px',
            width: '100%',
            minHeight: 'calc(100vh - 150px)',
            [theme.breakpoints.down("sm")]: {
                alignItems: "flex-end",
            }
        },
        gridContainer: {
            justifyContent: "space-around",
            width: 'fit-content',
            border: `1px solid ${color.whitePointOne}`,
            padding: '24px',
            borderRadius: '8px'
        },
        gridChild: {
            [theme.breakpoints.down("sm")]: {
                width: '100%'
            }
        },
    }))
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const resolution = useSelector(state => state.media?.resolution);
    const profile = useSelector((state) => state.profile);
    const localTracksRedux = useSelector(state => state.localTrack);
    const mediaType = useSelector(state => state.media?.mediaType);

    SariskaMediaTransport.initialize();
    SariskaMediaTransport.setLogLevel(SariskaMediaTransport.logLevels.ERROR); //TRACE ,DEBUG, INFO, LOG, WARN, ERROR

    const [localTracks, setLocalTracks] = useState([]);
    const iAmRecorder = window.location.hash.indexOf("iAmRecorder") >= 0;

    useEffect(() => {
        SariskaMediaTransport.mediaDevices.enumerateDevices((allDevices) => {
          dispatch(setDevices(allDevices));
        });
      }, []);

      useEffect(()=>{
        if (iAmRecorder) {
            setLocalTracks([]);
            return;
        }
        if (localTracksRedux.length > 0)  {
            return;
        }
        const createNewLocalTracks = async () => {
            let tracks = [];

            try  {
                const [audioTrack] = await SariskaMediaTransport.createLocalTracks({devices: ["audio"], resolution});
                tracks.push(audioTrack);
            } catch(e) {
                console.log("failed to fetch audio device");
            }

            try  {
                const [videoTrack]  = await SariskaMediaTransport.createLocalTracks({devices: ["video"], resolution});
                tracks.push(videoTrack);
            } catch(e) {
                console.log("failed to fetch video device");
            }
            setLocalTracks(tracks);
            tracks.forEach(track=>dispatch(addLocalTrack(track)));
        };
        createNewLocalTracks();
    },[])
    
    const getTitle = () => {
        return mediaType === VIDEO_CONFERENCING ? 'Create a Meeting' : 'Create a Meeting to Go Live'
    }
  return (
    <Box className={classes.root}>
            <Title title={getTitle()} isDivider={false} />
            <Grid className={classes.gridContainer} container>
                <Grid item md={12} className={classes.gridChild}>
                    <Box >
                        <LobbyRoom tracks={localTracks} meetingTitle={link}/>
                    </Box>
                </Grid>
            </Grid>
        </Box>
  )
}

export default LobbyHome