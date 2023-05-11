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
  amount: number;
  expenses: number;
  
}

export interface adminLeaveProps{
  title : string;
  days : number
}

export interface adminAttendance{
  setToken : string;
  viewStaffAttendance :{}[]
 

  // lateness : string;
  // absent : string;
}

export interface milestoneGenerator {
  ratings : {}[]
  mileStone : string
}


export interface rateMe {
  adminScore : number;
  staffScore : number
  date : string;
  yourName : string
  gradeA :{}[]
  gradeB :{}[]
  gradeC :{}[]
  gradeD :{}[]

}

export interface grades {
  score : number,
  grade : string
}

// export interface PayRoll {
//   grossPay : number;
//   netPay: number;
//   taxes:number;
//   pension:number;
//   medicals:number

// }

