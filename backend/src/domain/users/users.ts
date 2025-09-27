import { UUID } from "crypto";
import { Aggregate } from "../../shared/libs/ddd/aggregate";
import { RoleEnum } from "./enums/role.enum";
import { UpdateUserContract } from "./contracts/update-user.contract";

export class User extends Aggregate<UUID>{
  private _role: RoleEnum;
  private _name: string;
  private _bornYear: number;
  private _email: string;
  private _avatar: string;
  private _hashedPassword?: string;
  private constructor(id: UUID, role: RoleEnum, name: string, bornYear: number, email: string, avatar: string, hashedPassword?: string){
    super(id);
    this.setRole(role);
    this.setName(name);
    this.setBornYear(bornYear);
    this.setEmail(email);
    this.setAvatar(avatar);
    this.setPassword(hashedPassword);
  }

  static create(id: UUID, role: RoleEnum, name: string, bornYear: number, email: string, avatar: string, hashedPassword?: string): User{
    return new User(id, role, name, bornYear, email, avatar, hashedPassword);
  }

  update(contract: UpdateUserContract){
    if(contract.role){
      this.setRole(contract.role);
    }
    if(contract.name){
      this.setName(contract.name);
    }
    if(contract.bornYear){
      this.setBornYear(contract.bornYear);
    }
    // if(user.email){
    //   this.setEmail(user.email);
    // }
    if(contract.avatar){
      this.setAvatar(contract.avatar);
    }
  }

  get role(){
    return this._role;
  }

  get name(){
    return this._name;
  }

  get bornYear(){
    return this._bornYear;
  }

  get email(){
    return this._email;
  }

  get avatar(){
    return this._avatar;
  }

  get hashedPassword(){
    return this._hashedPassword;
  }

  setName(name: string){
    this._name = name;
  }

  setRole(role: RoleEnum){
    this._role = role;
  }

  setBornYear(bornYear: number){
    this._bornYear = bornYear;
  }

  setEmail(email: string){
    this._email = email;
  }

  setAvatar(avatar: string){
    this._avatar = avatar;
  }

  setPassword(hashedPassword: string){
    this._hashedPassword = hashedPassword;
  }
}