import { Tooltip } from '@material-ui/core';
import React from 'react'
import { withStyles } from "@material-ui/core";

const CSSTooltip = withStyles({
    tooltipPlacementBottom: {
      margin: '0px 0'
    },
    tooltipPlacementTop: {
        margin: '0px 0'
      },
  })(Tooltip);

const StyledTooltip = (props) => {
  return (
    <CSSTooltip {...props}>
        {props.children}
    </CSSTooltip>
  )
}

export default StyledTooltip