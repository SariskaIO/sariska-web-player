import { makeStyles } from '@material-ui/core';
import React from 'react'
import { linkify } from '../../../../utils';
import useColor from '../../../../hooks/useColor';

const MessageItem = ({message}) => {
    const color = useColor();
    const useStyles = makeStyles(()=>({
        link: {
            color: color.link
        },
        text: {
            fontSize: '0.9rem',
            background: color.secondary,
            color: color.white,
            padding: '4px 16px',
            minWidth: '40px',
            borderRadius: '0 6px 6px 6px',
            marginTop: 0,
            marginBottom: 0,
            '& a': {
                color: color.link
            }
        }
    }))
    const classes = useStyles();
    
    return (
            <p 
                className={classes.text}
                dangerouslySetInnerHTML={{__html: linkify(message?.content, {className: classes.link})}}>
            </p>
    );

}

export default MessageItem;
