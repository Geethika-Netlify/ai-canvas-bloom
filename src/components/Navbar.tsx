
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { Home, BriefcaseIcon, FileText, Book, Award, Mail, SquareStack } from "lucide-react";
import { MenuBar } from "@/components/ui/glow-menu";

const menuItems = [
  {
    icon: Home,
    label: "Home",
    href: "#home",
    gradient: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(59,130,246,0.06) 50%, rgba(37,99,235,0) 100%)",
    iconColor: "text-sky-400",
  },
  {
    icon: SquareStack,
    label: "Projects",
    href: "#projects",
    gradient: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(147,51,234,0.06) 50%, rgba(126,34,206,0) 100%)",
    iconColor: "text-purple-500",
  },
  {
    icon: BriefcaseIcon,
    label: "Skills",
    href: "#expertise",
    gradient: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "text-green-500",
  },
  {
    icon: FileText,
    label: "Certifications",
    href: "#certificates",
    gradient: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500",
  },
  {
    icon: Book,
    label: "Education",
    href: "#education",
    gradient: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(219,39,119,0.06) 50%, rgba(190,24,93,0) 100%)",
    iconColor: "text-pink-500",
  },
  {
    icon: Award,
    label: "Experience",
    href: "#experience",
    gradient: "radial-gradient(circle, rgba(234,179,8,0.15) 0%, rgba(202,138,4,0.06) 50%, rgba(161,98,7,0) 100%)",
    iconColor: "text-yellow-500",
  },
  {
    icon: Mail,
    label: "Contact",
    href: "#contact",
    gradient: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)",
    iconColor: "text-red-500",
  }
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    const element = document.querySelector(
      menuItems.find((item) => item.label === label)?.href || ""
    );
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md shadow-md" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        <MenuBar
          items={menuItems}
          activeItem={activeItem}
          onItemClick={handleItemClick}
          className="bg-transparent border-none shadow-none"
        />
        <ThemeToggle />
      </div>
    </header>
  );
}
