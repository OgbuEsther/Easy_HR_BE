export interface staffWalletProps {
  balance: number;
  credit: number;
  debit: number;
}


export interface staffLeaveProps{
  title :string;
  startDate :string;
  numberOfDays :number;
  remainingDays :number;
  reason : string;
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
  amount: number;

}



export interface PayRoll {
  grossPay : number;
     expenses:[]
  netPay: number;
 

}


export interface Attendance {
  date : string;
  clockIn : boolean;
  clockOut : boolean;
  message : string;
  time : string
  latitude : string
  token : string
  longitude : string
 
  nameOfStaff : string
}


export interface staffPerformanceProps {
  ratings : number
}