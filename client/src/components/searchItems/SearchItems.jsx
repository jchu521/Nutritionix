import React from "react";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(theme => ({
  title: {
    textTransform: "uppercase"
  }
}));

export default function ResultItems({ title, foods, maxDisplay, onClick }) {
  const classes = useStyles();

  return (
    <List
      component="nav"
      subheader={
        <ListSubheader className={classes.title} component="div">
          {title}
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
                    primary={item.food_name}
                    secondary={item.brand_name}
                  />
                </ListItem>
                {i < maxDisplay - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            );
          }
        })
      ) : (
        <ListItem alignItems="flex-start">No Results Match</ListItem>
      )}
    </List>
  );
}
