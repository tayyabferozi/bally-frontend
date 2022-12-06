import { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";

import Chart from "./Chart";

import isEmpty from "../../utils/is-empty";

const initialState = {
  ballWeight: "",
  paperGrams: "",
  pilesNum: "",
  product: "",
  pallet: "",
  ballNum: "",
  batchNum: "",
  actualBags: "",
  actualPalletes: "",
  actualRolls: "",
};

const initialProdState = {
  rollsCount: "",
  rollsCountPrecise: "",
  bagsCount: "",
  bagsCountPrecise: "",
  extraBagsCount: "",
  extraBagsCountPrecise: "",
  euroPalleteCount: "",
  euroPalleteCountPrecise: "",
  chinaPalleteCount: "",
  extraEuroPalleteCountPrecise: "",
  chinaPalleteCountPrecise: "",
  extraChinaPalleteCountPrecise: "",
  gProduction: "",
  kgProduction: "",
};

const palletsList = [
  { id: "pallet-1", name: "Euro pallet (140 bags)", value: 140 },
  { id: "pallet-2", name: "China pallet (180 bags)", value: 180 },
];

function AddRecord() {
  const [formState, setFormState] = useState(initialState);
  const [productionState, setProductionState] = useState(initialProdState);
  const [productsList, setProductsList] = useState([]);
  const [chosenProduct, setChosenProduct] = useState({});

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;

    if (name === "product") {
      const el = productsList.find((el) => {
        return el?._id?.toString() === value.toString();
      });
      if (!isEmpty(el)) {
        delete el._id;
        delete el.__v;
        setChosenProduct(el);
      }
    }

    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const resetForm = () => {
    setFormState(initialState);
    setProductionState(initialProdState);
    setChosenProduct({});
  };

  // const addRecordHandler = (e) => {
  //   e.preventDefault();

  //   console.log({ ...formState, ...productionState });

  //   axios
  //     .post("/records", { ...formState, ...productionState })
  //     .then((res) => {
  //       toast.success(res.data.msg);
  //     })
  //     .catch((err) => {
  //       if (err?.response?.data?.errors) {
  //         err?.response?.data?.errors.forEach((el) => {
  //           toast.error(el);
  //         });
  //       } else toast.error("Uh Oh! Something went wrong");
  //     });
  // };

  const formSubmitHandler = (e) => {
    e.preventDefault();

    axios
      .post("/records", {
        ...formState,
        ...productionState,
        ballWeight: formState.ballWeight * 1000,
        date: new Date().toString(),
      })
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

  useEffect(() => {
    axios
      .get("/products")
      .then((res) => {
        setProductsList(res.data.products);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong while fetching products");
      });
  }, []);

  useEffect(() => {
    const obj = {};
    if (formState.ballWeight) {
      obj.ballWeight =
        formState.ballWeight * 1000 - 0.03 * (formState.ballWeight * 1000);

      if (!isEmpty(chosenProduct)) {
        // obj.rollsCount = obj.ballWeight / chosenProduct.rollWeight;
        obj.rollsCount =
          (formState.ballWeight * 1000) / chosenProduct.rollWeight;
        obj.rollsCountPrecise = Math.floor(obj.rollsCount);

        obj.bagsCount = obj.rollsCount / 10;
        obj.bagsCountPrecise = obj.rollsCountPrecise / 10;

        obj.extraBagsCount = obj.rollsCount % 10;
        obj.extraBagsCountPrecise = obj.rollsCountPrecise % 10;

        obj.euroPalleteCountPrecise = obj.bagsCountPrecise / 140;
        obj.euroPalleteCount = Math.floor(obj.bagsCount / 140);

        // obj.extraEuroPalleteCount = obj.bagsCountPrecise / 140;
        obj.extraEuroPalleteCount = obj.euroPalleteCountPrecise % 1;

        obj.chinaPalleteCountPrecise = obj.bagsCountPrecise / 180;
        obj.chinaPalleteCount = Math.floor(obj.bagsCount / 180);

        obj.extraChinaPalleteCount = obj.chinaPalleteCountPrecise % 1;
        // obj.extraChinaPalleteCount = obj.bagsCountPrecise / 180;
      }

      if (
        !isEmpty(formState.actualPalletes) ||
        !isEmpty(formState.actualBags) ||
        !isEmpty(formState.actualRolls)
      ) {
        const rollsCount =
          +(formState.actualPalletes || 0) * formState.pallet * 10 +
            +(formState.actualBags || 0) * 10 +
            +(formState.actualRolls || 0) || 0;
        const g = rollsCount * chosenProduct.rollWeight;

        const kg = g / 1000;

        obj.gProduction = g;
        obj.kgProduction = kg;

        console.log(formState.ballWeight, obj.gProduction);

        obj.kgLoss = formState.ballWeight - obj.kgProduction;
        obj.gLoss = formState.ballWeight * 1000 - obj.gProduction;

        obj.gLossPercent = (obj.gLoss / (formState.ballWeight * 1000)) * 100;
      }
    }

    setProductionState((prevState) => ({
      ...prevState,
      ...obj,
    }));
  }, [formState, chosenProduct]);

  return (
    <form onSubmit={formSubmitHandler}>
      <Container fluid className="px-0">
        <Row className="justify-content-center">
          <Col lg={6}>
            <h2 className="text-center mb-4">Enter the ball information</h2>
            {/* <Form onSubmit={addRecordHandler}> */}
            <Form.Group className="mb-3" controlId="ballWeight">
              <Form.Label>Weight of Ball</Form.Label>
              <Form.Control
                name="ballWeight"
                value={formState.ballWeight}
                onChange={inputChangeHandler}
                type="number"
                placeholder="Enter weight of the ball"
              />
              {productionState.ballWeight && (
                <Form.Text muted>
                  (After 3% deduction =&gt; {productionState.ballWeight} grams)
                </Form.Text>
              )}
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="paperGram">
              <Form.Label>Grams of Paper</Form.Label>
              <Form.Control
                name="paperGrams"
                value={formState.paperGrams}
                onChange={inputChangeHandler}
                type="number"
                placeholder="Enter grams of paper"
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="numplies">
              <Form.Label>No. of Plies</Form.Label>
              <Form.Control
                name="pilesNum"
                value={formState.pilesNum}
                onChange={inputChangeHandler}
                type="text"
                placeholder="Enter number of plies"
              />
            </Form.Group> */}

            <Form.Group className="mb-3" controlId="numplies">
              <Form.Label>Ball number</Form.Label>
              <Form.Control
                name="ballNum"
                value={formState.ballNum}
                onChange={inputChangeHandler}
                type="number"
                placeholder="Enter the ball number"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="numplies">
              <Form.Label>Batch number of Ball</Form.Label>
              <Form.Control
                name="batchNum"
                value={formState.batchNum}
                onChange={inputChangeHandler}
                type="number"
                placeholder="Enter the batch number"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="prodName">
              <Form.Label>Choose the product</Form.Label>

              <Form.Select
                aria-label="Products List"
                name="product"
                value={formState.product}
                onChange={inputChangeHandler}
              >
                <option value="">Click to choose</option>
                {productsList.map((el, idx) => {
                  return (
                    <option key={el._id} value={el._id}>
                      {el.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="prodName">
              <Form.Label>Choose the pallete</Form.Label>

              <Form.Select
                aria-label="Pallets List"
                name="pallet"
                value={formState.pallet}
                onChange={inputChangeHandler}
              >
                <option value="">Click to choose</option>
                {palletsList.map((el, idx) => {
                  return (
                    <option key={el.id} value={el.value}>
                      {el.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            {/* </Form> */}

            {!isEmpty(chosenProduct) && (
              <Accordion className="my-4">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Product Info</Accordion.Header>
                  <Accordion.Body>
                    {/* <h3 className="text-center mb-3 text-primary"></h3> */}

                    <Table bordered variant="dark" striped>
                      <tbody>
                        <tr>
                          <td>Name</td>
                          <td>{chosenProduct.name}</td>
                        </tr>
                        <tr>
                          <td>Roll Weight</td>
                          <td>{chosenProduct.rollWeight}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
                {formState.ballWeight && (
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>100% Production Info</Accordion.Header>
                    <Accordion.Body>
                      <div className="">
                        <Table bordered variant="dark" striped>
                          <tbody>
                            <tr>
                              <td>No. of rolls</td>
                              <td>{productionState.rollsCountPrecise}</td>
                            </tr>
                            <tr>
                              <td>No. of rolls precise</td>
                              <td>{productionState.rollsCount}</td>
                            </tr>
                            <tr>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>No. of bags</td>
                              <td>
                                {Math.floor(productionState.bagsCountPrecise)}{" "}
                                bags and {productionState.extraBagsCountPrecise}{" "}
                                rolls
                              </td>
                            </tr>
                            <tr>
                              <td>No. of bags precise</td>
                              <td>
                                {Math.floor(productionState.bagsCount)} bags and{" "}
                                {productionState.extraBagsCount} rolls
                              </td>
                            </tr>
                            <tr>
                              <td></td>
                              <td></td>
                            </tr>
                            {+formState.pallet === 140 && (
                              <>
                                <tr>
                                  <td>No. of Euro Pallets</td>
                                  <td>{productionState.euroPalleteCount}</td>
                                </tr>
                                <tr>
                                  <td>No. of Euro Pallets Precise</td>
                                  <td>
                                    {productionState.euroPalleteCountPrecise}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Summary:</td>
                                  <td>
                                    {productionState.euroPalleteCount} palletes,{" "}
                                    {Math.floor(
                                      productionState.extraEuroPalleteCount *
                                        140
                                    )}{" "}
                                    bags and{" "}
                                    {Math.floor(
                                      ((productionState.extraEuroPalleteCount *
                                        140) %
                                        1) *
                                        10
                                    )}{" "}
                                    rolls
                                  </td>
                                </tr>
                              </>
                            )}
                            {+formState.pallet === 180 && (
                              <>
                                <tr>
                                  <td>No. of China Pallets</td>
                                  <td>{productionState.chinaPalleteCount}</td>
                                </tr>
                                <tr>
                                  <td>No. of China Pallets Precise</td>
                                  <td>
                                    {productionState.chinaPalleteCountPrecise}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Summary:</td>
                                  <td>
                                    {productionState.chinaPalleteCount}{" "}
                                    palletes,{" "}
                                    {Math.floor(
                                      productionState.extraChinaPalleteCount *
                                        180
                                    )}{" "}
                                    bags and{" "}
                                    {Math.floor(
                                      ((productionState.extraChinaPalleteCount *
                                        180) %
                                        1) *
                                        10
                                    )}{" "}
                                    rolls
                                  </td>
                                </tr>
                              </>
                            )}
                            <tr>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                )}
              </Accordion>
            )}

            <h4 className="mt-3 mb-4">Actual production info:</h4>

            <Row>
              <Col sm={4}>
                <Form.Group className="mb-3" controlId="numplies">
                  <Form.Label>Palletes</Form.Label>
                  <Form.Control
                    name="actualPalletes"
                    value={formState.actualPalletes}
                    onChange={inputChangeHandler}
                    type="number"
                    placeholder="Palletes produced"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group className="mb-3" controlId="numplies">
                  <Form.Label>Bags</Form.Label>
                  <Form.Control
                    name="actualBags"
                    value={formState.actualBags}
                    onChange={inputChangeHandler}
                    type="number"
                    placeholder="Extra bags produced"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group className="mb-3" controlId="numplies">
                  <Form.Label>Rolls</Form.Label>
                  <Form.Control
                    name="actualRolls"
                    value={formState.actualRolls}
                    onChange={inputChangeHandler}
                    type="number"
                    placeholder="Extra rolls produced"
                  />
                </Form.Group>
              </Col>
            </Row>

            {productionState.gProduction && (
              <>
                <h3 className="text-center mt-4 mb-3">Stats:</h3>

                <Row gutter className="justify-content-center">
                  <Col md={6}>
                    <Card bg="success" text="white">
                      <Card.Body bg="success" className="text-center">
                        <Card.Title>
                          <h2>{productionState.kgProduction} kg</h2>
                          <h5>({productionState.gProduction} g)</h5>
                        </Card.Title>
                        <Card.Text>Actual Production</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card bg="primary" text="white">
                      <Card.Body bg="primary" className="text-center">
                        <Card.Title>
                          <h2>{formState.ballWeight} kg</h2>
                          <h5>({formState.ballWeight * 1000} g)</h5>
                        </Card.Title>
                        <Card.Text>Ideal Production</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card bg="danger" text="white">
                      <Card.Body bg="primary" className="text-center">
                        <Card.Title>
                          <h2>
                            {productionState.gLossPercent &&
                              productionState.gLossPercent.toFixed(2)}
                            %
                          </h2>
                          <h5>
                            (
                            {productionState.kgLoss &&
                              productionState.kgLoss.toFixed(2)}{" "}
                            kg)
                          </h5>
                          <h5>
                            (
                            {productionState.gLoss &&
                              productionState.gLoss.toFixed(2)}{" "}
                            g)
                          </h5>
                        </Card.Title>
                        <Card.Text>Loss</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <div className="mt-4">
                  <Chart
                    actualProd={productionState.kgProduction}
                    idealProd={formState.ballWeight}
                  />
                </div>
              </>
            )}

            <div className="mt-4">
              <Button variant="success" className="me-2" type="submit">
                Save
              </Button>
              <Button onClick={resetForm} variant="danger">
                Reset
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </form>
  );
}

export default AddRecord;
