import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import writeup1 from "./assets/ace.jpg";
import writeup2 from "./assets/hackmit.png";
import writeup3 from "./assets/mmspace.gif";

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, filter: "blur(8px)", y: 15 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] as any },
  },
};

const App = () => {
  const writeupCards = [
    {
      title: "Defeating Anticheat Expert",
      src: writeup1,
      href: "/writeups/anticheat",
    },
    {
      title: "HackMIT 2024",
      src: writeup2,
    },
    {
      title: "Mapping Windows Memory Regions",
      src: writeup3,
    },
  ];

  const sections = [
    <header key="header" className="mb-8">
      <h1 className="font-literata text-[20px] font-medium tracking-tight">
        Riley Thoft-Brown
      </h1>
    </header>,

    <section
      key="bio"
      className="font-literata text-[14px] leading-[1.2] font-medium text-black mb-10"
    >
      <p className="mb-5">
        Security engineer specializing in reverse engineering, kernel internals, and vulnerability research. CIS student at Wentworth Institute of Technology.
      </p>
      <p>
        Currently, a software engineering intern for <img src="/logic.png" alt="Logic" className="inline h-[1em] align-baseline" /> Logic Robotics.
      </p>
    </section>,

    <hr key="divider" className="border-black my-10" />,

    <div
      key="grid"
      className="grid grid-cols-2 gap-12 font-literata text-[14px] leading-[1.2] font-medium tracking-tight"
    >
      <section>
        <div className="flex justify-between mb-2">
          <h2 className="text-black text-[14px] tracking-tight">Contact</h2>
          <span className="text-black">[ 1 ]</span>
        </div>
        <ul className="space-y-[2px]">
          {[
            { label: "• Twitter", href: "https://x.com/rjtb123" },
            { label: "• Mail", href: "mailto:rileythoftbrown@gmail.com" },
            {
              label: "• LinkedIn",
              href: "https://www.linkedin.com/in/riley-thoft-brown-75b49a388/",
            },
            { label: "• GitHub", href: "https://github.com/rjtbdev" },
          ].map((item, i) => (
            <li key={i} className="flex justify-between">
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-70 transition"
              >
                {item.label}
              </a>
              <span>↗</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex justify-between mb-2">
          <h2 className="text-black font-medium text-[14px] tracking-tight">
            Projects
          </h2>
          <span className="text-black">[ 2 ]</span>
        </div>
        <ul className="space-y-[1px]">
          {[
            {
              color: "from-[#2f3e57] to-[#0c1f3f]",
              name: "Hypervisor Development",
              year: "2025-",
            },
            {
              color: "from-[#b1c8e8] to-[#86ade3]",
              name: "Solana Wallet Tracker",
              year: "2025",
            },
            {
              color: "from-[#566481] to-[#374f81]",
              name: "IL2CPP Dumper",
              year: "2024",
            },
            {
              color: "from-[#566481] to-[#e3f2fa]",
              name: "Kernel Reverse Engineering",
              year: "2022–25",
            },
          ].map((proj, i) => (
            <li key={i} className="flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 bg-gradient-to-br ${proj.color}`} />
                <span>{proj.name}</span>
              </span>
              <span className="w-15 text-right">{proj.year}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>,

    <section
      key="skills"
      className="mt-10 font-literata text-[14px] leading-[1.2] font-medium"
    >
      <div className="flex justify-between mb-2">
        <h2 className="text-black font-medium text-[14px] tracking-tight">
          Skills
        </h2>
        <span className="text-black">[ 3 ]</span>
      </div>
      <p>
        C++, C#, Java, Go, Typescript, Python, IDA Pro, PostgreSQL, Git, Linux
      </p>
    </section>,

    <section
      key="writeups"
      className="mt-10 font-literata text-[14px] leading-[1.2] font-medium"
    >
      <div className="flex justify-between mb-3">
        <h2 className="text-black font-medium text-[14px] tracking-tight">
          Writeups
        </h2>
        <span className="text-black">[ 4 ]</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {writeupCards.map((w, i) =>
          w.href ? (
            <Link
              key={i}
              to={w.href}
              className="group flex flex-col border border-black/20 rounded-md overflow-hidden hover:border-black/50 transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={w.src}
                  alt={w.title}
                  className="object-cover w-full aspect-[26/9] transition-transform duration-500 group-hover:scale-[1.05] grayscale-[25%]"
                />
              </div>
              <div className="p-3">
                <h3 className="text-[14px] mb-[2px] font-medium tracking-tight">
                  {w.title}
                </h3>
                <p className="text-[13.5px] opacity-80">Read analysis →</p>
              </div>
            </Link>
          ) : (
            <div
              key={i}
              className="group flex flex-col border border-black/20 rounded-md overflow-hidden opacity-80"
            >
              <div className="relative overflow-hidden">
                <img
                  src={w.src}
                  alt={w.title}
                  className="object-cover w-full aspect-[26/9] grayscale-[25%]"
                />
              </div>
              <div className="p-3">
                <h3 className="text-[14px] mb-[2px] font-medium tracking-tight">
                  {w.title}
                </h3>
                <p className="text-[13.5px] opacity-50">Coming soon</p>
              </div>
            </div>
          )
        )}
      </div>
    </section>,
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] as any }}
      className="max-w-2xl mx-auto px-6 py-15 font-literata text-[14px] leading-[1.2] tracking-tight text-black bg-white overflow-hidden"
    >
      <motion.div variants={container} initial="hidden" animate="visible">
        {sections.map((section, i) => (
          <motion.div key={i} variants={item}>
            {section}
          </motion.div>
        ))}
      </motion.div>
    </motion.main>
  );
};

export default App;
