export interface adminWalletProps {
  balance: number;
  credit: number;
  debit: number;
}

export interface adminTransactionProps {
  message: string;
  receiver: string;
  date: string;
  transactionReference: number;
}

export interface adminAttendance{
  setToken : string;
  lateness : string;
  absent : string;
  
}

// export interface PayRoll {
//   grossPay : number;
//   netPay: number;
//   taxes:number;
//   pension:number;
//   medicals:number

// }