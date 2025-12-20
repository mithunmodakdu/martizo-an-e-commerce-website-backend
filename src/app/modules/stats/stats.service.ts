import { Product } from "../product/product.model";
import { EIsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate()-7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate()-30);

const getUsersStats = async() => {
  const totalActiveUsersPromise = User.countDocuments({isActive: EIsActive.ACTIVE});
  const totalInactiveUsersPromise = User.countDocuments({isActive: EIsActive.INACTIVE});
  const totalBlockedUsersPromise = User.countDocuments({isActive: EIsActive.BLOCKED});

  const newTotalUsersInLastSevenDaysPromise = User.countDocuments({createdAt: {$gte: sevenDaysAgo}});
  const newTotalUsersInLastThirtyDaysPromise = User.countDocuments({createdAt: {$gte: thirtyDaysAgo}});

  const totalUsersByRolePromise = User.aggregate([
    {
      $group : {
        _id: "$role",
        count: {$sum: 1}
      }
    }
  ]);

  const [
    totalActiveUsers,
    totalInactiveUsers,
    totalBlockedUsers,
    newTotalUsersInLastSevenDays,
    newTotalUsersInLastThirtyDays,
    totalUsersByRole
  ] = await Promise.all([
    totalActiveUsersPromise,
    totalInactiveUsersPromise,
    totalBlockedUsersPromise,
    newTotalUsersInLastSevenDaysPromise,
    newTotalUsersInLastThirtyDaysPromise,
    totalUsersByRolePromise
  ]);

  return {
    totalActiveUsers,
    totalInactiveUsers,
    totalBlockedUsers,
    newTotalUsersInLastSevenDays,
    newTotalUsersInLastThirtyDays,
    totalUsersByRole
  }
}

const getProductsStats = async() => {
  const totalProductsPromise = Product.countDocuments(); 

  const totalProductsByCategoryPromise = Product.aggregate([
    {
      $lookup : {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category"
      }
    },

    {
      $unwind: "$category"
    },

    {
      $group: {
        _id: "$category.name",
        count: {$sum: 1}
      }
    }
  
  ]);

  const [totalProducts, totalProductsByCategory] = await Promise.all([totalProductsPromise, totalProductsByCategoryPromise]);

  return {totalProducts, totalProductsByCategory}
}

const getOrdersStats = async() => {
  return {}
}

const getPaymentsStats = async() => {
  return{}
}

export const StatsServices = {
  getUsersStats,
  getProductsStats,
  getOrdersStats,
  getPaymentsStats
  
}