import React, { useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
//import EmojiPickerContainer from "../shared/EmojiPickerContainer";
import { useStore } from "../../../../api/context";
import { useNavigate } from "react-router-dom";
import { hasDuplicates, isMessageEmpty } from "../../../../utils";
import { useDispatch } from "react-redux";
import { setIsMeetingStarted } from "../../../../store/actions/auth";
import MessageListHeader from "./MessageListHeader";
import MessageListContent from "./MessageListContent";
import MessageListAction from "./MessageListAction";
import useColor from "../../../../hooks/useColor";



const initialState = {
  poll: {
    question: " ",
    options: ["", ""],
    error: "",
  }
};

const MessageList = ({
  messages,
  pushMessage,
  loading,
  pushVote,
  newVotes,
  messageId
}) => {
  const color = useColor();
  const useStyles = makeStyles((theme) => ({
    root: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      backgroundColor: `transparent`,
      border: `1px solid ${color.whitePointOne}`,
      borderRadius: '8px'
    },
    card: {
      flex: 1,
      width: "100%",
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      maxHeight: "calc(100vh - 120px)",
      background: 'transparent',
      borderRadius: '8px'
    }
  }));
  const classes = useStyles();
  const [text, setText] = useState("");
  //const [chat, setChat] = useState("");
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  let [fileAttached, setFileAttached] = useState([]);
  const [openPoll, setOpenPoll] = React.useState(false);
  const [poll, setPoll] = useState(initialState.poll);
  const [counter, setCounter] = useState(initialState.counter);
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const {
    users: { user, userName },
    rooms: { room },
  } = useStore();

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleEmojiPicker = () => {
    setIsPickerVisible(!isPickerVisible);
  };

  const handleEmojiClick = (emojiData, event) => {
    setText(text + emojiData.emoji);
    setIsPickerVisible(!isPickerVisible);
  };

  const startFileUpload = (fileData) => {
    const index = fileAttached.findIndex((item) => fileData.id === item.id);

    if (index >= 0) {
      const item = fileAttached[index];
      item.status = fileData.status;
      item.url = fileData.url;
      fileAttached[index] = item;
    } else {
      setFileAttached([...fileAttached, fileData]);
    }
  };

  const removeAttachment = (id) => {
    setFileAttached(fileAttached.filter((file) => file.id !== id));
  };

  const handleOpenPoll = () => {
    setOpenPoll(true);
  };

  const handleChangePoll = (e, index, optValue) => {
    if (e.target.name === "question") {
      setPoll((poll) => ({ ...poll, question: e.target.value }));
    } else {
      const updatedPollOptions = [...poll.options];
      updatedPollOptions[index] = optValue;
      setPoll((poll) => ({
        ...poll,
        options: updatedPollOptions,
        error: ''
      }));
    }
  };

  const disableButton = isMessageEmpty(text, fileAttached);

  const handleClosePoll = (e) => {
    e.preventDefault();
    setPoll(initialState.poll);
    setOpenPoll(false);
  };

  const handleSubmitPoll = (e) => {
    e.preventDefault();
    setPoll((poll) => ({ ...poll, error: `` }));
    if (!poll.question || poll.question.trim() === "") {
      setPoll((poll) => ({
        ...poll,
        error: "Poll Question can't be kept blank",
      }));
      return;
    }
    for (let opt of poll.options) {
      let index = poll.options.indexOf(opt);
      if (!opt) {
        setPoll((poll) => ({
          ...poll,
          error: `Poll Option ${index + 1} can't be kept blank`,
        }));
        break;
      }
    }

    if (hasDuplicates(poll.options)) {
      setPoll((poll) => ({
        ...poll,
        error: `Poll can't have duplicate options`,
      }));
    }

    if (poll.error) {
      return;
    }
    //setPoll((poll) => ({ ...poll, question: poll.question.trim() }));
    let trimmedPoll = {...poll, question: poll.question.trim()};
    pushMessage(trimmedPoll, "poll");

    if (!disableButton) {
      setPoll(initialState.poll);
    }
    setOpenPoll(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fileAttached.find((item) => item.status === "loading")) {
      return;
    }
    if (!disableButton) {
      if (text) {
        pushMessage(text);
      }
      if (fileAttached.length) {
        fileAttached.map((item) => {
          if (item.status === "done") {
            pushMessage(item.url);
          }
        });
      }
    }
    setText("");
    setFileAttached([]);
    //setChat((chat) => [...chat, text]);
  };
  
  useEffect(() => {
    //const userDetails = JSON.parse(localStorage.getItem("user"));
    //const roomDetails = JSON.parse(localStorage.getItem("room"));
    //setUser(userDetails);
    //setRoom(roomDetails);
    scrollToBottom();
  }, []);

  const scrollRef = useRef(null);
  const scrollToBottom = () => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [text]);

  const goBack = () => reduxDispatch(setIsMeetingStarted(false));

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <MessageListHeader 
          goBack={goBack} 
          loading={loading} 
          room={room} 
          user={user} 
        />
        <MessageListContent 
          messages={messages} 
          counter={counter} 
          pushVote={pushVote} 
          newVotes={newVotes} 
          messageId={messageId} 
          user={user} 
          scrollRef={scrollRef} 
          fileAttached={fileAttached}
          removeAttachment={removeAttachment}
        />
        <MessageListAction 
          disableButton={disableButton} 
          handleChange={handleChange} 
          handleSubmit={handleSubmit}
          startFileUpload={startFileUpload} 
          text={text} 
          handleOpenPoll={handleOpenPoll} 
          openPoll={openPoll} 
          poll={poll} 
          setPoll={setPoll} 
          handleChangePoll={handleChangePoll} 
          handleClosePoll={handleClosePoll} 
          handleSubmitPoll={handleSubmitPoll}
        />
      </Card>
      {/* {messages.map((message, id) => <MessageItem message={message} key={id}/>)} */}
    </div>
  );
};

export default MessageList;
