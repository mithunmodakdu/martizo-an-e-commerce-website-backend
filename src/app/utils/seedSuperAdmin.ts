import { envVars } from "../config/env"
import { EIsActive, ERole, IAuthProvider, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model"
import bcryptjs from "bcryptjs";

export const seedSuperAdmin = async() => {
  try {
    const isSuperAdminExist = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL});

    if(isSuperAdminExist){
      console.log("Super admin already exists.");
      return;
    }

    console.log("Creating super admin...");

    const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND));

    const authProvider : IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL
    }

    const payload : IUser = {
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: ERole.SUPER_ADMIN,
      isVerified: true,
      isActive: EIsActive.ACTIVE,
      isDeleted: false,
      auths: [authProvider]
    }

    const superAdmin = await User.create(payload);
    console.log("Super admin created successfully. \n");
    console.log(superAdmin);


  } catch (error) {
    console.log(error)
  }
}