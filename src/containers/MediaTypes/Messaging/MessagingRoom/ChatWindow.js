import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import MessageList from './MessageList';



const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      display: 'flex',
      width: '100%'
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      textAlign: 'left'
    },
  }));

const ChatWindow = ({messages, pushMessage, loading, pushVote, newVotes, messageId}) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <MessageList messages={messages} pushMessage={pushMessage} loading={loading} pushVote={pushVote} newVotes={newVotes} messageId={messageId} />
        </div>
    )
}


export default ChatWindow;
