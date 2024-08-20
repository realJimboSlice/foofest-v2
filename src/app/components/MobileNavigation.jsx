// src/components/NavBar/MobileNavigation.js
import { useState } from "react";
import NavLinks from "./NavLinks";
import { MdOutlineMenu, MdClose } from "react-icons/md";
import "../globals.css";

const MobileNavigation = () => {
  const [click, setClick] = useState(false);

  const Hamburger = (
    <MdOutlineMenu
      className="HamburgerMenu"
      size="75px"
      color="white"
      onClick={() => setClick(!click)}
    />
  );

  const Close = (
    <MdClose
      className="HamburgerMenu"
      size="75px"
      color="white"
      onClick={() => setClick(!click)}
    />
  );

  const closeMenu = () => setClick(false);

  return (
    <div className="MobileNavigation">
      {click ? Close : Hamburger}
      {click && <NavLinks isClicked={true} closeMenu={closeMenu} />}
    </div>
  );
};

export default MobileNavigation;
