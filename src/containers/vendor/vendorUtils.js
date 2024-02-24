import { updateVendorBalance } from "./vendorSlice"; // Change import statement

export const handleUpdateVendorBalance = (dispatch, transactions, calculateBalance, res) => { // Change function name
    const updatedTransaction = res;
    const updatedTransactionIndex = transactions.findIndex(transaction => transaction._id === updatedTransaction._id);
    if (updatedTransactionIndex !== -1) {
        transactions[updatedTransactionIndex] = updatedTransaction;
    }
    const newBalance = calculateBalance(transactions);
    const vendorId = updatedTransaction.vendor; // Change variable name
    dispatch(updateVendorBalance({ _id: vendorId, newBalance })); // Change action name and variable name
};

export const handleAddVendorBalance = (dispatch, transactions, calculateBalance, res) => { // Change function name
    const updatedTransactions = [...transactions, res];
    const newBalance = calculateBalance(updatedTransactions);
    const vendorId = res?.vendor; // Change variable name
    dispatch(updateVendorBalance({ _id: vendorId, newBalance })); // Change action name and variable name
};

export const handleDeleteVendorBalance = (dispatch, transactions, calculateBalance, res) => { // Change function name
    const updatedTransactions = transactions.filter(transaction => transaction?._id !== res?._id);
    const newBalance = calculateBalance(updatedTransactions);
    const vendorId = res?.vendor; // Change variable name
    dispatch(updateVendorBalance({ _id: vendorId, newBalance })); // Change action name and variable name
};
