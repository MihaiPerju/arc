import AccountActions from "/imports/api/accountActions/collection";
import Comments from '/imports/api/comments/collection';
import Accounts from '/imports/api/accounts/collection';

export default class CommentService {
    static createComment({content, accountId, authorId}) {

        Comments.insert({content, accountId, authorId});
        const accountActionData = {
            userId: authorId,
            type: "comment"
        }
        const accountActionId = AccountActions.insert(accountActionData);
        Accounts.update(
            { _id: accountId },
            {
              $push: {
                actionsLinkData: accountActionId
              }
            }
          );
    }
}