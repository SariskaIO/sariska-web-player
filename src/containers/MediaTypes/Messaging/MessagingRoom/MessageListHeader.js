import { CardHeader, makeStyles } from '@material-ui/core'
import React from 'react'
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import useColor from '../../../../hooks/useColor';

const MessageListHeader = ({goBack, loading, room, user}) => {
    const color = useColor();
    const useStyles = makeStyles(() => ({
        cardHeader: {
          backgroundColor: `transparent`,
          boxShadow: color.boxShadowHeader,
          zIndex: 9
        },
        arrow: {
          "&:hover": {
            opacity: "0.9",
            cursor: "pointer",
            color: color.primaryLight
          },
        }
      }));
      const classes = useStyles();
  return (
    <CardHeader
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: color.white,
                alignItems: 'center'
              }}
            >
              <ArrowBackIcon onClick={goBack} className={classes.arrow} />
              <div style={{ fontWeight: 900, fontSize: "0.8rem", display: 'flex', flexDirection: 'column' }}>
                <span>room name</span>
                {!loading ? (
                  <span style={{ color: color.primaryLight }}>
                    {room?.session_id}
                  </span>
                ) : null}
              </div>
              <div style={{ fontWeight: 900, fontSize: "0.8rem", display: 'flex', flexDirection: 'column' }}>
                <span> user</span>
                {!loading ? (
                  <span style={{ color: color.primaryLight }}>
                    {user?.name}
                  </span>
                ) : null}
              </div>
            </div>
          }
          className={classes.cardHeader}
        />
  )
}

export default MessageListHeader