import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import adminAuth from "../../model/admin/adminAuth";
import adminTransactionHistory from "../../model/admin/admindashboard/adminTransactionHistorys";
import adminWalletModel from "../../model/admin/admindashboard/adminWallets";
import staffAuth from "../../model/staff/staffAuth";
import staffTransactionHistory from "../../model/staff/staffDashboard/stafftransactionHistorys";
import staffWalletModel from "../../model/staff/staffDashboard/StaffWallet";
import payRollModel from "../../model/staff/StaffPayroll/StaffPayRoll";

//admin transfer from wallet to staff wallet for staffs with no plans

export const MakeTransfer = async (req: Request, res: Response) => {
  try {
    const { walletNumber, amount, grossPay, netPay, taxes, medicals, pension } =
      req.body;
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

//create staff payroll
export const createPayRoll = async (req: Request, res: Response) => {
  try {
    const { walletNumber, amount, grossPay, netPay, taxes, medicals, pension } =
      req.body;

    const expenses = taxes + medicals + pension;

    const pay = grossPay - expenses;

    const referenceGeneratedNumber = Math.floor(Math.random() * 67485753) + 243;


    // const getStaff = await staffAuth.findById(req.params.staffId);

      //RECIEVER ACCOUNT
      const getStaff = await staffAuth.findOne({ walletNumber });
      const getStaffWallet = await staffWalletModel.findById(getStaff?._id);
  

       // SENDER ACCOUNT
    const getUser = await adminAuth.findById(req.params.UserId);
    const getUserWallet = await adminWalletModel.findById(getUser?._id);


    if (getStaff && getUser) {

if (amount > getUserWallet?.balance!) {
        if(expenses > grossPay){
          return res.status(400).json({
            message : "a staff's expenses can't be more than his/her gross pay"
          })
        }
      } else {

        const payroll = await payRollModel.create({
          grossPay,
          netPay: pay,
          taxes,
          pension,
          medicals,
        });
        await getStaff?.payRoll?.push(new mongoose.Types.ObjectId(payroll?._id));
  
        await getStaff?.save();
       
        // undating the sender walllet
        await adminWalletModel.findByIdAndUpdate(getUserWallet?._id, {
          balance: getUserWallet?.balance! - amount,
          credit: 0,
          debit: amount,
        });

        const createHisorySender = await adminTransactionHistory.create({
          message: `you have sent ${amount} to ${getStaff?.yourName}`,
          receiver: getStaff?.yourName,
          transactionReference: referenceGeneratedNumber,
          // date: getDate,
        });

        getUser?.transactionHistory?.push(
          new mongoose.Types.ObjectId(createHisorySender?._id)
        );

        getUser?.save();

        // reciever wallet
        await staffWalletModel.findByIdAndUpdate(getStaffWallet?._id, {
          balance: getStaffWallet?.balance! + amount,
          credit: amount,
          debit: 0,
        });

        const createHisoryReciever = await staffTransactionHistory.create({
          message: `an amount of ${amount} has been sent to you by ${getUser?.companyname}`,
          transactionType: "credit",
          receiver: getUser?.yourName,
          transactionReference: referenceGeneratedNumber,
        });
        getStaff?.transactionHistory?.push(
          new mongoose.Types.ObjectId(createHisoryReciever?._id)
        );
        getStaff?.save();

        return res.status(201).json({
          message: "created staff payroll",
          data: payroll,
        });
      }
     

    } else {
      return res.status(404).json({
        message: "couldn't get staff or create payroll",
      });
    }
  } catch (error: any) {
    return res.status(400).json({
      message: "couldn't create staff payroll",
      err: error.message,
      data: error,
    });
  }
};

export const fundWalletFromBank = async (req: Request, res: Response) => {
  try {
    const getUser = await adminAuth.findById(req.params.userId);
    const getWallet = await adminWalletModel.findById(req.params.walletId);

    const { amount, transactinRef } = req.body;
    await adminWalletModel.findByIdAndUpdate(getWallet?._id, {
      balance: getWallet?.balance + amount,
    });

    const createHisorySender = await adminTransactionHistory.create({
      message: `an amount of ${amount} has been credited to your wallet`,
      transactionType: "credit",
      transactionReference: transactinRef,
    });

    getUser?.transactionHistory?.push(
      new mongoose.Types.ObjectId(createHisorySender?._id)
    );

    res.status(200).json({
      message: "Wallet updated successfully",
    });
  } catch (err) {
    console.log("here", err);
    return res.status(404).json({
      message: "an error occurred",
      err,
    });
  }
};
