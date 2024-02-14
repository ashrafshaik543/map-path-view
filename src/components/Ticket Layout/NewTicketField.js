import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { setRouteDirections } from "../../store/store-actions/ticketActions";

const NewTicketField = () => {
  //setting state of form data
  const [customerNameValue, setCustomerNameValue] = useState("");
  const [customerNameInputValue, setCustomerNameInputValue] = useState("");
  const [jobDescriptionValue, setJobDescriptionValue] = useState("");
  const [customerId, setCustomerId] = useState(-1);
  const customerData = useSelector((state) => state.customerData);
  const [customerNameOptions, setCustomerNameOptions] = useState([]);
  //form validation
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    //updating list of customers on load
    let customerNames = [];
    for (const customer of customerData.customers) {
      customerNames.push(customer.name);
    }
    setCustomerNameOptions(customerNames);
  }, [customerData]);

  const resetFields = () => {
    //resetting form inputs after submitting
    setJobDescriptionValue("");
    setCustomerNameInputValue("");
    setCustomerNameValue("");
  };

  return (
    <Form
      className="px-5 w-50 align-self-center"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!customerNameValue || !jobDescriptionValue)
          setError("Enter all the details!");
        else {
          //adding ticket to redux store
          dispatch(
            setRouteDirections(
              {
                jobDescription: jobDescriptionValue,
                customerId,
                selected: false,
              },
              "add"
            )
          );
          setError("");
          resetFields();
        }
      }}>
      <Form.Group className="my-3" controlId="customer-name">
        <Form.Label>Job Description</Form.Label>
        <Form.Control
          autoComplete="off"
          value={jobDescriptionValue}
          onChange={(e) => {
            setJobDescriptionValue(e.target.value);
          }}
          as="textarea"
          placeholder="Enter job details "
          rows={3}
        />
      </Form.Group>
      <Form.Group className="my-3">
        <Autocomplete
          className="align-self-center h-25"
          value={customerNameValue}
          id="combo-box-demo"
          inputValue={customerNameInputValue}
          onInputChange={async (e, newInputValue) => {
            setCustomerNameInputValue(newInputValue);
          }}
          onChange={async (e, newValue) => {
            setCustomerNameValue(newValue);
            //retrieving customer id after selecting the customer
            let index = customerData.customers.findIndex(
              (element) => element.name === newValue
            );

            setCustomerId(index);
          }}
          options={customerNameOptions}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Search for existing customer" />
          )}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
      {error && <p className="text-danger">{error}</p>}
    </Form>
  );
};

export default NewTicketField;
