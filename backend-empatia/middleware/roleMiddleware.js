const roleMiddleware = (requiredRole) => (req, res, next) => {
    if (req.user.rol !== requiredRole) {
        return res.status(403).json({ message: 'Acceso denegado: Rol no autorizado' });
    }
    next();
};

module.exports = roleMiddleware;