import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BikeInfo = () => {
  const [bikes, setBikes] = useState([]);
  const [selectedBikeId, setSelectedBikeId] = useState(null);
  const [bikeInfo, setBikeInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editBike, setEditBike] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch bikes from the backend
    axios.get('http://localhost:8888/bike/read')
      .then(response => {
        setBikes(response.data);
      })
      .catch(error => console.error('Error fetching bikes:', error));
  }, []);

  const handleBikeSelect = (bikeId) => {
    setSelectedBikeId(bikeId);

    // Fetch bike information for the selected bike
    axios.get(`http://localhost:8888/bike/readOne1/${bikeId}`)
      .then(response => {
        setBikeInfo(response.data);
      })
      .catch(error => console.error('Error fetching bike info:', error));
  };

  const handleEditClick = () => {
    setEditMode(true);
    setEditBike(bikeInfo);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditBike(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSaveClick = () => {
    const validationErrors = {};
    const nameRegex = /^[A-Z]/;
    const brandRegex = /^[A-Z]/;

    if (!editBike.name) {
      validationErrors.name = "Name is required";
    } else if (!nameRegex.test(editBike.name)) {
      validationErrors.name = "Name must start with a capital letter";
    }

    if (!editBike.brand) {
      validationErrors.brand = "Brand is required";
    } else if (!brandRegex.test(editBike.brand)) {
      validationErrors.brand = "Brand must start with a capital letter";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    axios.put(`http://localhost:8888/bike/update/${editBike.id}`, editBike)
      .then(response => {
        setBikeInfo(response.data);
        setEditMode(false);
        setErrors({});
      })
      .catch(error => console.error('Error updating bike info:', error));
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h2>Select Bike</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bikes.map(bike => (
                    <tr key={bike.id}>
                      <td>{bike.name}</td>
                      <td>
                        <button className="btn btn-primary" onClick={() => handleBikeSelect(bike.id)}>
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2>Bike Information</h2>
              {bikeInfo ? (
                <div>
                  {editMode ? (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={editBike.name}
                          onChange={handleEditChange}
                        />
                        {errors.name && <div className="text-danger">{errors.name}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Brand</label>
                        <input
                          type="text"
                          name="brand"
                          className="form-control"
                          value={editBike.brand}
                          onChange={handleEditChange}
                        />
                        {errors.brand && <div className="text-danger">{errors.brand}</div>}
                      </div>
                      <button className="btn btn-success" onClick={handleSaveClick}>Save</button>
                    </>
                  ) : (
                    <>
                      <h3>Name: {bikeInfo.name}</h3>
                      <h3>Brand: {bikeInfo.brand}</h3>
                      <button className="btn btn-secondary" onClick={handleEditClick}>Edit</button>
                    </>
                  )}
                </div>
              ) : (
                <p>Select a bike to see its information.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeInfo;
