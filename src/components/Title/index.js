import { Box, Typography, makeStyles } from '@material-ui/core'
import React from 'react'
import useColor from '../../hooks/useColor';

const Title = ({title, isDivider}) => {
    const color = useColor();
    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'left',
            marginBottom: '24px'
        },
        title: {
            color: color.primaryLight, 
            textAlign: 'center', 
            marginTop: '24px', 
            marginBottom: '8px',
            paddingBottom: '8px',
           // borderBottom: isDivider ? `1px solid ${color.whitePointOne}` : 'none'
        },
        divider: {
            backgroundColor: color.whitePointOne, 
            width: '400px'
        }
    }))
    const classes = useStyles();
  return (
    <Box className={classes.root}>
            <Typography variant='h4' className={classes.title}>{title}</Typography>
        </Box>
  )
}

export default Title