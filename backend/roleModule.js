const jwt = require('jsonwebtoken');
const db = require('./server'); // Import the database connection

// Middleware to check if a user has the required permission
const authorizeRolePermission = (requiredPermission) => {
    return async (req, res, next) => {
        // Extract the JWT token from the Authorization header
        const token = req.header("Authorization")?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: token missing' });
        }

        try {
            // Verify and decode the JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;

            // Query the user's role from the database
            const [user] = await db.promise().query('SELECT role_id FROM users WHERE id = ?', [userId]);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const roleId = user.role_id;

            // Query the permissions associated with the user's role
            const [permissions] = await db.promise().query(`
                SELECT permission_name 
                FROM role_permissions 
                JOIN permissions ON permissions.id = role_permissions.permission_id 
                WHERE role_id = ?
            `, [roleId]);

            const userPermissions = permissions.map(p => p.permission_name);

            // Check if the user has the required permission
            if (!userPermissions.includes(requiredPermission)) {
                return res.status(403).json({ message: 'Access Denied: Insufficient permissions' });
            }

            req.user = decoded; // Attach user info to the request
            next(); // Proceed to the next middleware/route
        } catch (error) {
            console.error("Authorization Error:", error);
            return res.status(500).json({ message: 'Error verifying token', error });
        }
    };
};

module.exports = { authorizeRolePermission };
