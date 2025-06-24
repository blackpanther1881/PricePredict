'use client'
import React, { useEffect, useState } from "react";
import { Header } from "@components/layout/header";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={"flex flex-col max-h-screen"} >
        <Header />
        <div className={"flex-1 max-w-[1440px] w-full mx-auto mt-20 px-4"}>
            {children}
        </div>
    </div>
  );
};
