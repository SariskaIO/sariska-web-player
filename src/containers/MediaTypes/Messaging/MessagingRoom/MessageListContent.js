import { Avatar, Box, CardContent, Typography, makeStyles } from '@material-ui/core'
import React from 'react'
import VotePoll from '../Poll/VotePoll'
import MessageItem from './MessageItem'
import FileAttached from '../../../../components/FileAttached'

const MessageListContent = ({
    messages, counter, pushVote, newVotes, messageId, user, scrollRef, fileAttached, removeAttachment
}) => {
    const useStyles = makeStyles((theme) => ({
        cardContent: {
          flex: 1,
          height: "200px",
          minHeight: '400px',
          minWidth: '350px',
          overflow: "auto",
          padding: "16px 24px",
          [theme.breakpoints.down("md")]: {
            padding: "16px",
          },
        },
        box: {
          textAlign: "left",
        },
      
        chatLine: {
          display: "flex",
          marginBottom: "16px",
        },
        userAvatar: {
          height: "24px",
          width: "24px",
          fontSize: "1rem",
          backgroundColor: `${user?.color}`,
          marginRight: theme.spacing(2),
         // marginTop: theme.spacing(0.5),
        },
      }));

      const classes = useStyles();

  return (
    <>
        <CardContent className={classes.cardContent}>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
          ></Typography>
          <Box className={classes.box}>
            {messages.map((message, id) => (
              <Box className={classes.chatLine} 
                style={{alignItems: message.content_type === "poll" ?  'flex-start' : 'center',}} 
                key={message.id}
              >
                <Avatar aria-label="user" className={classes.userAvatar}>
                  {message.created_by_name?.toUpperCase().slice(0, 1)}
                </Avatar>

                {
                  message.content_type === "poll" ? (
                    <VotePoll
                      username={message?.created_by_name}
                      poll={message}
                      counter={counter}
                      pushVote={pushVote}
                      newVotes={newVotes}
                      messageId={messageId}
                    />
                  ) : (
                    <MessageItem message={message} id={id} />
                  )
                }
              </Box>
            ))}
          </Box>
          <Typography ref={scrollRef} style={{ height: "18px" }}></Typography>
        </CardContent>
        {fileAttached.length > 0 && (
          <Box className={classes.cb__chatWrapper__attachements}>
            {fileAttached.map((file, index) => (
              <FileAttached
                key={index}
                fileData={file}
                removeAttachment={removeAttachment}
              />
            ))}
          </Box>
        )}
    </>
  )
}

export default MessageListContent