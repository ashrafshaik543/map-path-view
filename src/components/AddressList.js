import { useEffect } from "react";
import { Button } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import { useSelector } from "react-redux";

const AddressList = ({ removeFromAddressList }) => {
  const addressList = useSelector((state) => state.mapData.addresses);
  useEffect(() => {
    // console.log(addressList);
  }, [addressList]);

  return (
    <div className="mb-5 mt-3 w-25">
      <p>
        <b>Address List:</b>
      </p>
      {addressList.length > 0 ? (
        <ListGroup>
          {addressList.map((element, i) => {
            return (
              <ListGroup.Item
                key={i}
                className="d-flex flex-row justify-content-between">
                <p className="d-inline mb-0">{element.address}</p>
                <Button
                  onClick={() => {
                    removeFromAddressList(element.address);
                  }}
                  variant="light">
                  &#10060;
                </Button>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      ) : (
        <p>No addresses entered yet</p>
      )}
    </div>
  );
};

export default AddressList;
