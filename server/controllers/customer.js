import {
getAllCustomerOrders,
getCustomerCount
} from "../models/customer.js";



// Get total customer count
export async function customerCountController(req, res) {
  try {
    const customerCount = await getCustomerCount();
    res.status(200).json({ customerCount });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to fetch customer count" });
  }
};


// Get all customers orders
export async function fetchAllCustomersOrders(req, res) {
  try {
    const customers = await getAllCustomerOrders();
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to fetch customers: ${err.message}`);
  }
};