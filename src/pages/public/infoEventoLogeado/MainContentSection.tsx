import React from "react";
import { Header } from "../../../components/layout/Header";

interface MainContentSectionProps {
  isLoggedIn: boolean;
}

export const MainContentSection = ({ isLoggedIn }: MainContentSectionProps): JSX.Element => {
  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
    </>
  );
};
