import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full bg-blue-400 flex flex-row items-center justify-between px-3 py-1">
      <span className="text-white text-[30px]!">Sancties</span>
      <MenuOptions />
    </header>
  );
};

const MenuOptions = () => {
  return (
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
    </nav>
  );
};

export default Header;
