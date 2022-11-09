/* eslint-disable no-case-declarations */
export default function bankAccountsReducer(bankAccounts, action) {
  switch (action.type) {
    case 'setBankAccounts':
      return action.payload
    case 'addBankAccount':
      const newBankAccounts = [...bankAccounts]
      const checkItem = bankAccounts.filter((x) => x.id === action.payload.id)
      if (!Array.isArray(checkItem) || !checkItem.length) newBankAccounts.push(action.payload)
      return newBankAccounts
    case 'updateBankAccount':
      const updatedAccount = action.payload
      const updatedBankAccounts = bankAccounts.filter((b) => b.id !== updatedAccount.id).concat(updatedAccount)
      return updatedBankAccounts
    case 'removeBankAccount':
      const id = action.payload
      const filteredBankAccounts = bankAccounts.filter((b) => b.id !== id)
      return filteredBankAccounts
    case 'resetBankAccounts':
      return []
    default:
      return bankAccounts
  }
}
