import React, { useEffect } from "react";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

const ListRecords = () => {
  const [showModal, setShowModal] = useState(false);
  const [recordsList, setRecordsList] = useState([]);
  const [id, setId] = useState();

  const handleClose = () => {
    setShowModal(false);
    setId(undefined);
  };
  const handleShow = () => setShowModal(true);

  const fetchRecords = useCallback(() => {
    axios
      .get("/records")
      .then((res) => {
        setRecordsList(res.data.records);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong while fetching products");
      });
  }, []);

  const deleteHandler = () => {
    handleClose();

    axios
      .delete(`/records/${id}`)
      .then((res) => {
        toast.success(res.data.msg);
        fetchRecords();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong while deleting the product");
      });
  };

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <>
      <h2 className="text-center">Records List</h2>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={deleteHandler}>
            Sure
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="table-container">
        <Table bordered className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Ball Num</th>
              <th>Batch Num</th>
              <th>Ball Weight (g)</th>
              <th>Production (g)</th>
              <th>Loss (g)</th>
              <th>Loss (%age)</th>
              <th className="text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {recordsList.map((el, idx) => {
              console.log(el);
              return (
                <tr key={el._id}>
                  <td>{idx + 1}</td>
                  <td>
                    {el.date ? new Date(el.date).toLocaleDateString() : ""}
                  </td>
                  <td>{el.ballNum}</td>
                  <td>{el.batchNum}</td>
                  <td>{el.ballWeight}</td>
                  <td>{el.gProduction}</td>
                  <td>{el.gLoss}</td>
                  <td>{el.gLossPercent}</td>
                  <td className="text-center">
                    <img
                      className="c-pointer"
                      src="/assets/vectors/icons/trash.svg"
                      alt="trash"
                      onClick={handleShow}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default ListRecords;
