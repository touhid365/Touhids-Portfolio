"use client";

import { motion } from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaGit,
  FaDocker,
  FaAws,
  FaFigma,
  FaPython,
  FaBrain,
  FaDatabase,
  FaCloud,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiExpress,
  SiPostgresql,
  SiMongodb,
  SiPrisma,
  SiVercel,
  SiTensorflow,
  SiPytorch,
  SiMysql,
  SiPhp,
  SiRender,
} from "react-icons/si";
import { TbBrandOpenai, TbRobot, TbCloudComputing } from "react-icons/tb";
import { BsRobot } from "react-icons/bs";
import { GiArtificialIntelligence, GiBrain } from "react-icons/gi";
import { MdCloud } from "react-icons/md";
import { SiNgrok } from "react-icons/si";

const skills = {
  frontend: [
    { name: "React", icon: FaReact, color: "#61DAFB" },
    { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    { name: "Framer Motion", icon: SiFramer, color: "#0055FF" },
    { name: "PHP", icon: SiPhp, color: "#777BB4" },
  ],
  backend: [
    { name: "Node.js", icon: FaNodeJs, color: "#339933" },
    { name: "Express.js", icon: SiExpress, color: "#000000" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "MySQL", icon: SiMysql, color: "#4479A1" },
    { name: "Prisma", icon: SiPrisma, color: "#2D3748" },
  ],
  ai: [
    { name: "OpenAI", icon: TbBrandOpenai, color: "#412991" },
    { name: "LLM Integration", icon: BsRobot, color: "#7C3AED" },
    { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" },
    { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C" },
    { name: "AI Agents", icon: FaBrain, color: "#E53E3E" },
    { name: "VP AI", icon: GiArtificialIntelligence, color: "#6C2BD9" },
    { name: "Machine Learning", icon: GiBrain, color: "#00A86B" },
  ],
  tools: [
    { name: "Git", icon: FaGit, color: "#F05032" },
    { name: "Docker", icon: FaDocker, color: "#2496ED" },
    { name: "AWS", icon: FaAws, color: "#FF9900" },
    { name: "Vercel", icon: SiVercel, color: "#000000" },
    { name: "Render", icon: SiRender, color: "#46E3B7" },
    { name: "Ngrok", icon: SiNgrok, color: "#1F1F1F" },
    { name: "Figma", icon: FaFigma, color: "#F24E1E" },
  ],
};

// SkillBadge component with original colors
function SkillBadge({ name, icon: Icon, color }: { name: string; icon: any; color: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
      <Icon className="w-4 h-4" style={{ color }} />
      {name}
    </span>
  );
}

export default function About() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            About Me
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto mt-4"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Who I Am
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              I'm a passionate Full Stack Developer with hands-on experience in
              building modern web applications. I specialize in creating
              responsive, high-performance, and user-friendly solutions using
              the latest technologies.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              My journey into web development began with a curiosity about how
              websites work, which gradually evolved into a career where I
              transform complex problems into elegant, scalable solutions. I'm
              committed to writing clean, maintainable code and delivering
              exceptional user experiences.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              With expertise spanning from frontend to AI/ML, I enjoy exploring
              cutting-edge technologies and integrating them into practical
              applications that solve real-world problems.
            </p>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Skills & Technologies
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Frontend
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.frontend.map((skill) => (
                    <SkillBadge
                      key={skill.name}
                      name={skill.name}
                      icon={skill.icon}
                      color={skill.color}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Backend & Databases
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.backend.map((skill) => (
                    <SkillBadge
                      key={skill.name}
                      name={skill.name}
                      icon={skill.icon}
                      color={skill.color}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  AI & Machine Learning
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.ai.map((skill) => (
                    <SkillBadge
                      key={skill.name}
                      name={skill.name}
                      icon={skill.icon}
                      color={skill.color}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Tools & DevOps
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((skill) => (
                    <SkillBadge
                      key={skill.name}
                      name={skill.name}
                      icon={skill.icon}
                      color={skill.color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}