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
    const {
      walletNumber,
      grossPay,
      netPay,
      taxes,
      medicals,
      pension,
      lectures,
    } = req.body;

    const expenses = taxes + medicals + pension;

    const pay = grossPay - expenses;

    const referenceGeneratedNumber = Math.floor(Math.random() * 67485753) + 243;

    // const getStaff = await staffAuth.findById(req.params.staffId);

    //RECIEVER ACCOUNT
    const getStaff = await staffAuth.findOne({ walletNumber });
    const getStaffWallet = await staffWalletModel.findById(getStaff?._id);

    // SENDER ACCOUNT
    const getUser = await adminAuth.findById(req.params.adminId);
    const getUserWallet = await adminWalletModel.findById(getUser?._id);

    if (getStaff && getUser) {
      if (grossPay > getUserWallet?.balance!) {
        if (expenses > grossPay) {
          return res.status(400).json({
            message: "a staff's expenses can't be more than his/her gross pay",
          });
        }
      } else {
        const payroll = await payRollModel.create({
          grossPay,
          netPay: pay,
          taxes,
          pension,
          medicals,
          lectures,
        });

        // undating the sender walllet
        await adminWalletModel.findByIdAndUpdate(getUserWallet?._id, {
          balance: getUserWallet?.balance! - grossPay,
          credit: 0,
          debit: grossPay,
        });

        const createHisorySender = await adminTransactionHistory.create({
          message: `you have sent ${netPay} to ${getStaff?.yourName} after the deductions of ${expenses}`,
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
          balance: getStaffWallet?.balance! + netPay,
          credit: netPay,
          debit: 0,
        });

        const createHisoryReciever = await staffTransactionHistory.create({
          message: `an amount of ${netPay} has been sent to you by ${getUser?.companyname}`,
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

//create staff payroll method2

export const PayRoll2 = async (req: Request, res: Response) => {
  try {
    const getAdmin = await adminAuth.findById(req.params.adminId);

    const dataFIle = await adminAuth.findByIdAndUpdate(
      getAdmin?._id,
      {
        $push: { payRoll: req.body },
      },
      { new: true }
    );
    dataFIle?.payRoll.sort((a, b) => a - b);

    return res.status(201).json({
      message: "created payroll",
      data: dataFIle?.payRoll,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "couldn't create staff payroll",
      err: error.message,
      data: error,
    });
  }
};

export const calculatePayRoll = async (req: Request, res: Response) => {
  try {
    const { grossPay, expenses, netPay ,walletNumber } = req.body;

    const getDate = new Date().toLocaleDateString();
    const getTime = new Date().toLocaleTimeString();

    //get admin details
    const getAdmin = await adminAuth.findById(req.params.adminId);
    const getAdminWallet = await adminWalletModel.findById(getAdmin?._id);

    //get staff details
    const getStaff = await staffAuth.findOne({ walletNumber });
    const getStaffWallet = await staffWalletModel.findById(getStaff?._id);

    const referenceGeneratedNumber = Math.floor(Math.random() * 67485753) + 243;

    const getPayRoll = getAdmin?.payRoll![0];

    let totalSum = 0;

    const keys = Object.keys(getPayRoll!);
    for (let i = 0; i < keys.length; i++) {
      totalSum += getPayRoll![keys[i]];
    }
    console.log("Sum of values in the first object:", totalSum);

    const netpay = Number(grossPay - totalSum)
    console.log(`this is netpay ${netpay}`)
    console.log(`this is typeof netpay ${typeof(netpay)}`)

    if (getAdmin && getStaff) {
      if (grossPay > getAdminWallet?.balance!) {
        return res.status(400).json({
          message: "insufficient funds from admin wallet",
        });
      }else{
        const calculatePayRoll = await payRollModel.create({
          grossPay,
          expenses: totalSum,
          netPay: netpay,
        });

        await adminWalletModel.findByIdAndUpdate(getAdminWallet?._id, {
          balance: getAdminWallet?.balance! - grossPay,
          credit: 0,
          debit: grossPay,
        });
        console.log(`this is first balance : ${typeof(getAdminWallet?.balance!)}`)

        const createHisorySender = await adminTransactionHistory.create({
          message: `you have sent ${netpay} to ${getStaff?.yourName} after the deductions of ${expenses}....this is the grossPay ${grossPay}`,
          receiver: getStaff?.yourName,
          transactionReference: referenceGeneratedNumber,
          date : `${getDate}_${getTime}`,
          amount : netpay,
          expenses : expenses
        });
    
        getAdmin?.transactionHistory?.push(
          new mongoose.Types.ObjectId(createHisorySender?._id)
        );

        getAdmin?.save();

        
        // reciever wallet
        await staffWalletModel.findByIdAndUpdate(getStaffWallet?._id, {
          balance: Number(getStaffWallet?.balance! + netpay),
          credit: netPay,
          debit: 0,
        });
        console.log(`this is second balance : ${typeof(getStaffWallet?.balance!)}`)
        const createHisoryReciever = await staffTransactionHistory.create({
          message: `an amount of ${netpay} has been sent to you by ${getAdmin?.companyname}`,
          transactionType: "credit",
          receiver: getAdmin?.yourName,
          transactionReference: referenceGeneratedNumber,
          date : `${getDate}_${getTime}`,
          amount : netpay
        });

        getStaff?.transactionHistory?.push(
          new mongoose.Types.ObjectId(createHisoryReciever?._id)
        );
        getStaff?.save();

        return res.status(201).json({
          message: "created payroll",
          data: calculatePayRoll,
        });
      }
    } else {
      return res.status(404).json({
        message: "admin or staff info not found",
      });
    }

   
  } catch (error: any) {
    return res.status(400).json({
      message: "couldn't calculate staff payroll",
      err: error.message,
      data: error,
    });
  }
};
