"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";

export function Header() {
	const pathname = usePathname();
	const navigation = [
		{ name: "Início", href: "/" },
		{ name: "Gerar Imagem", href: "/generate" },
		{ name: "Histórico", href: "/history" },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<div className="mr-4 hidden md:flex">
					<Link href="/" className="mr-6 flex items-center space-x-2">
						<span className="hidden font-bold sm:inline-block">
							z-image-app
						</span>
					</Link>
					<nav className="flex items-center space-x-6 text-sm font-medium">
						{navigation.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"transition-colors hover:text-foreground/80",
									pathname === item.href ? "text-foreground" : "text-foreground/60"
								)}
							>
								{item.name}
							</Link>
						))}
					</nav>
				</div>
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
