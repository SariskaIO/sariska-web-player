import React from "react";
import { ENTER_FULL_SCREEN_MODE } from "../../constants";
import { useSelector } from "react-redux";
import { Box, Drawer, makeStyles } from "@material-ui/core";
import useColor from "../../hooks/useColor";


export default function DrawerBox({ children, open, onClose, top }) {
  const layout = useSelector(state => state.layout);
  const color = useColor();
  const useStyles = makeStyles((theme) => ({
    drawer: {
      "& .MuiPaper-root.MuiDrawer-paper": {
        overflow: "hidden",
        top: top || "16px",
        bottom: "0px",
        right: "16px",
        borderRadius: "10px",
        height: (layout.mode === ENTER_FULL_SCREEN_MODE) || (window.innerHeight === 823 && window.innerWidth===1524) ? "97%" : "95%",
        width: "360px",
        background: `${color.secondary} !important`,
        [theme.breakpoints.down("md")]: {
          top: '15px',
          //left: 0,
          right: '8px',
          width: '351px'
        }
      },
    },
    list: {
      padding: theme.spacing(3, 3, 3, 3),
      height: "93%",
      overflowY:'auto'
    },
  }));
  const classes = useStyles();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      className={classes.drawer}
    >
      <Box className={classes.list} role="presentation">
        {children}
      </Box>
    </Drawer>
  );
}
