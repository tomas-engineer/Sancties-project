import Link from "next/link";

interface Props {
  target: string;
}

const FloatingButton = ({ target }: Props) => {
  return (
    <Link
      href={target}
      className="fixed flex items-center justify-content-center right-8 bottom-14 bg-blue-300 border! border-blue-400 text-white w-12 h-12 rounded-full cursor-pointer no-underline!"
    >
      <span className="leading-none text-[1.75rem]!">+</span>
    </Link>
  );
};

export default FloatingButton;
