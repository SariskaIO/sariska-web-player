import { Avatar, Button, CardActions, Grid, TextField, Tooltip, makeStyles } from '@material-ui/core';
import React from 'react'
import PollOutlinedIcon from "@material-ui/icons/PollOutlined";
import SendIcon from '@material-ui/icons/Send';
import MediaChat from '../../../../components/MediaChat';
import Model from '../../../../components/Model';
import useColor from '../../../../hooks/useColor';
import { useSelector } from 'react-redux';

const MessageListAction = ({
    disableButton, handleChange, handleSubmit, startFileUpload, text, handleOpenPoll, openPoll, poll, setPoll, handleChangePoll, handleClosePoll, handleSubmitPoll
}) => {
    const color = useColor();
    const colorTheme = useSelector(state => state.theme)?.theme;

    const useStyles = makeStyles((theme) => ({
        cardAction: {
          //boxShadow: "0px 4px 4px 2px rgba(0,0,0,0.8)",
         // boxShadow: "0px -16px 9px -9px rgba(0,0,0,0.8)",
         boxShadow: colorTheme ==='dark' ? '0 -19px 20px 3px rgba(0, 0, 0, 0.5)' : '0 1px 20px 3px rgba(0, 0, 0, 0.5)', 
          zIndex: "9",
        },
        cardForm: {
          display: "flex",
          alignItems: "flex-end",
          width: "100%",
        },
        cardTextField: {
          width: "100%",
          padding: "0 2px",
          '& .MuiFormLabel-root': {
            color: `${color.primaryLight} !important`,
            '& .Mui-focused': {
              color: color.primaryLight
            },
          },
          '& .MuiInputLabel-outlined': {
            transform: 'translate(14px, 12px) scale(1)',
            '&.MuiInputLabel-shrink': {
              transform: 'translate(16px, -5px) scale(0.75)'
            }
          },
          '&.MuiTextField-root:hover .MuiOutlinedInput-notchedOutline':{
            borderColor: `${color.primaryLight} !important`,
          },
          '& .MuiOutlinedInput-input': {
            color: color.white,
            padding: '10.5px 14px'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: color.white
          }
        },
        enterText: {
          color: color.white,
          marginBottom: "-2px",
          marginRight: "-3px",
          backgroundColor: `transparent`,
          "&:hover": {
            color: color.primaryLight,
            cursor: "pointer",
          }
        },
        poll: {
          color: color.white,
          marginBottom: "-2px",
          marginRight: "-3px",
          "&:hover": {
            color: color.primaryLight,
          },
        },
      }));
      const classes = useStyles();
  return (
    <CardActions disableSpacing className={classes.cardAction}>
          {
            <MediaChat
              startFileUpload={startFileUpload}
              currentMessage={text}
            />
          }
          <form
            noValidate
            autoComplete="off"
            className={classes.cardForm}
            onSubmit={handleSubmit}
          >
            <Grid
              container
              spacing={1}
              alignItems="flex-end"
              style={{ width: "100%", alignItems: "center" }}
            >
              <Grid item>
                <Button
                  style={{
                    padding: "2px",
                    borderRadius: "50%",
                    minWidth: "50%",
                  }}
                  onClick={handleOpenPoll}
                >
                  <Tooltip title="Poll" placement="top">
                    <PollOutlinedIcon className={classes.poll} />
                  </Tooltip>
                </Button>
              </Grid>
              <Model
                open={openPoll}
                poll={poll}
                setPoll={setPoll}
                handleChange={handleChangePoll}
                handleClose={handleClosePoll}
                handleSubmit={handleSubmitPoll}
              />
              <Grid item>
                {/* <EmojiPickerContainer
                  handleEmojiClick={handleEmojiClick}
                  handleEmojiPicker={handleEmojiPicker}
                  isVisible={isPickerVisible}
                  position={"absolute"}
                  left={"60px"}
                  bottom={"75px"}
                  emojiStyle={"apple"}
                  showPreview={false}
                  height={350}
                /> */}
              </Grid>
              <Grid item style={{ flex: 1 }}>
                <TextField
                  id="text"
                  label="Enter Text Here"
                  variant="outlined"
                  className={classes.cardTextField}
                  onChange={handleChange}
                  value={text}
                />
              </Grid>
              <Grid item>

              <Tooltip title="Send" placement="top">
                <Avatar
                  className={classes.enterText}
                  onClick={handleSubmit}
                  disabled={disableButton}
                >
                  <SendIcon />
                </Avatar>
              </Tooltip>
              </Grid>
            </Grid>
          </form>
        </CardActions>
  )
}

export default MessageListAction