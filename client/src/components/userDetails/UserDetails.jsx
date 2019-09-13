import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";
/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { useStateValue } from "../../mockData/index";
import Typography from "@material-ui/core/Typography";

import UserBasicInfo from "../userBasicInfo/UserBasicInfo";
import SelectDate from "../selectDate/SelectDate";
import { Hidden } from "@material-ui/core";

import Avatar from "@material-ui/core/Avatar";
import Photo from "../../static/Jonathan_Chueh.jpg";

const useStyles = makeStyles(theme => ({
  userSection: {
    backgroundColor: "#f5f5f5",
    height: "100%"
  },
  smallAvatar: {
    backgroundColor: "#7a7a7a",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    width: 56,
    height: 56
  },
  avatarText: {
    fontSize: 12
  },
  name: {
    textAlign: "center",
    paddingTop: 12
  },
  largeAvatar: {
    width: 96,
    height: 96,
    [theme.breakpoints.down("sm")]: {
      width: 100,
      height: 100
    }
  },
  boldText: {
    fontWeight: "bold"
  }
}));

const initialDetails = {
  breakfastCal: 0,
  lunchCal: 0,
  dinnerCal: 0,
  snackCal: 0,
  totalCal: 0,
  dailyPercentage: 0,
  offsetPercentage: 0
};

export default function UserDetails() {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  const [details, setDetails] = useState(initialDetails);

  useEffect(() => {
    const dateDetails = user.data_points.find(
      item => item.date === user.selectDate
    );

    let breakfastCal = 0,
      lunchCal = 0,
      dinnerCal = 0,
      snackCal = 0,
      totalCal = 0;

    if (dateDetails.intake_list.length === 0) {
      setDetails(initialDetails);
    } else {
      dateDetails.intake_list.forEach(item => {
        if (item.meal_type === "breakfast") {
          breakfastCal += Math.round(item.serving_size * item.nf_calories);
          totalCal += breakfastCal;
        } else if (item.meal_type === "lunch") {
          lunchCal += Math.round(item.serving_size * item.nf_calories);
          totalCal += lunchCal;
        } else if (item.meal_type === "dinner") {
          dinnerCal += Math.round(item.serving_size * item.nf_calories);
          totalCal += dinnerCal;
        } else if (item.meal_type === "snack") {
          snackCal += Math.round(item.serving_size * item.nf_calories);
          totalCal += snackCal;
        }

        const newDetails = {
          breakfastCal,
          lunchCal,
          dinnerCal,
          snackCal,
          totalCal,
          dailyPercentage:
            totalCal === 0
              ? 0
              : totalCal > user.daily_goal
              ? 100
              : Math.round((totalCal / user.daily_goal) * 100),
          offsetPercentage:
            Math.round((totalCal / user.daily_goal) * 100) > 90 ? 5 : 0
        };

        setDetails(newDetails);
      });
    }
  }, [user]);

  return (
    <Grid container justify="space-evenly" className={classes.userSection}>
      <Hidden xsDown>
        <Grid item xs={12} style={{ marginTop: 24 }}>
          <UserBasicInfo justify="space-evenly">
            <Avatar className={classes.smallAvatar}>
              <span>{user.weight_kg}</span>
              <span className={classes.avatarText}>kg</span>
            </Avatar>
            <Avatar className={classes.largeAvatar} src={Photo} />
            <Avatar className={classes.smallAvatar}>
              <span>{user.height_cm}</span>
              <span className={classes.avatarText}>cm</span>
            </Avatar>
            <Grid item xs={12} className={classes.name}>
              <Typography variant="h5">
                {user.first_name} {user.last_name}
              </Typography>
            </Grid>
          </UserBasicInfo>
        </Grid>
        <Hidden smUp>
          <SelectDate />
        </Hidden>
        <Grid item xs={12} style={{ paddingTop: 16 }}>
          <Divider />
        </Grid>
      </Hidden>

      <Grid item xs={12} style={{ padding: "24px 16px 0px 16px" }}>
        <Grid container justify="space-between">
          <Typography variant="h5">{details.totalCal} cal</Typography>
          <Typography variant="h5">{user.daily_goal} cal</Typography>
        </Grid>
        <Grid container justify="space-between">
          <Typography color="textSecondary" variant="caption">
            consumed
          </Typography>
          <Typography color="textSecondary" variant="caption">
            daily goal
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ padding: "8px 16px" }}>
        <LinearProgress variant="determinate" value={details.dailyPercentage} />
        <div
          css={css`
            transform: translateX(
              ${details.dailyPercentage - details.offsetPercentage}%
            );
            font-size: 12px;
          `}>
          {details.dailyPercentage} %
        </div>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={3} style={{ textAlign: "center" }}>
            <Grid container direction="column">
              <span className={classes.boldText}>{details.breakfastCal}</span>
              <span>Breakfast</span>
            </Grid>
          </Grid>
          <Grid item xs={3} style={{ textAlign: "center" }}>
            <Grid container direction="column">
              <span className={classes.boldText}>{details.lunchCal}</span>
              <span>Lunch</span>
            </Grid>
          </Grid>
          <Grid item xs={3} style={{ textAlign: "center" }}>
            <Grid container direction="column">
              <span className={classes.boldText}>{details.dinnerCal}</span>
              <span>Dinner</span>
            </Grid>
          </Grid>
          <Grid item xs={3} style={{ textAlign: "center" }}>
            <Grid container direction="column">
              <span className={classes.boldText}>{details.snackCal}</span>
              <span>Snack</span>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
