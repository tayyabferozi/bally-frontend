import { useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

const initialState = {
  name: "",
  sheetsNum: "",
  sheetLength: "",
  logWeight: "",
  rollsNum: "",
  rollWeight: "",
};

function AddProduct() {
  const [formState, setFormState] = useState(initialState);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const resetForm = () => {
    setFormState(initialState);
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();

    axios
      .post("/products/", formState)
      .then((res) => {
        toast.success(res.data.msg);
      })
      .catch((err) => {
        if (err?.response?.data?.errors) {
          err?.response?.data?.errors.forEach((el) => {
            toast.error(el);
          });
        } else toast.error("Uh Oh! Something went wrong");
      });
  };

  return (
    <Container fluid className="px-0">
      <Row className="justify-content-center">
        <Col lg={6}>
          <h2 className="text-center mb-4">Add New Product</h2>
          <Form onSubmit={formSubmitHandler}>
            <Form.Group className="mb-3" controlId="prodName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                onChange={inputChangeHandler}
                value={formState.name}
                type="text"
                placeholder="Enter the name of product"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="numSheets">
              <Form.Label>No. of Sheets</Form.Label>
              <Form.Control
                name="sheetsNum"
                onChange={inputChangeHandler}
                value={formState.sheetsNum}
                type="number"
                placeholder="Enter the number of sheets"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="sheetLength">
              <Form.Label>Single Sheet Length (mm)</Form.Label>
              <Form.Control
                name="sheetLength"
                onChange={inputChangeHandler}
                value={formState.sheetLength}
                type="number"
                placeholder="Enter the length of a single sheet"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="logWeight">
              <Form.Label>Weight of The Log</Form.Label>
              <Form.Control
                name="logWeight"
                onChange={inputChangeHandler}
                value={formState.logWeight}
                type="number"
                placeholder="Enter the weight of log"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="rollQuantity">
              <Form.Label>No. of Rolls In A Log</Form.Label>
              <Form.Control
                name="rollsNum"
                onChange={inputChangeHandler}
                value={formState.rollsNum}
                type="number"
                placeholder="Enter the number of rolls in a log"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="rollWeight">
              <Form.Label>Weight of A Roll</Form.Label>
              <Form.Control
                name="rollWeight"
                onChange={inputChangeHandler}
                value={formState.rollWeight}
                type="number"
                placeholder="Enter the weight of a single roll"
              />
            </Form.Group>

            <Button variant="success" type="submit">
              Submit
            </Button>
            <Button className="ms-2" variant="danger" onClick={resetForm}>
              Reset
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default AddProduct;
