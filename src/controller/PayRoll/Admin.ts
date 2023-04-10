import {Request , Response , NextFunction} from "express"
import mongoose from "mongoose"
import adminAuth from "../../model/admin/adminAuth";
import adminTransactionHistory from "../../model/admin/admindashboard/adminTransactionHistorys";
import adminWalletModel from "../../model/admin/admindashboard/adminWallets";
import staffAuth from "../../model/staff/staffAuth";
import staffTransactionHistory from "../../model/staff/staffDashboard/stafftransactionHistorys";
import staffWalletModel from "../../model/staff/staffDashboard/StaffWallet";



//admin transfer from wallet to staff wallet for staffs with no plans



export const MakeTransfer = async (req: Request, res: Response) => {
    try {
      const { walletNumber, amount } = req.body;
      const getDate = new Date().toDateString();
  
      const referenceGeneratedNumber = Math.floor(Math.random() * 67485753) + 243;
  
      //RECIEVER ACCOUNT
      const getReciever = await staffAuth.findOne({ walletNumber });
      const getRecieverWallet = await staffWalletModel.findById(getReciever?._id);
  
      // SENDER ACCOUNT
      const getUser = await adminAuth.findById(req.params.UserId);
      const getUserWallet = await adminWalletModel.findById(getUser?._id);
  
      if (getUser && getReciever) {
        if (amount > getUserWallet?.balance!) {
          return res.status(404).json({
            message: "insufficent fund.",
          });
        } else {
          // undating the sender walllet
          await adminWalletModel.findByIdAndUpdate(getUserWallet?._id, {
            balance: getUserWallet?.balance! - amount,
            credit: 0,
            debit: amount,
          });
  
          const createHisorySender = await adminTransactionHistory.create({
            message: `you have sent ${amount} to ${getReciever?.yourName}`,
            receiver: getReciever?.yourName,
            transactionReference: referenceGeneratedNumber,
            date: getDate,
          });
  
          getUser?.transactionHistory?.push(
            new mongoose.Types.ObjectId(createHisorySender?._id)
          );
  
          getUser?.save();
  
          // reciever wallet
          await staffWalletModel.findByIdAndUpdate(getRecieverWallet?._id, {
            balance: getRecieverWallet?.balance! + amount,
            credit: amount,
            debit: 0,
          });
  
          const createHisoryReciever = await staffTransactionHistory.create({
            message: `an amount of ${amount} has been sent to you by ${getUser?.companyname}`,
            transactionType: "credit",
            receiver: getUser?.yourName,
            transactionReference: referenceGeneratedNumber,
          });
          getReciever?.transactionHistory?.push(
            new mongoose.Types.ObjectId(createHisoryReciever?._id)
          );
          getReciever?.save();
        }
  
        return res.status(200).json({
          message: "Transaction successfull",
        });
      } else {
        return res.status(404).json({
          message: "Account not found",
        });
      }
    } catch (err) {
      return res.status(404).json({
        message: "an error occurred",
        err,
      });
    }
  };