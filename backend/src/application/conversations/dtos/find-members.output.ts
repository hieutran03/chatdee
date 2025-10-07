import { CursorBasedPageDto } from "src/shared/common/dtos/cursor-based-page.dto";
import { MemberOutput } from "./member.output";
import { MemberPaginationContract } from "src/domain/conversations/contracts/member-pagination.contract";

export class FindMembersOutput extends CursorBasedPageDto<MemberOutput>{
  constructor(paginationContract: MemberPaginationContract){
    const membersOutput = paginationContract.members.map(m => new MemberOutput(m));
    super(
      membersOutput,
      paginationContract.limit,
      paginationContract.previousCursor,
    );
  }

}