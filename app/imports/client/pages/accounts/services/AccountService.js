export default class AccountService {
  static containsAccount(arr, account) {
    for (let i in arr) {
      const currAccount = arr[i];
      if (JSON.stringify(currAccount) == JSON.stringify(account)) {
        return true;
      }
    }
    return false;
  }
}
