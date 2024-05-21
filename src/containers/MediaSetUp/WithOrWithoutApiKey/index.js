import React from 'react';
import { Box, Button, Hidden, TextField, Typography, makeStyles } from '@material-ui/core'
import { color } from '../../../assets/styles/_color';
import { useDispatch, useSelector } from 'react-redux';
import { setIsApiKeyRequired } from '../../../store/actions/auth';

const WithOrWithoutApiKey = ({isApiKey, apiKeyValue, handleChange, setIsApiKey, error, setError}) => {

  const useStyles = makeStyles((theme)=>({
    inputContainer: {
        display: 'flex', 
        alignItems: 'center', 
        flexDirection: 'column', 
        width: '100%',
        marginTop: '48px'
    },
    textField: {
        width: '50%',
        marginBottom: '1rem',
        color: color.white,
        '& .MuiOutlinedInput-input': {
            padding: '12.5px 14px',
            color: color.white
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: color.white,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: color.whiteLight,
        },
        [theme.breakpoints.down('md')]: {
            width: '100%',
            marginTop: '48px',
            marginBottom: '54px'
        }
    },
    buttonContainer: {
        display: 'flex',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column'
        }
    },
    buttonActive: {
        background: isApiKey ? color.buttonGradient : 'transparent',
        color: isApiKey ? color.white : color.buttonGradient,
        borderColor: isApiKey ? color.buttonGradient : color.buttonGradient,
        textTransform: 'capitalize',
        fontSize: '1.1rem',
        marginRight: '16px',
        borderRadius: '20px',
        '&:hover': {
            opacity: 0.8,
            background: isApiKey ? color.buttonGradient : 'transparent',
        },
        [theme.breakpoints.down('md')]: {
            marginBottom: '24px'
        }
    },
    buttonOutlined: {
        background: !isApiKey ? color.buttonGradient : 'transparent',
        color: !isApiKey ? color.white : color.buttonGradient,
        borderColor: !isApiKey ? color.buttonGradient : color.buttonGradient,
        textTransform: 'capitalize',
        fontSize: '1.1rem',
        marginRight: '16px',
        borderRadius: '20px',
        '&:hover': {
            opacity: 0.8,
            background: !isApiKey ? color.buttonGradient : 'transparent',
        }
    }, 
    guideline: {
        color: color.white,
        fontSize: '1.5rem',
        marginBottom: '24px',
        [theme.breakpoints.down('md')]: {
            fontSize: '1.1rem',
            marginBottom: '34px',
        }
    }
}))

const classes = useStyles();
const dispatch = useDispatch();
const mediaType = useSelector(state => state.media)?.mediaType

const handleIsApiKey = (flag) => {
    setIsApiKey(flag);
    dispatch(setIsApiKeyRequired(flag));
    setError(null);
}

  return (
    <Box className={classes.inputContainer}>   
                    <Hidden mdUp>
                        {isApiKey ? <TextField 
                                name='apiKeyValue'
                                value={apiKeyValue}
                                onChange={handleChange}
                                placeholder='Enter Api Key'
                                variant='outlined'
                                className={classes.textField}
                                helperText={error}
                                error={error}
                            /> : 
                            <Box sx={{height: '146px'}}></Box>
                            }
                    </Hidden>
                <Box className={classes.buttonContainer} mb={8}>
                    <Button variant='outlined' className={classes.buttonActive} onClick={() => handleIsApiKey(true)}>Continue with API Key</Button>
                    <Button variant='outlined' className={classes.buttonOutlined} onClick={() => handleIsApiKey(false)}>Continue without API Key</Button>
                    </Box>
                    <Hidden mdDown>
                        {isApiKey ? <TextField 
                            name='apiKeyValue'
                            value={apiKeyValue}
                            onChange={handleChange}
                            placeholder='Enter Api Key'
                            variant='outlined'
                            className={classes.textField}
                            helperText={error}
                            error={error}
                        /> : 
                        <Typography className={classes.guideline}>Select the product you want to demo with</Typography>
                        }
                    </Hidden>
                    <Hidden mdUp> 
                            {!isApiKey ? <Typography className={classes.guideline}>Select the product you want to demo with</Typography> : null}
                    </Hidden>
                </Box>
  )
}

export default WithOrWithoutApiKey