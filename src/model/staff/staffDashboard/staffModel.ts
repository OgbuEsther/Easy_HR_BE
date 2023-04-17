export interface staffWalletProps {
  balance: number;

  credit: number;
  debit: number;
}

export interface plans {
  percentageRate : number;
  totalBal : number
  subscribe :boolean
}

export interface staffTransactionProps {
  message: string;
  receiver: string;
  date: string;
  transactionReference: number;
}



export interface PayRoll {
  grossPay : number;
  netPay: number;
  taxes:number;
  pension:number;
  medicals:number

}


export interface Attendance {
  date : string;
  clockIn : boolean;
  clockOut : boolean;
  message : string;
  time : string
  token : string
}

