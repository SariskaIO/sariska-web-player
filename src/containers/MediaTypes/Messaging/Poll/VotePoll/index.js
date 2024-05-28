import {
  Box,
  Button,
  Divider,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioVote from "./RadioVote";
import DrawerBoard from "../../../../../components/DrawerBoard";
import { apiCall, getMaxInArray, getRandomColor, isEmptyObject } from "../../../../../utils";
import PollResult from "../VotePoll/PollResult";
import { useStore } from "../../../../../api/context";
import useColor from "../../../../../hooks/useColor";

const VotePoll = ({ username, poll, pushVote, newVotes, messageId}) => {
  const color = useColor();
  const useStyles = makeStyles((theme) => ({
    root: {
      background: color.secondary,
      width: "fit-content",
      padding: "16px",
      borderRadius: "0px 8px 8px 8px",
      minWidth: "300px",
      maxWidth: '360px'
      //marginBottom: '16px',
    },
    username: {
      color: getRandomColor(),
      fontSize: "1rem",
      marginBottom: "8px",
      fontWeight: 600,
      textTransform: "capitalize",
    },
    ques: {
      fontSize: "1.2rem",
      fontWeight: "600",
      marginBottom: "0.5rem",
      color: color.white
    },
    instruction: {
      display: "flex",
      alignItems: "center",
      marginBottom: ".8rem",
    },
    button: {
      textTransform: "initial",
      paddingTop: "12px",
      padding: 0,
      color: color.primaryLight,
      "&:hover": {
        background: "transparent",
      },
    },
    list: {
      width: 400,
      background: color.secondaryDark,
      borderLeft: `1px solid ${color.whitePointOne}`,
    },
    fullList: {
      width: "auto",
    },
    closeButton: {
      textTransform: "initial",
      padding: 0,
      color: color.primary,
      minWidth: "auto",
      "&:hover": {
        background: "transparent",
      },
    },
    close: {
      color: color.gray,
      marginRight: "24px",
      fontWeight: "900",
      fontSize: "1.7rem",
    },
    card: {
      boxShadow: "none",
      borderRadius: 0,
      marginBottom: "12px",
    },
    counterButton: {
      fontSize: "0.75rem",
      textTransform: "initial",
      background: color.gray3,
      padding: "0 8px",
      height: "21px",
    },
    maxCounterButton: {
      fontSize: "0.75rem",
      textTransform: "initial",
      color: color.primary,
      background: color.altBack,
      padding: "0 8px",
      height: "21px",
    },
  }));
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [value, setValue] = React.useState(null);
  const [isVoted, setIsVoted] = useState({
    status: false,
    answer: null,
  });
  const [votes, setVotes] = useState([]);
  const [votedTable, setVotedTable] = useState([]);
  const [maxVotes, setMaxVotes] = useState(null);

  const {
    users: { user },
    rooms: { room },
  } = useStore();

  const getUser = async (id) => {
    let path = `/rooms/${room.session_id}/users/${id}`;
    try {
      const response = await apiCall(path, "GET");
      if (response?.user) {
        return response.user;
      } else {
        return {};
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const getUsers = async () => {
  //   let path = `/rooms/${room.session_id}/users`;
  //   try {
  //     const response = await apiCall(path, "GET");
  //     if (response?.users) {
  //       return response.users;
  //     } else {
  //       return [];
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const fetchTotalVotes = async ( channel_id, message_id) => {
    let path = `/rooms/${room.session_id}/messages/${poll.id}/poll/votes`;
    try {
      const response = await apiCall(path, "GET");
      if(response.status === 200){
        setVotes(response.votes);
      }
    } catch (e) {
      console.log(e);
    }
  };
  
  const checkIsVoted = async () => {
    let path = `/rooms/${room.session_id}/messages/${poll.id}/poll/is_voted`;
    try {
      const response = await apiCall(path, "GET");
      if (response.is_voted) {
        setIsVoted((isVoted) => ({
          ...isVoted,
          status: true,
          answer: response.is_voted?.answer,
        }));
      } else {
        setIsVoted((isVoted) => ({
          ...isVoted,
          status: false,
          answer: response.is_voted?.answer,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const votePollOption = async (e) => {
    let poll_option_id = parseInt(e.target.value);
    let path = `/rooms/${room.session_id}/messages/${poll.id}/poll/${poll_option_id}`;
    try {
      const response = await apiCall(`${path}`, "POST");
      let content= {
        message_id: poll.id,
        answer: poll_option_id
      }
      pushVote(content);
      if(response && response?.status === 200){
        await fetchTotalVotes(room.session_id, poll.id);
        await checkIsVoted();
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
    votePollOption(event);
  };

  //let temp1= [[60, 'op1'],[61, 'op2'], [62, 'op3']];
  let temp1 = poll.options;
  const getVotedTable = async () => {
    let temp = [...temp1];
    let result = await Promise.all(
      temp.map(async (item) => {
        let counter = 0;
        let userIds = [];
        if (votes && votes.length) {
          for (const vote of votes) {
            if (parseInt(item[0]) === vote.answer) {
              counter++;
              if (vote.user_id) {
                const userData = await getUser(vote.user_id);
                if (isEmptyObject(userData)) {
                  userIds = [...userIds];
                } else {
                  userIds.push({
                    id: vote.user_id,
                    name: userData.name,
                    updated_at: vote.updated_at,
                  });
                }
              }
            }
          }
        }else{
          item = [...item, 0]
        }
        item = [...item, counter];
        item = [...item, userIds];
        return item;
      })
    );
    setVotedTable(result);
  };

  useEffect(() => {
    const getData = async() => {
       await checkIsVoted();
       await fetchTotalVotes(room.session_id, poll.id)
    }
    getData();
  }, []);

  useEffect(() => {
    const getData = async() => {
        await checkIsVoted();
        await fetchTotalVotes(room.session_id, poll.id);
    }
    getData();
  }, [value]);

  useEffect(() => {
    async function getTable() {
      await getVotedTable();
    }
    getTable();
  }, [value, votes]);

  useEffect(()=>{
    if(messageId === poll.id){
      setVotes([...newVotes])
    }
  },[newVotes])

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(open);
  };

  useEffect(() => {
    if (votedTable?.length > 0) {
      const votesForOptions = votedTable.map((vote) => vote[2]);

      const temp = getMaxInArray([...votesForOptions]);
      setMaxVotes(temp);
    }
  }, [votedTable]);

  const drawerContent = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <PollResult
        toggleDrawer={toggleDrawer}
        poll={poll}
        votes={votes}
        votedTable={votedTable}
        maxVotes={maxVotes}
      />
    </div>
  );

  return (
    <Box className={classes.root}>
      <Typography variant="h5" className={classes.username}>
        {username}
      </Typography>
      <Typography variant="h5" className={classes.ques}>
        {poll.content}
      </Typography>
      <Box className={classes.instruction}>
        <CheckCircleIcon style={{ fontSize: "0.8rem", color: color.whiteLight }} />
        <Typography
          style={{
            fontSize: "0.7rem",
            color: color.whiteLight,
            marginLeft: "0.4rem",
          }}
        >
          Select one
        </Typography>
      </Box>
      <Box mb={2}>
        <RadioVote
          poll={poll}
          isVoted={isVoted}
          value={value}
          votes={votes}
          votedTable={votedTable}
          handleChange={handleChange}
          maxVotes={maxVotes}
        />
      </Box>
      <Divider style={{background: color.whitePointOne}} />
      <Box sx={{ textAlign: "center" }}>
        <Button
          className={classes.button}
          onClick={toggleDrawer(true)}
          disableRipple
          //disabled={votes?.length<1}
        >
          View votes
        </Button>
      </Box>
      <DrawerBoard
        toggleDrawer={toggleDrawer}
        open={open}
        content={drawerContent}
      />
    </Box>
  );
};

export default VotePoll;
