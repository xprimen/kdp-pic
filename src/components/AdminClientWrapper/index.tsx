import React from "react";

interface Props {
  children: React.ReactNode;
}

function AdminClientWrapper({ children }: Props) {
  return (
    <div
      id="admin-main-content"
      className="my-0 mx-auto max-w-screen-sm bg-slate-50 min-h-screen"
    >
      {children}
    </div>
  );
}

export default AdminClientWrapper;
