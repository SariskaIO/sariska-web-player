import { Box, FormControl, FormControlLabel, Radio, RadioGroup, makeStyles } from '@material-ui/core'
import React from 'react'
import ProgressBar from '../../../../../../components/ProgressBar';
import classNames from 'classnames';
import useColor from '../../../../../../hooks/useColor';

  function StyledRadio(props) {
    const color = useColor();
    const useStyles = makeStyles({
      root: {
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
      icon: {
        borderRadius: '50%',
        width: 16,
        height: 16,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: '#f5f8fa',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '$root.Mui-focusVisible &': {
          outline: `2px auto ${color.pricing}`,
          outlineOffset: 2,
        },
        'input:hover ~ &': {
          backgroundColor: '#ebf1f5',
        },
        'input:disabled ~ &': {
          boxShadow: 'none',
          background: 'rgba(206,217,224,.5)',
        },
      },
      checkedIcon: {
        backgroundColor: color.primaryLight,
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
          display: 'block',
          width: 16,
          height: 16,
          backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
          content: '""',
        },
        'input:hover ~ &': {
          backgroundColor: color.primaryLight,
        },
      },
    });
    const classes = useStyles();
  
    return (
      <Radio
        className={classes.root}
        disableRipple
        color="default"
        checkedIcon={<span className={classNames(classes.icon, classes.checkedIcon)} />}
        icon={<span className={classes.icon} />}
        {...props}
      />
    );
  }

const RadioVote = ({votedTable, isVoted, value, votes, handleChange, maxVotes}) => {
  const color = useColor();
  const useStyles = makeStyles({
    fieldset: {
        width: '100%',
    },
    radioGroup: {
        '& .MuiFormControlLabel-root': {
            width: '100%',
            marginBottom: '16px'
        },
        '& .MuiTypography-root.MuiFormControlLabel-label': {
            fontSize: '0.8rem',
            width: '100%'
        }
    }
  });
  const classes = useStyles();
    const getLabel =(label, counter)=> (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', color: color.white}}>
                <span>{label} &nbsp;</span>
                <span style={{color: color.pricing}}> {counter}</span>
            </Box>
            <Box>
                <ProgressBar max={maxVotes===0 ? 1 : maxVotes} counter={counter} />
            </Box>
        </Box>
    )
    
    return (
      <FormControl component="fieldset" className={classes.fieldset}>
        <RadioGroup aria-label="pollCounter" name="pollCounter" value={value} onChange={handleChange} className={classes.radioGroup}>
          {
            votedTable?.map(item => (
                <FormControlLabel 
                    key={item[0]} 
                    value={item[0]} 
                    control={<StyledRadio />} 
                    label={getLabel(item[1], item[2])} 
                    checked={isVoted.status && isVoted?.answer === parseInt(item[0])}
                />
                ))
          }
        </RadioGroup>
      </FormControl>
    );
}

export default RadioVote