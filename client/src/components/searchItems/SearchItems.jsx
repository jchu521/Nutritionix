import React from "react";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  title: {
    textTransform: "uppercase",
    float: "left"
  },
  resultText: {
    textTransform: "capitalize",
    fontWeight: "bold"
  }
}));

export default function ResultItems({ title, foods, maxDisplay, onClick }) {
  const classes = useStyles();

  return (
    <List
      component="nav"
      style={{ overflowY: "scroll" }}
      subheader={
        <ListSubheader className={classes.title} component="div">
          <Typography
            variant="caption"
            style={{ fontWeight: "bold", letterSpacing: 2 }}>
            {title}
          </Typography>
        </ListSubheader>
      }>
      {foods.length > 0 ? (
        foods.map((item, i) => {
          if (i < maxDisplay) {
            return (
              <React.Fragment key={item.food_name}>
                <ListItem
                  button
                  alignItems="flex-start"
                  onClick={e => onClick(item.nix_item_id || item.food_name)}>
                  <ListItemAvatar>
                    <Avatar
                      src={item.photo && item.photo.thumb}
                      alt={item.food_name}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <div className={classes.resultText}>{item.food_name}</div>
                    }
                    secondary={item.brand_name}
                  />
                </ListItem>
                {i < maxDisplay - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            );
          } else {
            return null;
          }
        })
      ) : (
        <ListItem alignItems="flex-start">No Results Match</ListItem>
      )}
    </List>
  );
}
