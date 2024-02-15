const useTechnicianToVisitGeocodes = (
  technician,
  ticketData,
  customerAddressData,
  techicianData
) => {
  //retrive all the geocodes of assigned ticket or customer for a specefic technician
  // console.log(techicianData.technicianGeocodes, technician);
  let technicianToVisitGeocodes = [
    [
      techicianData.technicianGeocodes[technician][1],
      techicianData.technicianGeocodes[technician][0],
    ],
  ];
  let technicianTickets = ticketData.tickets.filter(
    (ticket) => ticket.technician === technician
  );
  let destinationDetails = technicianTickets.map(
    (ticket, i) => `Ticket Id-${ticket.id} : ${ticket.jobDescription}`
  );

  let technicianTicketsCustomerId = technicianTickets.map(
    (ticket) => ticket.customerId
  );
  //   let ticketgeocodes = [];
  for (const addressDetail of customerAddressData.addressDetails) {
    if (technicianTicketsCustomerId.includes(addressDetail.customerId))
      technicianToVisitGeocodes.push(addressDetail.geocode);
  }
  // console.log(technicianToVisitGeocodes);
  return { technicianToVisitGeocodes, destinationDetails };
};

export default useTechnicianToVisitGeocodes;
