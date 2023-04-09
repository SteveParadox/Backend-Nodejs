const axios = require('axios');

const searchPlace = async (query) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 1,
      },
    });

    const { lat, lon, display_name } = response.data[0];
    console.log(`Found place: ${display_name}, Coordinates: ${lat}, ${lon}`);
  } catch (error) {
    console.error(error);
  }
};

searchPlace('London, UK');

// Create start and end addresses
        //  try {
          //const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            //params: {
              //q: `${startAddress.street} ${startAddress.city}`,
              //format: 'json',
              //limit: 1,
           // },
         // });
          //const { display_name } = response.data[0];
          //console.log(`Found place: ${display_name.split(',')[0].trim()},${display_name.split(',')[1].trim()}`);
        //} catch (error) {
          //console.error(error);
        //}