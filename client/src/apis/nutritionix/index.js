import axios from "axios";

axios.defaults.headers.common["x-app-id"] = "b2fbadea";
axios.defaults.headers.common["x-app-key"] = "c580df96b4a2569239d5f0109e8fd514";

const url = "https://trackapi.nutritionix.com";

//Search foods
// GET /v2/search/instant

export const searchFoods = query => {
  return axios
    .get(`${url}/v2/search/instant?query=${query}`)
    .then(res => {
      if (res.status === 200) return res.data;
    })
    .catch(err => {
      if (err.response.status !== 200)
        return `${err.response.status}: ${err.response.data.message}`;
    });
};

//GET common food details
//POST /v2/natural/nutrients (Common Food)
export const getCommonFoodDetails = query => {
  return axios
    .post(`${url}/v2/natural/nutrients`, {
      query
    })
    .then(res => {
      if (res.status === 200) return res.data;
    })
    .catch(err => {
      if (err.response.status !== 200)
        return `${err.response.status}: ${err.response.data.message}`;
    });
};

//GET /v2/search/item https://trackapi.nutritionix.com/v2/search/item
export const getBrandedFoodDetails = id => {
  return axios
    .get(`${url}/v2/search/item?nix_item_id=${id}`)
    .then(res => {
      if (res.status === 200) return res.data;
    })
    .catch(err => {
      if (err.response.status !== 200)
        return `${err.response.status}: ${err.response.data.message}`;
    });
};
