"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
type property = {
  children: React.ReactNode;
};

export default function PageAnimation(props: property) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {props.children}
    </motion.div>
  );
}
