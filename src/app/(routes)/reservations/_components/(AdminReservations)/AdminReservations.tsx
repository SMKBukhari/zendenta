import { User } from "@prisma/client";
import React from "react";

type Props = {
  user: User | null;
};

const AdminReservations = ({ user }: Props) => {
  return <div>AdminReservations</div>;
};

export default AdminReservations;
