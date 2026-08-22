'use client'

import { motion } from 'framer-motion'

interface SkillBadgeProps {
  name: string
}

export default function SkillBadge({ name }: SkillBadgeProps) {
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className="px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full border border-gray-200 dark:border-gray-600 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
    >
      {name}
    </motion.span>
  )
}