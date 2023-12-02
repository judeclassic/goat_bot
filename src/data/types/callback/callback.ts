interface ICallback {
    transactionHash: string;
    wallet: string;
    transactionType: string;
    amount: number;
  }
  
  export default ICallback;