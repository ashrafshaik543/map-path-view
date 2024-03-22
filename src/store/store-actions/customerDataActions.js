import { updateCustomersArray } from "../store-slice/customerDataSlice";
import { updateAddressDetailsArray } from "../store-slice/customerAddressDataSlice";
//pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg
import { MAP_BOX_KEY } from "../../constants";

export const setCustomerData = () => {
  const customerNames = [
    "John",
    "Abraham",
    "David",
    "Catherine",
    "Melvin",
    "Putin",
    "Joe",
    "Donald",
    "Zack Effron",
    "Gray",
  ];
  const customerAddresses = [
    "The Great Swamp National Wildlife Area, Long Hill Rd., Berkeley Heights, New Jersey 07922, United States",
    "Franklin Township, New Jersey, United States",
    "Susquehanna Manor, Harrisburg, Pennsylvania, United States",
    "Galway Family Health, 5344 Sacandaga Rd, Galway, New York 12074, United States",
    "State University of New York at Fredonia (SUNY Fredonia), 280 Central Ave, Fredonia, New York 14063, United States",
    "Tracy Creek, New York, United States",
    "State Game Lands, Slatington, Pennsylvania 18080, United States",
    "Elk County Catholic High School, 600 Maurus St, Saint Marys, Pennsylvania 15857, United States",
    "Mittineague Elementary School, 26 2nd St, West Springfield, Massachusetts 01089, United States",
    "Bare Hill Pond, Pond Rd., Harvard, Massachusetts 01451, United States",
  ];
  return async (dispatch) => {
    const getGeocode = async (address) => {
      //retieving geocode data from address value through mapbox API
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?proximity=ip&access_token=${MAP_BOX_KEY}`
      );
      const data = await res.json();
      let geocode = [
        data.features[0].geometry.coordinates[1],
        data.features[0].geometry.coordinates[0],
      ];
      return geocode;
    };

    let customerDetailsData = [];
    let customerAddressData = [];

    for (let i = 0; i < customerNames.length; i++) {
      customerDetailsData.push({ id: i, name: customerNames[i] });
      customerAddressData.push({
        customerId: i,
        address: customerAddresses[i],
        geocode: await getGeocode(customerAddresses[i]),
      });
    }
    //setting the customer data
    dispatch(updateCustomersArray({ newCustomers: customerDetailsData }));
    //setting the customer address data
    dispatch(
      updateAddressDetailsArray({ newAddressDetails: customerAddressData })
    );
  };
};
