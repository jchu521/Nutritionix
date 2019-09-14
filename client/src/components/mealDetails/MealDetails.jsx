import React, { useEffect, useState } from "react";
import { useStateValue } from "../../mockData/index";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "90vh",
    overflowY: "scroll",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down("xs")]: {
      maxHeight: 375,
      overflowY: "scroll"
    }
  },
  inline: {
    display: "inline"
  },
  capitalize: {
    textTransform: "capitalize"
  }
}));

export default function MealDetails() {
  const [{ user }] = useStateValue();
  const [mealDetails, setMealDetails] = useState();
  const classes = useStyles();

  useEffect(() => {
    const details = user.data_points.filter(
      item => item.date === user.selectDate
    );
    setMealDetails(details[0]);
  }, [user]);

  return (
    <List className={classes.root}>
      {mealDetails &&
        mealDetails.intake_list.map(list => (
          <React.Fragment key={list.food_name}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={list.food_name} src={list.thumb} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Grid container justify="space-between">
                    <Grid item>
                      <div style={{ fontWeight: "bold" }}>{list.food_name}</div>
                    </Grid>
                    <Grid item>
                      <div style={{ fontWeight: "bold" }}>
                        {Math.round(list.serving_size * list.nf_calories)} cal
                      </div>
                    </Grid>
                  </Grid>
                }
                secondary={
                  <Grid container justify="space-between">
                    <Grid item>
                      {list.serving_size} {list.serving_unit} (
                      {Math.round(
                        list.serving_size * list.serving_weight_grams
                      )}{" "}
                      g)
                    </Grid>
                    <Grid item>
                      <div className={classes.capitalize}>{list.meal_type}</div>
                    </Grid>
                  </Grid>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
    </List>
  );
}
