"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Counter from "@/components/animation/Counter";

export default function HomeSection() {
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) setShowScrollTop(true);
      else setShowScrollTop(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const role = localStorage.getItem("Role") || sessionStorage.getItem("Role");

    setIsLoggedIn(!!token);

    if (!token) {
      router.push("/login");
    } else if (role === "Admin") {
      router.push("/dashboard");
    } else if (role === "Moderator") {
      router.push("/moderatordashboard");
    }
  }, [router]);

  const handleClick = () => {
    if (!isLoggedIn) {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex justify-between items-center border border-gray-200 p-4`}
          >
            <span className="text-black font-medium">Please login first</span>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ),
        {
          duration: 1000,
        }
      );
    } else {
      router.push("/programs");
    }
  };
  return (
    <section className="relative bg-white text-black font-poppins overflow-hidden mt-[-25px] md:mt-0">
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-[#74BF44] text-white w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center text-lg"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-10 sm:gap-16 py-5 px-4 mt-20">
        {/* Left Content */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-4xl xl:text-[60px] tracking-[2px] font-[600] leading-tight">
            <span className="text-[#74BF44]">Share Knowledge,</span>
            <br />
            <span className="font-[700]">Grow Together</span>
          </h1>

          <p className="mt-6 text-[#000000CC] font-[300] text-base sm:text-sm md:text-lg xl:text-xl leading-relaxed max-w-full md:max-w-xl tracking-[-0.2px]">
            A collaborative platform for Herald College students and faculty to
            share educational resources and build a comprehensive knowledge base
            that enhances learning for everyone.
          </p>

          <motion.button
            onClick={handleClick}
            className="mt-8 md:mt-12 w-[180px] h-[48px] bg-[#74BF44] rounded-lg flex items-center justify-center gap-2 hover:bg-[#A4C93A] transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-inter text-[18px] font-semibold leading-none">
              Get Started
            </span>
            <ArrowRight className="w-5 h-5 text-white" />
          </motion.button>

          <div className="border-t border-gray-300 mt-10 md:mt-20"></div>

          {/* Stats */}
          <motion.div
            className="flex gap-6 sm:gap-10 mt-6 md:mt-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="pr-6 sm:pr-8 border-r border-gray-300">
              <h3 className="text-2xl sm:text-3xl md:text-[34px] font-[700] text-[#74BF44]">
                <Counter to={2100} duration={2} suffix="+" />
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Active Students
              </p>
            </div>
            <div className="pr-6 sm:pr-8 border-r border-gray-300">
              <h3 className="text-2xl sm:text-3xl md:text-[34px] font-[700] text-[#FFC93F]">
                <Counter to={80} duration={2} suffix="+" />
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Faculty Mentors
              </p>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-[34px] font-[700] text-[#74BF44]">
                <Counter to={1000} duration={2} suffix="+" />
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Resources Shared
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex-1 justify-center relative hidden md:flex"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Image
            src="/imgs/ui/Students.svg"
            alt="Hero Illustration"
            width={1407}
            height={800}
            className="w-full h-auto rounded-lg"
          />

          <div className="absolute top-[-35px] right-[-20px]">
            <div
              className="bg-[#B0CB64BF] p-4 rounded-[15px] shadow-md cursor-pointer
               transition-transform duration-300 hover:scale-110 hover:-translate-y-2"
            >
              <Image
                src="/imgs/icons/emojione_handshake.svg"
                alt="Handshake Icon"
                width={84}
                height={84}
                className="w-16 h-16"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* SECOND SECTION */}
      <div className="container mx-auto py-20 md:py-40 px-4">
        {/* Heading */}
        <motion.h2
          className="text-2xl sm:text-3xl md:text-[45px] font-[600] tracking-[0.5px] leading-snug text-[#000000BF] text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Designed for smarter{" "}
          <span className="text-[#74BF44]">collaboration</span> <br />
          between students & educators <br /> at Herald College
        </motion.h2>

        <motion.p
          className="mt-6 text-[#000000CC] text-base sm:text-lg md:text-[20px] font-[300] max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Our platform combines the best of educational technology with
          intuitive design to create an environment where knowledge flows freely
          and learning thrives.
        </motion.p>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20 items-stretch mt-10 md:mt-19"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Card 1 */}
          <div
            className="bg-white p-8 rounded-xl border border-gray-300 transform transition-transform duration-300 hover:-translate-y-4 flex flex-col h-full"
            style={{ boxShadow: "2px 3px 4px 0 rgba(0, 0, 0, 0.10)" }}
          >
            <div className="w-14 h-14 flex items-center justify-center bg-[#74BF44] rounded-[12px]">
              <Image
                src="/imgs/icons/teacher icon.svg"
                alt="Teacher Icon"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <h3 className="mt-6 text-[24px] md:text-[31px] font-[600] tracking-[-0.3px]">
              Teacher Moderation
            </h3>
            <p className="mt-3 text-black text-base leading-relaxed font-[300]">
              Curated content with quality assurance from our experienced
              faculty members to maintain educational standards.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="bg-white p-8 rounded-xl border border-gray-300 transform transition-transform duration-300 hover:-translate-y-4 flex flex-col h-full"
            style={{ boxShadow: "2px 3px 4px 0 rgba(0, 0, 0, 0.10)" }}
          >
            <div className="w-14 h-14 flex items-center justify-center bg-[#FFC93F] rounded-[12px]">
              <Image
                src="/imgs/icons/Vector.svg"
                alt="Student Icon"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <h3 className="mt-6 text-[24px] md:text-[31px] font-[600] tracking-[-0.3px]">
              Student Contributions
            </h3>
            <p className="mt-3 text-black text-base leading-relaxed font-[300]">
              Empower students to share knowledge, collaborate on projects, and
              learn from peer experiences.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="bg-white p-8 rounded-xl border border-gray-300 transform transition-transform duration-300 hover:-translate-y-4 flex flex-col h-full"
            style={{ boxShadow: "2px 3px 4px 0 rgba(0, 0, 0, 0.10)" }}
          >
            <div className="w-14 h-14 flex items-center justify-center bg-[#74BF44] rounded-[12px]">
              <Image
                src="/imgs/icons/magnifying glass.svg"
                alt="Search Icon"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <h3 className="mt-6 text-[24px] md:text-[31px] font-[600] tracking-[-0.3px]">
              Tag-Based Discovery
            </h3>
            <p className="mt-3 text-black text-base leading-relaxed font-[300]">
              Smart categorization and tagging system makes finding relevant
              resources quick and intuitive.
            </p>
          </div>
        </motion.div>
      </div>

      {/* SHARE CONTENT SECTION */}
      <div className="container mx-auto bg-white text-center py-6 px-4">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-[40px] font-[600] tracking-[0.5px] text-[#000000BF]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Share Various Types of <span className="text-[#74BF44]">Content</span>
        </motion.h2>
        <motion.p
          className="mt-7 text-[#000000CC] text-base sm:text-lg md:text-[20px] font-[300] tracking-[-0.2px] max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          From video tutorials to research papers, discover educational content
          that helps the community thrive and grow together.
        </motion.p>

        {/* Top Features */}
        <motion.div
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-40 max-w-[1650px] mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Video Content */}
          <div
            className="bg-white p-8 rounded-[13px] border border-gray-200 transform transition-transform duration-300 hover:-translate-y-4"
            style={{ boxShadow: "2px 3px 4px 0 rgba(0, 0, 0, 0.10)" }}
          >
            <div className="w-18 h-18 flex items-center justify-center bg-[#F3F3F3] rounded-[13px] mx-auto">
              <Image
                src="/imgs/icons/video_icon.svg"
                alt="Video Icon"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <h3 className="mt-6 font-[600] text-[22px] md:text-[28px] tracking-[0.3px]">
              Video Content
            </h3>
            <p className="mt-5 text-[#000000B2] font-[400] tracking-[-0.2px] text-[16px] md:text-[18px] leading-relaxed">
              Share video tutorials, lectures, and recorded sessions that help
              the community learn.
            </p>
          </div>

          {/* Code Repositories */}
          <div
            className="bg-white p-8 rounded-[13px] border border-gray-200 transform transition-transform duration-300 hover:-translate-y-4"
            style={{ boxShadow: "2px 3px 4px 0 rgba(0, 0, 0, 0.10)" }}
          >
            <div className="w-18 h-18 flex items-center justify-center bg-[#F3F3F3] rounded-[13px] mx-auto">
              <Image
                src="/imgs/icons/code_icon.svg"
                alt="Code Icon"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <h3 className="mt-6 font-[600] text-[22px] md:text-[28px] tracking-[0.3px]">
              Code Repositories
            </h3>
            <p className="mt-5 text-[#000000B2] font-[400] tracking-[-0.2px] text-[16px] md:text-[18px] leading-relaxed">
              Share GitHub projects, code samples and programming resources.
            </p>
          </div>

          {/* Articles & Docs */}
          <div
            className="bg-white p-8 rounded-[13px] border border-gray-200 transform transition-transform duration-300 hover:-translate-y-4"
            style={{ boxShadow: "2px 3px 4px 0 rgba(0, 0, 0, 0.10)" }}
          >
            <div className="w-18 h-18 flex items-center justify-center bg-[#F3F3F3] rounded-[13px] mx-auto">
              <Image
                src="/imgs/icons/docs_icon.svg"
                alt="Docs Icon"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <h3 className="mt-6 font-[600] text-[22px] md:text-[28px] tracking-[0.3px]">
              Articles & Docs
            </h3>
            <p className="mt-5 text-[#000000B2] font-[400] tracking-[-0.2px] text-[16px] md:text-[18px] leading-relaxed">
              Comprehensive documentation, research papers, and knowledge
              articles.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-40 max-w-[1650px] mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Download Resources */}
          <div
            className="bg-white shadow-sm p-6 rounded-xl border border-gray-200 flex flex-col items-center transform transition-transform duration-300 hover:-translate-y-4"
            style={{ boxShadow: "2px 3px 4px 0 rgba(0, 0, 0, 0.10)" }}
          >
            <div className="w-14 h-14 flex items-center justify-center mb-2">
              <Image
                src="/imgs/icons/download_icon.svg"
                alt="Download Icon"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="text-2xl font-bold text-[#74BF44]">2.5k+</div>
            <p className="mt-2 text-gray-600 text-center">Download Resources</p>
          </div>

          {/* Share Knowledge */}
          <div
            className="bg-white shadow-sm p-6 rounded-xl border border-gray-200 flex flex-col items-center transform transition-transform duration-300 hover:-translate-y-4"
            style={{ boxShadow: "2px 3px 4px 0 rgba(0, 0, 0, 0.10)" }}
          >
            <div className="w-14 h-14 flex items-center justify-center mb-2">
              <Image
                src="/imgs/icons/share_icon.svg"
                alt="Share Icon"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="text-2xl font-bold text-[#74BF44]">1.2k+</div>
            <p className="mt-2 text-gray-600 text-center">Share Knowledge</p>
          </div>

          {/* Join Discussions */}
          <div
            className="bg-white shadow-sm p-6 rounded-xl border border-gray-200 flex flex-col items-center transform transition-transform duration-300 hover:-translate-y-4"
            style={{ boxShadow: "2px 3px 4px 0 rgba(0, 0, 0, 0.10)" }}
          >
            <div className="w-14 h-14 flex items-center justify-center mb-2">
              <Image
                src="/imgs/icons/discussion_icon.svg"
                alt="Discussion Icon"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="text-2xl font-bold text-[#74BF44]">800+</div>
            <p className="mt-2 text-gray-600 text-center">Join Discussions</p>
          </div>
        </motion.div>
      </div>

      {/* THIRD SECTION */}
      <motion.div
        className="bg-[#F9F9F9] text-center px-6 py-20 md:py-40"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
        viewport={{ once: true }}
      >
        {/* Heading */}
        <motion.h2
          className="text-2xl sm:text-3xl md:text-[40px] font-[500] text-[#000000BF]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Access Resources. Share Your Insights.
        </motion.h2>
        <motion.h2
          className="text-2xl sm:text-3xl md:text-[40px] font-[500] text-[#000000BF] mt-3"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <span className="text-[#74BF44]">Collaborate</span> with Peers.
        </motion.h2>

        {/* Paragraph */}
        <motion.p
          className="mt-6 text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Log in using your Herald email to access exclusive content, contribute
          your work, and grow with the learning community.
        </motion.p>

        {/* Features */}
        <motion.div
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-[1300px] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Peer Learning */}
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-[13px] border border-gray-200 w-[80px] h-[80px] flex items-center justify-center">
              <Image
                src="/imgs/icons/peer_learning_icon.svg"
                alt="Peer Learning Icon"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <h3 className="mt-6 text-[20px] md:text-[24px] font-[600] tracking-[0.3px] text-center">
              Peer Learning
            </h3>
            <p className="mt-2 text-[#000000B2] text-[16px] md:text-[18px] text-center font-[400] tracking-[-0.2px]">
              Learn from fellow students and share your expertise
            </p>
          </div>

          {/* Instant Access */}
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-[13px] border border-gray-200 w-[80px] h-[80px] flex items-center justify-center">
              <Image
                src="/imgs/icons/instant_access_icon.svg"
                alt="Instant Access Icon"
                width={25}
                height={25}
                className="object-contain"
              />
            </div>
            <h3 className="mt-6 text-[20px] md:text-[24px] font-[600] tracking-[0.3px] text-center">
              Instant Access
            </h3>
            <p className="mt-2 text-[#000000B2] text-[16px] md:text-[18px] text-center font-[400] tracking-[-0.2px]">
              Get immediate access to a wealth of educational resources
            </p>
          </div>

          {/* Community Support */}
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-[13px] border border-gray-200 w-[80px] h-[80px] flex items-center justify-center">
              <Image
                src="/imgs/icons/community_support_icon.svg"
                alt="Community Support Icon"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <h3 className="mt-6 text-[20px] md:text-[24px] font-[600] tracking-[0.3px] text-center">
              Community Support
            </h3>
            <p className="mt-2 text-[#000000B2] text-[16px] md:text-[18px] text-center font-[400] tracking-[-0.2px]">
              Join a supportive community of learners and educators
            </p>
          </div>
        </motion.div>

        {/* Login Section */}
        {isLoggedIn === false && (
          <motion.div
            className="mt-20 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
            }}
            viewport={{ once: true }}
          >
            <div
              className="p-10 w-full max-w-lg text-center rounded-[20px] border border-[#00000026]"
              style={{ boxShadow: "2px 3px 4px 0 rgba(0, 0, 0, 0.10)" }}
            >
              <h3 className="text-[22px] sm:text-[26px] font-[600] text-[#000000]">
                Ready to Get Started?
              </h3>
              <p className="mt-3 text-[#000000B2] text-[16px] sm:text-[18px] font-[400]">
                Join thousands of Herald College students and faculty already
                collaborating.
              </p>
              <div className="flex justify-center">
                <Link href="/login">
                  <button className="mt-6 bg-[#74BF44] hover:bg-[#66a93c] text-white font-[600] py-3 px-8 rounded-lg flex items-center justify-center gap-2 shadow-md transition duration-200">
                    Login with Herald Email
                    <ArrowRight size={20} />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
