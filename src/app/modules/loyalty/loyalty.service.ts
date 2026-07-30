import { ClientSession } from "mongoose";
import { LoyaltyAccount } from "./loyalty.model";

// :::: Loyalty Account :::: 

export const getOrCreateLoyaltyAccount = async(userId: string, session?: ClientSession) => {
  let loyaltyAccount = await LoyaltyAccount.findOne({userId}).session(session?? null);

  if(!loyaltyAccount){
    const createdLoyaltyAccount = await LoyaltyAccount.create(
      [
        {
          userId,
          totalPoints: 0,
          lifetimeEarned: 0,
          lifetimeRedeemed: 0,
          lifetimeExpired: 0
        }
      ],
      {session}
    );

    loyaltyAccount = createdLoyaltyAccount[0];
  }

  return loyaltyAccount;
}
