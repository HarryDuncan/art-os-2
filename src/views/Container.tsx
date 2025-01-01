import { NavBar } from "components/nav-bar/NavBar";

export const Container = ({ children }) => {
  return (
    <div className="app-container">
      <NavBar />
      {children}
    </div>
  );
};
