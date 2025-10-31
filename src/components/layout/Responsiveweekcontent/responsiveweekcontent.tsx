"use client";

import { ReactNode, useEffect, useState } from "react";
import WeekDropdown from "@/components/dropdown/Resourceweekdropdown";
import ProgramsSlidebar from "@/components/layout/ProgramSlidebar/programsSlidebar";

export default function ResponsiveWeekSelector({
  children,
}: {
  children: ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768); 
    checkScreen();

    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <>
      {isMobile ? (
        <div className="p-4">
          <WeekDropdown />
          <div className="mt-4">{children}</div>
        </div>
      ) : (
        <ProgramsSlidebar>{children}</ProgramsSlidebar>
      )}
    </>
  );
}
