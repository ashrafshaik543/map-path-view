const useTicketGeocode = (ticketData, customerAddressData) => {
  //retriving all the geocodes of the tickets
  let ticketCustomerIds = ticketData.tickets.map((ticket) => ticket.customerId);
  let ticketgeocodes = [];
  for (const addressDetail of customerAddressData.addressDetails) {
    if (ticketCustomerIds.includes(addressDetail.customerId))
      ticketgeocodes.push(addressDetail.geocode);
  }
  return ticketgeocodes;
};

export default useTicketGeocode;
