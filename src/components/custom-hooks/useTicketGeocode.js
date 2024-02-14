const useTicketGeocode = (ticketData, customerAddressData) => {
  let ticketCustomerIds = ticketData.tickets.map((ticket) => ticket.customerId);
  let ticketgeocodes = [];
  for (const addressDetail of customerAddressData.addressDetails) {
    if (ticketCustomerIds.includes(addressDetail.customerId))
      ticketgeocodes.push(addressDetail.geocode);
  }
  return ticketgeocodes;
};

export default useTicketGeocode;
