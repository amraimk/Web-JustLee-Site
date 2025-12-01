import jwt from 'jsonwebtoken';
 
const generateToken = (admin) => {
    return jwt.sign(
        {
            email: admin.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d'
        }
    );
}
 
export default generateToken;