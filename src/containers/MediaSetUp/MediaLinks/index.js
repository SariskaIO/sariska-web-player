import React from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMediaType } from '../../../store/actions/media';
import useColor from '../../../hooks/useColor';


const MediaLinks = ({isApiKey, list, apiKeyValue, setError}) => {
    const color = useColor();
    const useStyles = makeStyles((theme)=>({
        linkContainer: {
            display: 'flex', 
            justifyContent: 'center', 
            width: '100%', 
            marginTop: '56px',
            [theme.breakpoints.down('md')]: {
                flexDirection: 'column'
            }
        },
        link: {
            textDecoration: 'none', 
            border: `1px solid lightgray`, 
            borderRadius: '10px',
            color: color.white, 
            '&:hover': {
                background: 'rgba(0,0,0,0.01)',
                cursor: 'pointer'
            },
            [theme.breakpoints.down('md')]: {
                marginBottom: '16px'
            }
        },
        cardBox: {
            height: '200px', 
            minWidth: '180px',  
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-around', 
            flexDirection: 'column',
            padding:'16px', 
            '&:hover': {
                background: 'rgba(0,0,0,0.01)',
                cursor: 'pointer'
            },
            [theme.breakpoints.down('md')]: {
                flexDirection: 'column',
                minWidth: '100%', 
                width: '100%',
                padding:'16px 0',  
            }
        },
        title: {
            fontWeight: 100, 
            color: color.whiteLight, 
            fontSize: '1.5rem'
        }
    }))

    const classes = useStyles();
    const dispatch = useDispatch();

    const handleMediaType = (type) => {
        if(isApiKey && !apiKeyValue){
            setError('Please Enter apiKey');
            console.log('error')
            return;
        }
        dispatch(setMediaType(type));
    }

  return (
    <Box className={classes.linkContainer}>
                    {
                        list.map(item => (
                            <Box 
                                to={ isApiKey ? apiKeyValue ? item.to : '/' : item.to}
                                key={item.id} 
                                className={classes.link}
                                onClick={() => handleMediaType(item.mediaType)}
                                style={{
                                    marginLeft: item.ml, 
                                    marginRight: item.mr
                                }}
                            >
                            <Box 
                                className={classes.cardBox}>
                                <img src={item.src} alt={item.title} width={60} height={60} />
                                <Typography className={classes.title}>{item.title}</Typography>
                            </Box>
                            </Box>
                        ))
                    }
                </Box>
  )
}

export default MediaLinks