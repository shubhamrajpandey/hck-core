"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

interface CounterProps {
	from?: number;
	to: number;
	duration?: number;
	className?: string;
	suffix?: string;
}

export default function Counter({
	from = 0,
	to,
	duration = 2,
	className = "",
	suffix = "",
}: CounterProps) {
	const count = useMotionValue(from);
	const [display, setDisplay] = useState(from);

	useEffect(() => {
		const controls = animate(count, to, {
			duration,
			ease: "easeOut",
			onUpdate: (latest) => setDisplay(Math.floor(latest)),
		});
		return controls.stop;
	}, [count, to, duration]);

	return (
		<motion.span className={className}>
			{display}
			{suffix}
		</motion.span>
	);
}
