"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePayRoll = exports.PayRoll2 = exports.fundWalletFromBank = exports.createPayRoll = exports.MakeTransfer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const adminAuth_1 = __importDefault(require("../../model/admin/adminAuth"));
const adminTransactionHistorys_1 = __importDefault(require("../../model/admin/admindashboard/adminTransactionHistorys"));
const adminWallets_1 = __importDefault(require("../../model/admin/admindashboard/adminWallets"));
const staffAuth_1 = __importDefault(require("../../model/staff/staffAuth"));
const stafftransactionHistorys_1 = __importDefault(require("../../model/staff/staffDashboard/stafftransactionHistorys"));
const StaffWallet_1 = __importDefault(require("../../model/staff/staffDashboard/StaffWallet"));
const StaffPayRoll_1 = __importDefault(require("../../model/staff/StaffPayroll/StaffPayRoll"));
//admin transfer from wallet to staff wallet for staffs with no plans
const MakeTransfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { walletNumber, amount, grossPay, netPay, taxes, medicals, pension } = req.body;
        const getDate = new Date().toDateString();
        const referenceGeneratedNumber = Math.floor(Math.random() * 67485753) + 243;
        //RECIEVER ACCOUNT
        const getReciever = yield staffAuth_1.default.findOne({ walletNumber });
        const getRecieverWallet = yield StaffWallet_1.default.findById(getReciever === null || getReciever === void 0 ? void 0 : getReciever._id);
        // SENDER ACCOUNT
        const getUser = yield adminAuth_1.default.findById(req.params.UserId);
        const getUserWallet = yield adminWallets_1.default.findById(getUser === null || getUser === void 0 ? void 0 : getUser._id);
        if (getUser && getReciever) {
            if (amount > (getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet.balance)) {
                return res.status(404).json({
                    message: "insufficent fund.",
                });
            }
            else {
                // undating the sender walllet
                yield adminWallets_1.default.findByIdAndUpdate(getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet._id, {
                    balance: (getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet.balance) - amount,
                    credit: 0,
                    debit: amount,
                });
                const createHisorySender = yield adminTransactionHistorys_1.default.create({
                    message: `you have sent ${amount} to ${getReciever === null || getReciever === void 0 ? void 0 : getReciever.yourName}`,
                    receiver: getReciever === null || getReciever === void 0 ? void 0 : getReciever.yourName,
                    transactionReference: referenceGeneratedNumber,
                    date: getDate,
                });
                (_a = getUser === null || getUser === void 0 ? void 0 : getUser.transactionHistory) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
                getUser === null || getUser === void 0 ? void 0 : getUser.save();
                // reciever wallet
                yield StaffWallet_1.default.findByIdAndUpdate(getRecieverWallet === null || getRecieverWallet === void 0 ? void 0 : getRecieverWallet._id, {
                    balance: (getRecieverWallet === null || getRecieverWallet === void 0 ? void 0 : getRecieverWallet.balance) + amount,
                    credit: amount,
                    debit: 0,
                });
                const createHisoryReciever = yield stafftransactionHistorys_1.default.create({
                    message: `an amount of ${amount} has been sent to you by ${getUser === null || getUser === void 0 ? void 0 : getUser.companyname}`,
                    transactionType: "credit",
                    receiver: getUser === null || getUser === void 0 ? void 0 : getUser.yourName,
                    transactionReference: referenceGeneratedNumber,
                });
                (_b = getReciever === null || getReciever === void 0 ? void 0 : getReciever.transactionHistory) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.default.Types.ObjectId(createHisoryReciever === null || createHisoryReciever === void 0 ? void 0 : createHisoryReciever._id));
                getReciever === null || getReciever === void 0 ? void 0 : getReciever.save();
            }
            return res.status(200).json({
                message: "Transaction successfull",
            });
        }
        else {
            return res.status(404).json({
                message: "Account not found",
            });
        }
    }
    catch (err) {
        return res.status(404).json({
            message: "an error occurred",
            err,
        });
    }
});
exports.MakeTransfer = MakeTransfer;
//create staff payroll
const createPayRoll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const { walletNumber, grossPay, netPay, taxes, medicals, pension, lectures, } = req.body;
        const expenses = taxes + medicals + pension;
        const pay = grossPay - expenses;
        const referenceGeneratedNumber = Math.floor(Math.random() * 67485753) + 243;
        // const getStaff = await staffAuth.findById(req.params.staffId);
        //RECIEVER ACCOUNT
        const getStaff = yield staffAuth_1.default.findOne({ walletNumber });
        const getStaffWallet = yield StaffWallet_1.default.findById(getStaff === null || getStaff === void 0 ? void 0 : getStaff._id);
        // SENDER ACCOUNT
        const getUser = yield adminAuth_1.default.findById(req.params.adminId);
        const getUserWallet = yield adminWallets_1.default.findById(getUser === null || getUser === void 0 ? void 0 : getUser._id);
        if (getStaff && getUser) {
            if (grossPay > (getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet.balance)) {
                if (expenses > grossPay) {
                    return res.status(400).json({
                        message: "a staff's expenses can't be more than his/her gross pay",
                    });
                }
            }
            else {
                const payroll = yield StaffPayRoll_1.default.create({
                    grossPay,
                    netPay: pay,
                    taxes,
                    pension,
                    medicals,
                    lectures,
                });
                // undating the sender walllet
                yield adminWallets_1.default.findByIdAndUpdate(getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet._id, {
                    balance: (getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet.balance) - grossPay,
                    credit: 0,
                    debit: grossPay,
                });
                const createHisorySender = yield adminTransactionHistorys_1.default.create({
                    message: `you have sent ${netPay} to ${getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName} after the deductions of ${expenses}`,
                    receiver: getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName,
                    transactionReference: referenceGeneratedNumber,
                    // date: getDate,
                });
                (_c = getUser === null || getUser === void 0 ? void 0 : getUser.transactionHistory) === null || _c === void 0 ? void 0 : _c.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
                getUser === null || getUser === void 0 ? void 0 : getUser.save();
                // reciever wallet
                yield StaffWallet_1.default.findByIdAndUpdate(getStaffWallet === null || getStaffWallet === void 0 ? void 0 : getStaffWallet._id, {
                    balance: (getStaffWallet === null || getStaffWallet === void 0 ? void 0 : getStaffWallet.balance) + netPay,
                    credit: netPay,
                    debit: 0,
                });
                const createHisoryReciever = yield stafftransactionHistorys_1.default.create({
                    message: `an amount of ${netPay} has been sent to you by ${getUser === null || getUser === void 0 ? void 0 : getUser.companyname}`,
                    transactionType: "credit",
                    receiver: getUser === null || getUser === void 0 ? void 0 : getUser.yourName,
                    transactionReference: referenceGeneratedNumber,
                });
                (_d = getStaff === null || getStaff === void 0 ? void 0 : getStaff.transactionHistory) === null || _d === void 0 ? void 0 : _d.push(new mongoose_1.default.Types.ObjectId(createHisoryReciever === null || createHisoryReciever === void 0 ? void 0 : createHisoryReciever._id));
                getStaff === null || getStaff === void 0 ? void 0 : getStaff.save();
                return res.status(201).json({
                    message: "created staff payroll",
                    data: payroll,
                });
            }
        }
        else {
            return res.status(404).json({
                message: "couldn't get staff or create payroll",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "couldn't create staff payroll",
            err: error.message,
            data: error,
        });
    }
});
exports.createPayRoll = createPayRoll;
const fundWalletFromBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const getUser = yield adminAuth_1.default.findById(req.params.userId);
        const getWallet = yield adminWallets_1.default.findById(req.params.walletId);
        const { amount, transactinRef } = req.body;
        yield adminWallets_1.default.findByIdAndUpdate(getWallet === null || getWallet === void 0 ? void 0 : getWallet._id, {
            balance: (getWallet === null || getWallet === void 0 ? void 0 : getWallet.balance) + amount,
        });
        const createHisorySender = yield adminTransactionHistorys_1.default.create({
            message: `an amount of ${amount} has been credited to your wallet`,
            transactionType: "credit",
            transactionReference: transactinRef,
        });
        (_e = getUser === null || getUser === void 0 ? void 0 : getUser.transactionHistory) === null || _e === void 0 ? void 0 : _e.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
        res.status(200).json({
            message: "Wallet updated successfully",
        });
    }
    catch (err) {
        console.log("here", err);
        return res.status(404).json({
            message: "an error occurred",
            err,
        });
    }
});
exports.fundWalletFromBank = fundWalletFromBank;
//create staff payroll method2
const PayRoll2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAdmin = yield adminAuth_1.default.findById(req.params.adminId);
        const dataFIle = yield adminAuth_1.default.findByIdAndUpdate(getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin._id, {
            $push: { payRoll: req.body },
        }, { new: true });
        dataFIle === null || dataFIle === void 0 ? void 0 : dataFIle.payRoll.sort((a, b) => a - b);
        return res.status(201).json({
            message: "created payroll",
            data: dataFIle === null || dataFIle === void 0 ? void 0 : dataFIle.payRoll,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "couldn't create staff payroll",
            err: error.message,
            data: error,
        });
    }
});
exports.PayRoll2 = PayRoll2;
const calculatePayRoll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    try {
        const { grossPay, expenses, netPay, walletNumber } = req.body;
        const getDate = new Date().toLocaleDateString();
        const getTime = new Date().toLocaleTimeString();
        //get admin details
        const getAdmin = yield adminAuth_1.default.findById(req.params.adminId);
        const getAdminWallet = yield adminWallets_1.default.findById(getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin._id);
        //get staff details
        const getStaff = yield staffAuth_1.default.findOne({ walletNumber });
        const getStaffWallet = yield StaffWallet_1.default.findById(getStaff === null || getStaff === void 0 ? void 0 : getStaff._id);
        const referenceGeneratedNumber = Math.floor(Math.random() * 67485753) + 243;
        const getPayRoll = getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.payRoll[0];
        let totalSum = 0;
        const keys = Object.keys(getPayRoll);
        for (let i = 0; i < keys.length; i++) {
            totalSum += getPayRoll[keys[i]];
        }
        console.log("Sum of values in the first object:", totalSum);
        const netpay = Number(grossPay - totalSum);
        console.log(`this is netpay ${netpay}`);
        console.log(`this is typeof netpay ${typeof (netpay)}`);
        if (getAdmin && getStaff) {
            if (grossPay > (getAdminWallet === null || getAdminWallet === void 0 ? void 0 : getAdminWallet.balance)) {
                return res.status(400).json({
                    message: "insufficient funds from admin wallet",
                });
            }
            else {
                const calculatePayRoll = yield StaffPayRoll_1.default.create({
                    grossPay,
                    expenses: totalSum,
                    netPay: netpay,
                });
                yield adminWallets_1.default.findByIdAndUpdate(getAdminWallet === null || getAdminWallet === void 0 ? void 0 : getAdminWallet._id, {
                    balance: (getAdminWallet === null || getAdminWallet === void 0 ? void 0 : getAdminWallet.balance) - grossPay,
                    credit: 0,
                    debit: grossPay,
                });
                console.log(`this is first balance : ${typeof (getAdminWallet === null || getAdminWallet === void 0 ? void 0 : getAdminWallet.balance)}`);
                const createHisorySender = yield adminTransactionHistorys_1.default.create({
                    message: `you have sent ${netpay} to ${getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName} after the deductions of ${expenses}....this is the grossPay ${grossPay}`,
                    receiver: getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName,
                    transactionReference: referenceGeneratedNumber,
                    date: `${getDate}_${getTime}`,
                    amount: netpay,
                    expenses: expenses
                });
                (_f = getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.transactionHistory) === null || _f === void 0 ? void 0 : _f.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
                getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.save();
                // reciever wallet
                yield StaffWallet_1.default.findByIdAndUpdate(getStaffWallet === null || getStaffWallet === void 0 ? void 0 : getStaffWallet._id, {
                    balance: Number((getStaffWallet === null || getStaffWallet === void 0 ? void 0 : getStaffWallet.balance) + netpay),
                    credit: netPay,
                    debit: 0,
                });
                console.log(`this is second balance : ${typeof (getStaffWallet === null || getStaffWallet === void 0 ? void 0 : getStaffWallet.balance)}`);
                const createHisoryReciever = yield stafftransactionHistorys_1.default.create({
                    message: `an amount of ${netpay} has been sent to you by ${getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.companyname}`,
                    transactionType: "credit",
                    receiver: getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.yourName,
                    transactionReference: referenceGeneratedNumber,
                    date: `${getDate}_${getTime}`,
                    amount: netpay
                });
                (_g = getStaff === null || getStaff === void 0 ? void 0 : getStaff.transactionHistory) === null || _g === void 0 ? void 0 : _g.push(new mongoose_1.default.Types.ObjectId(createHisoryReciever === null || createHisoryReciever === void 0 ? void 0 : createHisoryReciever._id));
                getStaff === null || getStaff === void 0 ? void 0 : getStaff.save();
                return res.status(201).json({
                    message: "created payroll",
                    data: calculatePayRoll,
                });
            }
        }
        else {
            return res.status(404).json({
                message: "admin or staff info not found",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "couldn't calculate staff payroll",
            err: error.message,
            data: error,
        });
    }
});
exports.calculatePayRoll = calculatePayRoll;
