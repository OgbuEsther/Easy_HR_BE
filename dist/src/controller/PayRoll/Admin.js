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
exports.fundWalletFromBank = exports.createPayRoll = exports.MakeTransfer = void 0;
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
    var _c, _d, _e;
    try {
        const { walletNumber, grossPay, netPay, taxes, medicals, pension } = req.body;
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
                });
                yield ((_c = getStaff === null || getStaff === void 0 ? void 0 : getStaff.payRoll) === null || _c === void 0 ? void 0 : _c.push(new mongoose_1.default.Types.ObjectId(payroll === null || payroll === void 0 ? void 0 : payroll._id)));
                yield (getStaff === null || getStaff === void 0 ? void 0 : getStaff.save());
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
                (_d = getUser === null || getUser === void 0 ? void 0 : getUser.transactionHistory) === null || _d === void 0 ? void 0 : _d.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
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
                (_e = getStaff === null || getStaff === void 0 ? void 0 : getStaff.transactionHistory) === null || _e === void 0 ? void 0 : _e.push(new mongoose_1.default.Types.ObjectId(createHisoryReciever === null || createHisoryReciever === void 0 ? void 0 : createHisoryReciever._id));
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
    var _f;
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
        (_f = getUser === null || getUser === void 0 ? void 0 : getUser.transactionHistory) === null || _f === void 0 ? void 0 : _f.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
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