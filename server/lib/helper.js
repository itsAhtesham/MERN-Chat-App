import { userSocketIDs } from "../app.js";

export const getOtherMember = (members, userId) => {
  return members.filter(
    (member) => member._id.toString() !== userId.toString(),
  );
};

export const getSockets = (users = []) =>
  users.map((user) => userSocketIDs.get(user.id.toString()));
