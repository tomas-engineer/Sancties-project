/* Alles van Tomas */
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-blue-400 flex flex-row items-center justify-between px-3">
      <nav className="flex flex-row items-center gap-3">
        <Link className="link-light link-opacity-75-hover" href={"/"}>
          Home
        </Link>
        <Link className="link-light link-opacity-75-hover" href={"/leerlingen"}>
          Leerlingen
        </Link>
        <Link className="link-light link-opacity-75-hover" href={"/sancties"}>
          Sancties
        </Link>
        <Link className="link-light link-opacity-75-hover" href={"/rad"}>
          Rad
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
