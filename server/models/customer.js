import { getConnection } from "../oracle.js";
import oracledb from "oracledb";


//get count of Authors
export async function getCustomerCount() {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN sp_count_customers(:customer_total); END;`,
      {
        customer_total: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );
    return result.outBinds.customer_total;

  } catch (err) {
    console.error("Error fetching customer count:", err);
  } finally {
    if (connection) await connection.close();
  }
}


// Get all customers
export async function getAllCustomerOrders() {
  let connection;

  try {
    connection = await getConnection();
    const result = await connection.execute(
      `BEGIN SP_GET_ALL_ORDERS(:cursor); END;`,
      { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
    );

    const cursor = result.outBinds.cursor;
    const rows = await cursor.getRows();  // Get all rows
    await cursor.close();

    return rows;

  } catch (err) {
    console.error("Error fetching customers:", err);
    throw err;
  } finally {
    if (connection) await connection.close();
  }
};
