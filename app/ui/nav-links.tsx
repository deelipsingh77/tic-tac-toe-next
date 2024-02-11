"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { title: 'Home', path: '/' },
    { title: 'Play', path: '/game' },
    { title: 'Leaderboard', path: '/leaderboard' },
    { title: 'About Us', path: '/about' }
]

function NavLinks() {
    const pathname = usePathname();
    return (
        <>
            {links.map((link, index) => (
                <Link
                    key={link.title}
                    href={link.path}
                    className={clsx("",
                        {
                            "text-white": pathname == link.path,
                            "text-slate-500": pathname != link.path
                        }
                    )}
                >{link.title}</Link >
            ))
            }
        </>
    )
}
export default NavLinks