import React, { useState, useRef, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

import _ from "lodash";

import SearchItems from "../searchItems/SearchItems";
import Modal from "../modal/Modal";
import {
  searchFoods,
  getCommonFoodDetails,
  getBrandedFoodDetails
} from "../../apis/nutritionix";
import { Hidden } from "@material-ui/core";
import { useStateValue } from "../../mockData/index";
import Divider from "@material-ui/core/Divider";
import SelectDate from "../selectDate/SelectDate";
import UserBasicInfo from "../userBasicInfo/UserBasicInfo";
import Avatar from "@material-ui/core/Avatar";
import Photo from "../../static/Jonathan_Chueh.jpg";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: "#6200ee"
  },
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
    backgroundColor: "white",
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    width: "100%",
    height: 48,
    textAlign: "center",
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
    height: "100%",
    color: "black",
    width: 352
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    color: "black",
    transition: theme.transitions.create("width"),
    width: "100%",
    "&::placeholder": {
      fontWeight: "bold",
      color: "black"
    }
  },
  iconButton: {
    color: "white"
  },
  dateText: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
      margin: "auto"
    }
  },
  avatar: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    width: 56,
    height: 56,
    backgroundColor: "#300076",
    margin: 4
  },
  avatarText: {
    fontSize: 12
  }
}));

export default function Header() {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = useState("");
  const [foods, setFoods] = useState(null);
  const [food, setFood] = useState(null);

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

  return (
    <AppBar position="static" className={classes.appBar}>
      <Modal open={open} food={food} onClose={handleClose} />
      <Toolbar>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={5}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon color="action" />
              </div>
              <InputBase
                placeholder="Search foods..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                inputProps={{
                  "aria-label": "Search foods..."
                }}
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
          </Grid>
        </Grid>
      </Toolbar>
      <Hidden xsDown>
        <SelectDate />
      </Hidden>
      <Hidden smUp>
        <UserBasicInfo style={{ padding: 12 }} justify="space-between">
          <Grid item sm={8}>
            <Grid container justify="flex-start" alignItems="center">
              <Avatar className={classes.avatar} src={Photo} />
              <Typography style={{ paddingLeft: 10 }} variant="h6">
                {user.first_name}
              </Typography>
            </Grid>
          </Grid>
          <Grid item sm={4}>
            <Grid container alignItems="flex-end">
              <Avatar className={classes.avatar}>
                <span>{user.weight_kg}</span>
                <span className={classes.avatarText}>kg</span>
              </Avatar>
              <Avatar className={classes.avatar}>
                <span>{user.height_cm}</span>
                <span className={classes.avatarText}>cm</span>
              </Avatar>
            </Grid>
          </Grid>
        </UserBasicInfo>
      </Hidden>
    </AppBar>
  );
}
