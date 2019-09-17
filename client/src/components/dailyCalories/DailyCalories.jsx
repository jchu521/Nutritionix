import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";

import { useStateValue } from "../../mockData/index";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    padding: "24px 16px 0px 16px",
    [theme.breakpoints.down("xs")]: {
      padding: "0px 16px"
    }
  },
  boldText: {
    fontWeight: "bold"
  },
  percentage: {
    transform: ({ details }) =>
      `translateX(
        ${
          details.dailyPercentage > 90
            ? details.dailyPercentage - 5
            : details.dailyPercentage
        }%
      )`,
    fontSize: 12,
    [theme.breakpoints.down("sm")]: {
      transform: ({ details }) =>
        `translateX(
        ${
          details.dailyPercentage > 90
            ? details.dailyPercentage - 10
            : details.dailyPercentage
        }%
      )`
    }
  },
  caloriesText: {
    fontSize: "1.25rem"
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

export default function DailyCalories() {
  const [details, setDetails] = useState(initialDetails);
  const classes = useStyles({ details });
  const [{ user }] = useStateValue();

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
    <>
      <Grid item xs={12} className={classes.root}>
        <Grid container justify="space-between">
          <Typography className={classes.caloriesText} variant="h6">
            {details.totalCal} cal
          </Typography>
          <Typography className={classes.caloriesText} variant="h5">
            {user.daily_goal} cal
          </Typography>
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
        <div className={classes.percentage}>{details.dailyPercentage} %</div>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={3} style={{ textAlign: "center" }}>
            <Grid container direction="column">
              <Typography variant="h6" className={classes.boldText}>
                {details.breakfastCal}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Breakfast
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={3} style={{ textAlign: "center" }}>
            <Grid container direction="column">
              <Typography variant="h6" className={classes.boldText}>
                {details.lunchCal}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Lunch
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={3} style={{ textAlign: "center" }}>
            <Grid container direction="column">
              <Typography variant="h6" className={classes.boldText}>
                {details.dinnerCal}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Dinner
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={3} style={{ textAlign: "center" }}>
            <Grid container direction="column">
              <Typography variant="h6" className={classes.boldText}>
                {details.snackCal}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Snack
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
