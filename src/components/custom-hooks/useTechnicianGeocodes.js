const useTechnicianGeocodes = (
  technician,
  ticketData,
  customerAddressData,
  mapOptions
) => {
  //retrive all the geocodes of assigned ticket or customer for a specefic technician
  let technicianGeocodes = [[mapOptions.center[1], mapOptions.center[0]]];
  let technicianTickets = ticketData.tickets.filter(
    (ticket) => ticket.technician === technician
  );
  let technicianTicketsCustomerId = technicianTickets.map(
    (ticket) => ticket.customerId
  );
  //   let ticketgeocodes = [];
  for (const addressDetail of customerAddressData.addressDetails) {
    if (technicianTicketsCustomerId.includes(addressDetail.customerId))
      technicianGeocodes.push(addressDetail.geocode);
  }
  return technicianGeocodes;
};

export default useTechnicianGeocodes;
