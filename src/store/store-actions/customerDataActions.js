import { updateCustomersArray } from "../store-slice/customerDataSlice";
import { updateAddressDetailsArray } from "../store-slice/customerAddressDataSlice";

export const setCustomerData = (customerNames, customerAddresses) => {
  return async (dispatch) => {
    const getGeocode = async (address) => {
      //retieving geocode data from address value through mapbox API
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?proximity=ip&access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg`
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
