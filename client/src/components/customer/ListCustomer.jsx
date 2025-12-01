import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ListCustomer() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        const response = await fetch('http://localhost:5000/api/customer', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch customers");
        }

        setCustomers(data);
      } catch (error) {
        console.error(`Error fetching customers: ${error.message}`);
        setError(error.message);
      }
    }

    fetchCustomers();
  }, []);


  return (
    <div className="table-section-page">
      <h1>List Customers</h1>

      {error && <p className="error-msg">{error}</p>}
      <div className="table-wrapper">
        {customers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>ZIP</th>
                <th>Referred</th>
                <th>Region</th>
                <th>Email</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer[0]}>
                  <td>{customer[0]}</td>
                  <td>{customer[1]}</td>
                  <td>{customer[2]}</td>
                  <td>
                    {customer[3]}
                  </td>
                  <td>
                    {customer[4]}
                  </td>
                  <td>{customer[5]}</td>
                  <td>
                    {customer[6]}
                  </td>
                  <td>
                    {customer[7]}
                  </td>
                  <td>
                    {customer[8]}
                  </td>
                  <td>
                    {customer[9]}
                  </td>
                  {/* <td className="actions-cell">
                    <div>
                      <button className="primary" onClick={() => handleUpdate(customer)}>Update</button>
                      <button className="secondary" onClick={() => handleDelete(customer["CUSTOMER#"])}>Delete</button>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-state">No customers available</p>
        )}
      </div>

    </div>
  );
}
