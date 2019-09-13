import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import { useStateValue } from "../../mockData/index";

const useStyles = makeStyles(theme => ({}));

export default function UserBasicInfo({ children, style, justify }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();

  return (
    <Grid container style={style} justify={justify} alignItems="center">
      {children}
    </Grid>
  );
}
