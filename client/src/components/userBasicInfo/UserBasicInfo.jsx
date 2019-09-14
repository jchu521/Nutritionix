import React from "react";
import Grid from "@material-ui/core/Grid";

export default function UserBasicInfo({ children, style, justify }) {
  return (
    <Grid container style={style} justify={justify} alignItems="center">
      {children}
    </Grid>
  );
}
