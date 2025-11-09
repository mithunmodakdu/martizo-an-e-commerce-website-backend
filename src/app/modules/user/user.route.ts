import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "./user.interface";

const router = Router();

router.post("/register", 
  // validateRequest(createUserZodSchema), 
  UserControllers.createUser
);
router.patch("/:id", checkAuth(...Object.values(ERole)), UserControllers.updateUser);
router.get("/all-users", checkAuth(ERole.SUPER_ADMIN), UserControllers.getAllUsers);

export const UserRoutes = router;