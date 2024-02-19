import { updateCustomerBalance } from "./customerSlice";

export const handleUpdateCustomerBalance = (dispatch, transactions, calculateBalance, res) => {
    const updatedTransaction = res;
    const updatedTransactionIndex = transactions.findIndex(transaction => transaction._id === updatedTransaction._id);
    if (updatedTransactionIndex !== -1) {
        transactions[updatedTransactionIndex] = updatedTransaction;
    }
    const newBalance = calculateBalance(transactions);
    const customerId = updatedTransaction.customer;
    dispatch(updateCustomerBalance({ _id: customerId, newBalance }));
};

export const handleAddCustomerBalance = (dispatch, transactions, calculateBalance, res) => {
    const updatedTransactions = [...transactions, res];
    const newBalance = calculateBalance(updatedTransactions);
    const customerId = res?.customer;
    dispatch(updateCustomerBalance({ _id: customerId, newBalance }));
};

export const handleDeleteCustomerBalance = (dispatch, transactions, calculateBalance, res) => {
    const updatedTransactions = transactions.filter(transaction => transaction?._id !== res?._id);
    const newBalance = calculateBalance(updatedTransactions);
    const customerId = res?.customer;
    dispatch(updateCustomerBalance({ _id: customerId, newBalance }));
};
