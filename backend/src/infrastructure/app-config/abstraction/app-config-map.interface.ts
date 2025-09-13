import { AppConfigEnum } from "../enums/app-config.enum";
import { IApplication } from "./application.interface";
import { IDatabase } from "./database.interface";
import { IEncryption } from "./encryption.interface";
import { IHashing } from "./hashing.interface";

export interface AppConfigMap {
  [AppConfigEnum.APPLICATION]: IApplication;
  [AppConfigEnum.DATABASE]: IDatabase;
  [AppConfigEnum.ENCRYPTION]: IEncryption;
  [AppConfigEnum.HASHING]: IHashing;
}
