import NavLinks from "@/app/ui/nav-links";

function Navbar() {
  return (
    <nav className="bg-slate-600 text-white h-20 flex gap-10 justify-center items-center font-sans text-sm md:text-2xl">
        <NavLinks />
    </nav>
  )
}
export default Navbar