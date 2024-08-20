import Link from "next/link";
import "../globals.css";

const NavLinks = ({ isClicked, closeMenu }) => {
  return (
    <nav className="NavLinks">
      <ul>
        <li>
          <Link href="/tickets" onClick={isClicked ? closeMenu : null}>
            TICKETS
          </Link>
        </li>
        <li>
          <Link href="/schedule" onClick={isClicked ? closeMenu : null}>
            PROGRAM
          </Link>
        </li>
        <li>
          <Link href="/bands" onClick={isClicked ? closeMenu : null}>
            LINE-UP
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavLinks;
