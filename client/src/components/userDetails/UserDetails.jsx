import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";

import { useStateValue } from "../../mockData/index";
import Typography from "@material-ui/core/Typography";

import UserBasicInfo from "../userBasicInfo/UserBasicInfo";
import SelectDate from "../selectDate/SelectDate";
import { Hidden, Paper } from "@material-ui/core";

import Avatar from "@material-ui/core/Avatar";
import Photo from "../../static/Jonathan_Chueh.jpg";
import DailyCalories from "../dailyCalories/DailyCalories";

const useStyles = makeStyles(theme => ({
  userSection: {
    backgroundColor: "#f5f5f5",
    height: "90vh",
    [theme.breakpoints.down("xs")]: {
      backgroundColor: "white",
      height: "100%",
      borderRadius: 0
    }
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
  }
}));

export default function UserDetails() {
  const classes = useStyles();
  const [{ user }] = useStateValue();

  return (
    <Paper className={classes.userSection}>
      <Grid container>
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
            <Divider style={{ marginTop: 16 }} />
            <DailyCalories />
          </Grid>
        </Hidden>
        <Hidden smUp>
          <Grid item xs={12} style={{}}>
            <SelectDate />
            <DailyCalories />
            <Divider style={{ marginTop: 16 }} />
          </Grid>
        </Hidden>
      </Grid>
    </Paper>
  );
}
