import { TCursor } from "src/shared/common/types/cursor.type";
import { MemberContract } from "./member.contract";

export class MemberPaginationContract{
  members: MemberContract[];
  previousCursor?: TCursor;
  limit: number;
}