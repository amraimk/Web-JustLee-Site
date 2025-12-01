import { getConnection } from "../oracle.js";

//login admin
export async function loginAdmin(email) {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT EMAIL, PASSWORD FROM JL_ADMIN WHERE EMAIL = :email`,
            { email }
        );
        console.log("DB result:", result.rows);
        return result.rows[0];
    } catch (err) {
        console.error("Error fetching admin :", err);
    } finally {
        if (connection) await connection.close();
    }
};