import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrdersTable.css"; // Import CSS file for styling
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { Add, Save } from "@material-ui/icons";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import Select from "@mui/material/Select/Select";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import FormControl from "@mui/material/FormControl/FormControl"; // Import CSS file for styling
/**
 * this page is accessed by the manager he can update the status 
 * of the courier if he see that the efficency is low
 * by clicking on status and change it OK/WARNING
 * @returns 
 */
function ManageCouriers() {
  const [couriers, setCouriers] = useState([]);
  const [modifiedCouriers, setModifiedCouriers] = useState([]);
  const [courierEfficiencies, setCourierEfficiencies] = useState([]);

  let userObj;
  let user = localStorage.getItem("user");
  if (user !== null) {
    userObj = JSON.parse(user); // to get the json syntax
  }

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/Couriers")
      .then((response) => {
        setCouriers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleStatusChange = (courierId, newStatus) => {
    const updatedCouriers = couriers.map((courier) => {
      if (courier.user.id === courierId) {
        return {
          ...courier,
          status: newStatus,
        };
      }
      return courier;
    });

    setCouriers(updatedCouriers);
    setModifiedCouriers(updatedCouriers); // Update modifiedCouriers
  };

  const handleSaveChanges = () => {
    const requests = modifiedCouriers.map((modifiedCourier) => {
      const { id, status } = modifiedCourier;
      return axios.put(
        `http://localhost:3000/api/v1/Couriers/updateStatusOfTheCourier/${id}`,
        { status }
      );
    });

    axios
      .all(requests)
      .then((responses) => {
        console.log(responses); // handle the responses as needed
        setModifiedCouriers([]); // reset the modified couriers state
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const calculateEfficiency = async (courier) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/flyOrders/get/courierOrders/all/${courier._id}`
      );

      if (response.status === 200) {
        const orders = response.data;
        const totalOrders = orders.length;
        let totalDeliveryTime = 0;

        orders.forEach((order) => {
          totalDeliveryTime += order.deliveryTime;
        });

        const averageDeliveryTime = totalDeliveryTime / totalOrders;
        let efficiency = (averageDeliveryTime / 30) * 10;
        if (totalOrders === 1) {
          if (totalDeliveryTime <= 30) efficiency = 10;
           else{
                efficiency = (30/totalDeliveryTime) * 10
          }
        }
        // Clamp efficiency value to the range of 0-10
        const clampedEfficiency = Math.max(0, Math.min(10, efficiency));

        return clampedEfficiency.toFixed(2); // Round efficiency to 2 decimal places
      } else {
        return "N/A"; // Return "N/A" if the response status is not 200
      }
    } catch (error) {
      console.log(error);
      return "N/A"; // Return "N/A" if there is an error fetching orders
    }
  };

  useEffect(() => {
    const calculateEfficiencies = async () => {
      const couriersWithEfficiency = await Promise.all(
        couriers.map(async (courier) => {
          try {
            const efficiency = await calculateEfficiency(courier);
            return {
              ...courier,
              efficiency,
            };
          } catch (error) {
            console.log(error);
            return {
              ...courier,
              efficiency: "N/A",
            };
          }
        })
      );
      setCourierEfficiencies(couriersWithEfficiency);
    };

    calculateEfficiencies();
  }, [couriers]);

  const getEfficiencyFontColor = (efficiency) => {
    if (efficiency >= 8.1) {
      return "green";
    } else if (efficiency >= 5) {
      return "#FFFF00";
    } else {
      return "red";
    }
  };

  return (
    <div className="manage-Couriers-form">
      <h1 style={{ textAlign: "center" }}>Couriers Management</h1>
      <div className="buttons-section">
        <Button
          component={Link}
          to="/ManagerForm/manageCouriers/addNewCourier"
          color="primary"
          variant="contained"
          style={{
            backgroundColor: "rgb(69, 182, 175)",
            marginRight: "10px",
          }}
        >
          <Add />
          Add
        </Button>
        <Button
          component={Link}
          to="/ManagerForm"
          color="primary"
          variant="contained"
          disabled={modifiedCouriers.length === 0}
          onClick={handleSaveChanges}
          style={{
            backgroundColor: "rgb(66, 139, 202)",
            color: "white",
          }}
        >
          <Save />
          Changes
        </Button>
      </div>
      <div className="Couriers-info-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Status</th>
              <th>Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {courierEfficiencies.map((courier) => (
              <tr key={courier.user.id}>
                <td>{courier.user.id}</td>
                <td>{courier.user.userName}</td>
                <td>
                  <FormControl sx={{ width: "100%" }} size="small">
                    <InputLabel id="demo-select-small-label">Status</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      value={
                        modifiedCouriers.find(
                          (modifiedCourier) =>
                            modifiedCourier.user.id === courier.user.id
                        )?.status || courier.status
                      }
                      label="Month"
                      onChange={(e) =>
                        handleStatusChange(courier.user.id, e.target.value)
                      }
                    >
                      <MenuItem value="OK">
                        {" "}
                        <em>OK</em>{" "}
                      </MenuItem>
                      <MenuItem value="Warning">
                        {" "}
                        <em>Warning</em>{" "}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </td>
                <td style={{ color: getEfficiencyFontColor(courier.efficiency) }}>
                  {courier.efficiency}
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageCouriers;
