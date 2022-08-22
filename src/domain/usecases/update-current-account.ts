import { AccountModel } from "../models";

export interface UpdateCurrentAccount {
  save: (accout: AccountModel) => Promise<void>
}
