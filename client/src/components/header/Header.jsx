import React, { useState, useRef, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import LeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import RightIcon from "@material-ui/icons/KeyboardArrowRight";
import Grid from "@material-ui/core/Grid";
import _ from "lodash";

import SearchItems from "../searchItems/SearchItems";
import Modal from "../modal/Modal";
import {
  searchFoods,
  getCommonFoodDetails,
  getBrandedFoodDetails
} from "../../apis/nutritionix";
import { IconButton } from "@material-ui/core";
import { useStateValue } from "../../mockData/index";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%"
  },
  iconButton: {
    color: "white"
  },
  dateText: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
      margin: "auto"
    }
  }
}));

export default function Header() {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = useState("");
  const [foods, setFoods] = useState(null);
  const [food, setFood] = useState(null);
  const [dateIndex, setDateIndex] = useState(0);

  const searchItemRef = useRef(null);

  const handleClickOutside = e => {
    if (searchItemRef.current && !searchItemRef.current.contains(e.target)) {
      setFoods(null);
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const getSearchResult = async q => {
    if (q.length <= 1) {
      setFoods(null);
    } else {
      try {
        const result = await searchFoods(q);
        if (result && result.common && result.branded) {
          setFoods(result);
        } else {
          console.log(result);
        }
      } catch (err) {
        setFoods(null);
        console.error("Failed to get foods");
      }
    }
  };

  const delayedQuery = useRef(_.debounce(q => getSearchResult(q), 500)).current;

  const handleSearchInput = e => {
    const { value } = e.target;
    const newValue = value.replace("&", "");
    setSearchText(newValue);

    //https://medium.com/@rajeshnaroth/using-throttle-and-debounce-in-a-react-function-component-5489fc3461b3
    delayedQuery(newValue);
  };

  const handleGetCommonFood = async query => {
    try {
      const result = await getCommonFoodDetails(query);
      if (result && result.foods) {
        setFood(result.foods);
        setOpen(true);
      } else {
        console.log(result);
      }
    } catch (err) {
      setFoods(null);

      console.error("Failed to get foods");
    }
  };

  const handleGetBrandedFood = async id => {
    try {
      const result = await getBrandedFoodDetails(id);
      if (result && result.foods) {
        setFood(result.foods);
        setOpen(true);
      } else {
        console.log(result);
      }
    } catch (err) {
      setFoods(null);

      console.error("Failed to get foods");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeDate = value => {
    if (value > 0) {
      if (dateIndex !== user.data_points.length - 1) {
        setDateIndex(dateIndex + value);
        dispatch({
          type: "updateSelectDate",
          payload: user.data_points[dateIndex + value].date
        });
      }
    } else {
      if (dateIndex !== 0) {
        setDateIndex(dateIndex + value);
        dispatch({
          type: "updateSelectDate",
          payload: user.data_points[dateIndex + value].date
        });
      }
    }
  };
  return (
    <AppBar position="static">
      <Modal open={open} food={food} onClose={handleClose} />
      <Toolbar>
        <Typography className={classes.title} variant="h6">
          Nutritionix
        </Typography>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            inputProps={{ "aria-label": "search" }}
            value={searchText}
            onChange={handleSearchInput}
          />
          {foods ? (
            <Paper
              ref={searchItemRef}
              style={{
                width: "100%",
                position: "absolute",
                marginTop: 10,
                zIndex: 999
              }}>
              <SearchItems
                foods={foods.common}
                onClick={handleGetCommonFood}
                maxDisplay="5"
                title="common"
              />
              <Divider />
              <SearchItems
                foods={foods.branded}
                onClick={handleGetBrandedFood}
                maxDisplay="5"
                title="branded"
                subText={true}
              />
            </Paper>
          ) : (
            ""
          )}
        </div>
      </Toolbar>
      <Toolbar>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={4}></Grid>
          <Grid
            item
            xs={4}
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "space-between"
            }}>
            <IconButton
              className={classes.iconButton}
              onClick={() => handleChangeDate(1)}>
              <LeftIcon />
            </IconButton>
            <Typography variant="h4" className={classes.dateText}>
              {user.data_points[dateIndex].date}
            </Typography>
            <IconButton
              size="medium"
              className={classes.iconButton}
              onClick={() => handleChangeDate(-1)}>
              <RightIcon />
            </IconButton>
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
