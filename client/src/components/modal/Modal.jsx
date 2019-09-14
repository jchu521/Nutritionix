import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useStateValue } from "../../mockData/index";

const useStyles = makeStyles(theme => ({
  paperRoot: {
    width: 304
  },
  avatar: {
    width: 64,
    height: 64,
    [theme.breakpoints.down("sm")]: {
      width: 60,
      height: 60
    }
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  text: {
    textAlign: "center",
    textTransform: "capitalize"
  }
}));

export default function Modal({ food, onClose, open, setSearchText }) {
  const classes = useStyles();
  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);
  const [serve, setServe] = useState(1);
  const [calories, setSCalories] = useState(0);
  const [grams, setGrams] = useState(0);
  const [meal, setMeal] = useState("Breakfast");

  useEffect(() => {
    if (food && food.length === 1) {
      setSCalories(Math.round(food[0].nf_calories));
      setGrams(Math.round(food[0].serving_weight_grams));
      setLoading(false);
    }
  }, [food]);

  const handleChangeMeal = e => {
    const { value } = e.target;
    setMeal(value);
  };
  const handleAdd = () => {
    dispatch({
      type: "addMealItem",
      payload: {
        food_name: food[0].food_name,
        serving_qty: food[0].serving_qty,
        serving_unit: food[0].serving_unit,
        serving_weight_grams: food[0].serving_weight_grams,
        nf_calories: food[0].nf_calories,
        serving_size: serve,
        meal_type: meal.toLowerCase(),
        thumb: food[0].photo.thumb
      }
    });

    setServe(1);
    setMeal("Breakfast");
    setSearchText("");
    onClose();
  };

  const handleServe = e => {
    const { value } = e.target;
    setServe(value);
    setSCalories(Math.round(value * food[0].nf_calories));
    setGrams(Math.round(value * food[0].serving_weight_grams));
  };

  return (
    <Dialog
      classes={{
        paper: classes.paperRoot
      }}
      open={open}
      onClose={() => onClose()}
      fullWidth>
      {!loading ? (
        <>
          <DialogTitle>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => onClose()}>
              <CloseIcon />
            </IconButton>
            <Avatar
              className={classes.avatar}
              src={food[0].photo.thumb}
              alt={food[0].food_name}
            />
            <Typography className={classes.title} variant="h5">
              {food[0].food_name}
            </Typography>
            <Typography className={classes.title} variant="subtitle2">
              {food[0].brand_name}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <TextField
                  label="Servings"
                  className={classes.textField}
                  onChange={handleServe}
                  type="number"
                  margin="normal"
                  variant="outlined"
                  helperText={food[0].serving_unit}
                  inputProps={{
                    min: 1
                  }}
                  value={serve}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.text} variant="h6">
                  <b>{grams}</b>
                </Typography>
                <Typography className={classes.text} variant="subtitle1" noWrap>
                  Grams
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.text} variant="h6">
                  <b>{calories}</b>
                </Typography>
                <Typography className={classes.text} variant="subtitle1" noWrap>
                  Calories
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="ADD TO TODAY"
                  className={classes.textField}
                  onChange={handleChangeMeal}
                  SelectProps={{
                    native: true
                  }}
                  type="text"
                  margin="normal"
                  variant="outlined"
                  value={meal}>
                  {["Breakfast", "Lunch", "Dinner", "Snack"].map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  style={{ float: "right" }}
                  onClick={handleAdd}
                  variant="contained"
                  color="primary"
                  autoFocus>
                  ADD
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </>
      ) : (
        ""
      )}
    </Dialog>
  );
}
