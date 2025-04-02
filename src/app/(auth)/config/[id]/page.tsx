import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";
import ConfigPageComponent from "./_components/ConfigPage";

const ConfigPage = async ({ params }: { params: { id: string } }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!user || user.role !== "ADMIN") {
    return redirect("/sign-in");
  }

  if (user.clinicId !== null) {
    return redirect("/sign-in");
  }
  return (
    <div>
      <ConfigPageComponent id={user.id} />
    </div>
  );
};

export default ConfigPage;
