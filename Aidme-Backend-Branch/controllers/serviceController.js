const httpStatus = require("http-status");
const Categories = require("../models/categoryModel");
const countries = require("../services/countries-service.json")
const axios = require('axios');
let serviceController = {}


serviceController.getCountries = function(req,res,next) {
    const params = req.query;
    
    if(!Object.keys(params).length) {
        const countryRes = countries.map(({name, flag, iso3}) => {return {name, flag, iso3} });
        res.json(countryRes)
    }

    if(Object.keys(params).length && params.countrycode){
        // this return states
        for(let i = 0; i < countries.length; ++i) {
            if(countries[i]["iso3"].toLowerCase() === params.countrycode.toLowerCase()){
               return res.json(countries[i]["states"])
            }
        }
    }
}


serviceController.getTaskCategories = async function(req,res,next) {
    try {
        const getCategories = await Categories.find({});
        res.send(getCategories[0]?.erranderJobs); 
    } catch (error) {
        console.log(error)
        res.status(httpStatus.BAD_REQUEST).send(error)
    }
}

serviceController.getCitiesCategory = async function(req,res,next) {
    try {
        const params = req.body;
        console.log(params)
        const { state, country } = params;
        const response = await axios.get('http://api.geonames.org/searchJSON', {
      params: {
        q: state,
        country: country,
        maxRows: 10,
        username: 'fordsxx',
      },
    });
    const cities = response.data.geonames.map((city) => city.name);
    res.status(httpStatus.OK).send(cities);
    
    }
    catch (error) {
        console.log(error)
        res.status(httpStatus.BAD_REQUEST).send(error)
    }
}

serviceController.getAddress = async function(req,res,next) {
   // try {
        //const response = await axios.get('https://nominatim.openstreetmap.org/search', {
         // params: {
           // q: query,
            //format: 'json',
            //limit: 1,
          //},
        //});
    
   //     const { lat, lon, display_name } = response.data[0];
     //   console.log(`Found place: ${display_name}, Coordinates: ${lat}, ${lon}`);
   //   } catch (error) {
    //    console.error(error);
    //  }
    console.log("hello")
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
         // q: `${state}, ${country}`,
          q: `rivers state, nigeria`,
          format: 'json',
          limit: 1,
        },
      });
  
      const { lat, lon } = response.data[0];
  
      const cityResponse = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat,
          lon,
          format: 'json',
          zoom: 10,
        },
      });
  
      const { address } = cityResponse.data;
  
      return address.city;
    } catch (error) {
      console.error(error);
    }
}


module.exports = serviceController
