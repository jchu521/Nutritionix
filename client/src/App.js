import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import Header from "./components/header/Header";
import UserDetails from "./components/userDetails/UserDetails";
import MealDetails from "./components/mealDetails/MealDetails";

import { StateProvider, initialState, reducer } from "./mockData/index";

const useStyles = makeStyles(theme => ({
  root: {},
  body: {
    // height: "100%"
  }
}));

function App() {
  const classes = useStyles();

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <div className={classes.root}>
        <Header />
        <Grid container className={classes.body}>
          <Grid item xs={12} sm={4}>
            <UserDetails />
          </Grid>
          <Grid item xs={12} sm={8}>
            <MealDetails />
          </Grid>
        </Grid>
      </div>
    </StateProvider>
  );
}

export default App;
