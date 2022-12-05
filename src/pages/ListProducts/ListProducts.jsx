import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

const ListProducts = () => {
  const [showModal, setShowModal] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [id, setId] = useState();

  const handleClose = () => {
    setShowModal(false);
    setId(undefined);
  };
  const handleShow = () => setShowModal(true);

  const fetchProducts = useCallback(() => {
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

  const deleteHandler = () => {
    handleClose();

    axios
      .delete(`/products/${id}`)
      .then((res) => {
        toast.success(res.data.msg);
        fetchProducts();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong while deleting the product");
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      <h2 className="text-center">Products List</h2>

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
              <th>Name</th>
              <th>No. of sheets</th>
              <th>Sheet length</th>
              <th>Log Weight</th>
              <th>Rolls in a log</th>
              <th>Roll Weight</th>
              <th className="text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {productsList.map((el, idx) => {
              return (
                <tr key={el._id}>
                  <td>{idx + 1}</td>
                  <td>{el.name}</td>
                  <td>{el.sheetsNum}</td>
                  <td>{el.sheetLength}</td>
                  <td>{el.logWeight}</td>
                  <td>{el.rollsNum}</td>
                  <td>{el.rollWeight}</td>
                  <td className="text-center">
                    <img
                      className="c-pointer"
                      src="/assets/vectors/icons/trash.svg"
                      alt="trash"
                      onClick={() => {
                        handleShow();
                        setId(el._id);
                      }}
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

export default ListProducts;
