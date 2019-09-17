import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import LeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import RightIcon from "@material-ui/icons/KeyboardArrowRight";
import Grid from "@material-ui/core/Grid";

import { IconButton } from "@material-ui/core";
import { useStateValue } from "../../mockData/index";

const useStyles = makeStyles(theme => ({
  iconButton: {
    color: "white",
    [theme.breakpoints.down("xs")]: {
      color: "#6403ee"
    }
  },
  dateContainer: {
    padding: "0px 34px 16px 34px",
    [theme.breakpoints.down("sm")]: {
      padding: "8px 12px"
    }
  },
  dateText: {
    textAlign: "center",
    width: 320,
    [theme.breakpoints.down("sm")]: {
      fontSize: 26,
      margin: "auto",
      width: "auto"
    }
  }
}));

export default function SelectDate() {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  const [dateIndex, setDateIndex] = useState(
    user.data_points.findIndex(item => item.date === user.selectDate)
  );

  const handleChangeDate = value => {
    if (value > 0) {
      if (dateIndex !== user.data_points.length - 1) {
        setDateIndex(dateIndex + value);
        dispatch({
          type: "updateSelectDate",
          payload: user.data_points[dateIndex + value].date
        });
      }
    } else {
      if (dateIndex !== 0) {
        setDateIndex(dateIndex + value);
        dispatch({
          type: "updateSelectDate",
          payload: user.data_points[dateIndex + value].date
        });
      }
    }
  };

  return (
    <Grid container justify="space-evenly">
      <Grid item xs={12} sm={6}>
        <Grid
          container
          justify="space-evenly"
          alignItems="center"
          className={classes.dateContainer}
        >
          <IconButton
            className={classes.iconButton}
            onClick={() => handleChangeDate(1)}
          >
            <LeftIcon />
          </IconButton>
          <Typography variant="h4" className={classes.dateText}>
            {user.data_points[dateIndex].date}
          </Typography>
          <IconButton
            size="medium"
            className={classes.iconButton}
            onClick={() => handleChangeDate(-1)}
          >
            <RightIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
}
