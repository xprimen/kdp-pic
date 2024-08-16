import React from "react";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="container-sm max-w-screen-sm mx-auto flex h-screen justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
