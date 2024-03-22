import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import mapboxgl from "mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import useTicketGeocode from "../custom-hooks/useTicketGeocode";
import { polygon, point, booleanPointInPolygon } from "@turf/turf";
import { assignTechnicianToTickets } from "../../store/store-slice/ticketDataSlice";
import { assignMultipleTicketsToTechnician } from "../../store/store-slice/technicianDataSlice";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SelectTickets = () => {
  const mapContainer = useRef();
  const mapOptions = useSelector((state) => state.mapOptions);
  const customerAddressData = useSelector((state) => state.customerAddressData);
  const ticketData = useSelector((state) => state.ticketData);
  const [unassignedTicketData, setUnassignedTicketData] = useState({
    tickets: [],
  });
  const { ticketgeocodes, ticketIds } = useTicketGeocode(
    unassignedTicketData,
    customerAddressData
  );
  const technicianGeocodes = useSelector(
    (state) => state.technicianData.technicianGeocodes
  );
  const [selectedTechnician, setSelectedTechnician] = useState("one");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const filteredTicekts = ticketData.tickets.filter(
      (ticket) => ticket.selected === false
    );
    setUnassignedTicketData({ tickets: filteredTicekts });
  }, [ticketData]);

  // useEffect(() => {
  //   console.log(unassignedTicketData);
  // }, [unassignedTicketData]);

  useEffect(() => {
    let minLat = technicianGeocodes[selectedTechnician][1];
    let maxLat = technicianGeocodes[selectedTechnician][1];
    let minLong = technicianGeocodes[selectedTechnician][0];
    let maxLong = technicianGeocodes[selectedTechnician][0];

    for (const geocode of ticketgeocodes) {
      minLat = Math.min(minLat, geocode[0]);
      maxLat = Math.max(maxLat, geocode[0]);
      minLong = Math.min(minLong, geocode[1]);
      maxLong = Math.max(maxLong, geocode[1]);
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: mapOptions.center,
      zoom: 6,
    });

    const popup = new mapboxgl.Popup({ offset: 25 }).setText(
      `Technician: ${selectedTechnician}`
    );
    const marker = new mapboxgl.Marker()
      .setLngLat(technicianGeocodes[selectedTechnician])
      .setPopup(popup)
      .addTo(map);
    const markerDiv = marker.getElement();
    markerDiv.addEventListener("mouseenter", () => marker.togglePopup());
    markerDiv.addEventListener("mouseleave", () => marker.togglePopup());
    console.log(ticketgeocodes);
    ticketgeocodes.map((geocode, i) => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setText(
        `Job Description: ${unassignedTicketData.tickets[i].jobDescription}`
      );
      const marker = new mapboxgl.Marker({
        color: "black",
      })
        .setLngLat([geocode[1], geocode[0]])
        .setPopup(popup)
        .addTo(map);
      const markerDiv = marker.getElement();
      markerDiv.addEventListener("mouseenter", () => marker.togglePopup());
      markerDiv.addEventListener("mouseleave", () => marker.togglePopup());
      return marker;
    });

    if (ticketgeocodes.length > 0) {
      map.fitBounds([
        [minLong - 0.5, minLat - 0.5],
        [maxLong + 0.5, maxLat + 0.5],
      ]);
    }

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true,
        trash: true,
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      defaultMode: "draw_polygon",
    });
    map.addControl(draw);

    map.on("draw.create", polygonChange);
    // map.on("draw.delete", polygonChange);
    map.on("draw.update", polygonChange);

    function polygonChange() {
      const data = draw.getAll();
      // console.log(data.features[0].geometry.coordinates);
      const poly = polygon(data.features[0].geometry.coordinates);
      const assignedTicketIds = [];
      ticketgeocodes.forEach((geocode, i) => {
        const pt = point([geocode[1], geocode[0]]);
        if (booleanPointInPolygon(pt, poly))
          assignedTicketIds.push(ticketIds[i]);
      });
      if (assignedTicketIds.length > 0) {
        dispatch(
          assignTechnicianToTickets({
            assignedTicketIds,
            technician: selectedTechnician,
          })
        );
        dispatch(
          assignMultipleTicketsToTechnician({
            assignedTicketIds,
            technician: selectedTechnician,
          })
        );
      }
    }
  }, [ticketgeocodes]);
  return (
    <div className="d-flex flex-column px-5 py-5">
      <div className="mb-3 w-25">
        <Form.Select
          onChange={(e) => {
            if (e.target.value !== "null")
              setSelectedTechnician(e.target.value);
            else setSelectedTechnician(null);
          }}>
          <option value="one">Technician 1</option>
          <option value="two">Technician 2</option>
          <option value="three">Technician 3</option>
        </Form.Select>
      </div>
      <div
        className="align-self-center w-100 mb-3"
        ref={mapContainer}
        style={{ height: "80vh" }}
      />
      <div className="align-self-center">
        <Button
          onClick={() => {
            navigate("/route");
          }}
          className="mx-2">
          Get optimal route
        </Button>
      </div>
    </div>
  );
};

export default SelectTickets;
