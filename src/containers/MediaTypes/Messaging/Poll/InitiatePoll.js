import { Box, Button, TextField, makeStyles } from "@material-ui/core";
import React from "react";
import useColor from "../../../../hooks/useColor";

const InitiatePoll = ({ poll, setPoll, handleChange }) => {
  const color = useColor();

const useStyles = makeStyles((theme) => ({
  question: {
    margin: theme.spacing(1),
    marginBottom: theme.spacing(3),
    '& .MuiFormLabel-root': {
      color: color.primaryLight,
    },
    '& .MuiInputBase-input': {
      color: color.white,
    },
    '& .MuiInput-underline:before': {
      borderBottom: `1px solid ${color.primaryLight}`
    }
  },
  margin: {
    color: color.white,
    margin: theme.spacing(2, 1),
    "& .MuiInputLabel-outlined": {
      color: color.white,
      transform: "translate(14px, 10px) scale(1)",
      "&.MuiInputLabel-shrink": {
        transform: "translate(14px, -6px) scale(0.8)",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "10px 14px",
      fontSize: "0.9rem",
      color: color.whiteLight,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor : color.primaryLight
    }
  },
  optMargin: {
    margin: theme.spacing(0, 1, 2, 1),
    width: "97.2%",
    "& .MuiInputLabel-outlined": {
      color: color.white,
      transform: "translate(14px, 10px) scale(1)",
      "&.MuiInputLabel-shrink": {
        transform: "translate(14px, -6px) scale(0.8)",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "10px 14px",
      fontSize: "0.9rem",
      color: color.whiteLight,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor : color.primaryLight
    }
  },
  add: {
    textTransform: "initial",
    color: color.primaryLight,
    width: "fit-content",
    borderColor: color.primaryLight,
  },
  remove: {
    textTransform: "initial",
    color: color.primaryLight,
    fontWeight: "700",
    padding: 0,
  },
}));
  const classes = useStyles();

  const handleRemoveOption = (item) => {
    setPoll((poll) => ({
      ...poll,
      options: poll.options.filter((opt) => poll.options.indexOf(opt) !== item - 1),
    }));
  };

  const handleAddOption = (e) => {
    e.preventDefault();
    if (!poll.options[0]) {
      setPoll((poll) => ({
        ...poll,
        error: `option 1 can't be kept blank`,
      }));
      return;
    }
    if (!poll.options[1]) {
      setPoll((poll) => ({
        ...poll,
        error: `option 2 can't be kept blank`,
      }));
      return;
    }
    if (poll.options.length > 2) {
      poll.options.map((item, index) => {
        if (!poll.options[index]) {
          setPoll((poll) => ({
            ...poll,
            error: `option ${index + 1} can't be kept blank`,
          }));
        }
        return null;
      });
    }
    
    if (poll.options.length > 0) {

      setPoll((poll) => ({
        ...poll,
        options: [...poll.options, ''],
      }));
    }
  };
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column"}}>
      <TextField
        className={classes.question}
        label="Your question*"
        name="question"
        value={poll.question}
        onChange={(e) => handleChange(e, null, e.target.value)}
        multiline
      />
      <TextField
        className={classes.margin}
        variant="outlined"
        label="Option 1*"
        name="opt1"
        value={poll.options[0]}
        onChange={(e) => handleChange(e, 0, e.target.value)}
        style={{ marginBottom: "24px" }}
      />

      <TextField
        className={classes.margin}
        variant="outlined"
        label="Option 2*"
        name="opt2"
        value={poll.options[1]}
        onChange={(e) => handleChange(e, 1, e.target.value)}
      />
      {poll.options.map((item, index) => {
        if (index === 0 || index === 1) {
          return null;
        } else
          return (
            <Box>
              <Box sx={{ textAlign: "end", pr: 1 }}>
                <Button
                  className={classes.remove}
                  onClick={() => handleRemoveOption(index + 1)}
                >
                  {" "}
                  - Remove
                </Button>
              </Box>
              <TextField
                className={classes.optMargin}
                variant="outlined"
                label={`Option ${index + 1} *`}
                name={`opt${index + 1}`}
                value={item || ''}
                onChange={(e) => handleChange(e, index, e.target.value)}
                key={index}
              />
            </Box>
          );
      })}
      {/* <TextField
        className={classes.margin}
        variant='outlined'
        label="Option 4"
        name="opt4"
        value={poll.opt4}
        onChange={handleChange}
      /> */}
      <Box pl={1} mt={2}>
        <Button
          onClick={handleAddOption}
          variant="outlined"
          className={classes.add}
        >
          {" "}
          + Add Option{" "}
        </Button>
      </Box>
    </Box>
  );
};

export default InitiatePoll;
