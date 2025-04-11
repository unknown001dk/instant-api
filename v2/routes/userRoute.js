import express from 'express';
// import { deleteUser, getAllUsers, updateUser, userLogin, userLogout, userRegister } from '../controllers/user.controller.js';
import UserController from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to get all users 
router.get('/getusers', UserController.getAllUsers, isAuthenticated);
router.get('/getuser/:id', UserController.getUser, isAuthenticated);
router.get('/getactivity/:id', UserController.getActivity, isAuthenticated);

router.post('/register', (req, res) => UserController.register(req, res));
router.post('/login', (req, res) => UserController.login(req, res));
router.post('/logout', (req, res) => UserController.logout(req, res), isAuthenticated);

router.put('/update/:id', (req, res) => UserController.update(req, res));
router.put('/:id/profile-picture', (req, res) => UserController.updateProfilePicture(req, res));

router.delete('/delete/:id', (req, res) => UserController.delete(req, res));

export default router;