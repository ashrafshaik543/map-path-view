const useTicketGeocode = (ticketData, customerAddressData) => {
  //retriving all the geocodes of the tickets
  if (ticketData.tickets.length === 0)
    return { ticketgeocodes: [], ticketIds: [] };
  let ticketCustomerIds = ticketData.tickets.map((ticket) => ticket.customerId);
  let ticketIds = ticketData.tickets.map((ticket) => ticket.id);
  let ticketgeocodes = [];
  for (const addressDetail of customerAddressData.addressDetails) {
    if (ticketCustomerIds.includes(addressDetail.customerId))
      ticketgeocodes.push(addressDetail.geocode);
  }
  return { ticketgeocodes, ticketIds };
};

export default useTicketGeocode;
