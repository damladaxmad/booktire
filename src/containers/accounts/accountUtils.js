import { updateAccountBalance } from "./accountSlice";  // Import the account balance update action

export const handleUpdateAccountBalance = (dispatch, transactions, calculateBalance, res) => {
    const updatedTransaction = res;
    const updatedTransactionIndex = transactions.findIndex(transaction => transaction._id === updatedTransaction._id);
    if (updatedTransactionIndex !== -1) {
        transactions[updatedTransactionIndex] = updatedTransaction;
    }
    const newBalance = calculateBalance(transactions);
    const accountId = updatedTransaction.account;  
    console.log(accountId)
    dispatch(updateAccountBalance({ _id: accountId, newBalance }));
};

export const handleAddAccountBalance = (dispatch, transactions, calculateBalance, res) => {
    const updatedTransactions = [...transactions, res];
    const newBalance = calculateBalance(updatedTransactions);
    const accountId = res?.account;  
    dispatch(updateAccountBalance({ _id: accountId, newBalance }));
};

export const handleDeleteAccountBalance = (dispatch, transactions, calculateBalance, res) => {
    const updatedTransactions = transactions.filter(transaction => transaction?._id !== res?._id);
    const newBalance = calculateBalance(updatedTransactions);
    const accountId = res?.account;  // Use accountId instead of customerId
    dispatch(updateAccountBalance({ _id: accountId, newBalance }));
};
