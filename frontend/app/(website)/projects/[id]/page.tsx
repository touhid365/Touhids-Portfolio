"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaGithub,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaClock,
  FaImage,
  FaCode,
  FaStar,
} from "react-icons/fa";
import { BsListCheck } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import { MdOutlineScreenshot } from "react-icons/md";

interface Project {
  id: string;
  title: string;
  description: string;
  features: string[];
  techStack: string[];
  imageUrl: string;
  screenshots?: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  related?: Project[];
}

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${apiUrl}/projects/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Project not found");
          }
          throw new Error("Failed to fetch project");
        }

        const data = await response.json();
        setProject(data);
        if (data.screenshots && data.screenshots.length > 0) {
          setSelectedImage(data.screenshots[0]);
        } else if (data.imageUrl) {
          setSelectedImage(data.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load project",
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || "Project not found"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/#projects"
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/#projects"
          className="inline-flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Projects
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Hero Image */}
          <div className="relative h-64 md:h-96 bg-gray-200 dark:bg-gray-700">
            {project.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                priority
                quality={95}
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <FaCode className="text-blue-500" size={48} />
              </div>
            )}
            {project.featured && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2">
                <FaStar />
                Featured
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {project.title}
              </h1>
              <div className="flex gap-3">
                {project.liveUrl && project.liveUrl !== "#" && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaExternalLinkAlt size={16} />
                    Live Demo
                  </a>
                )}
                {project.githubUrl && project.githubUrl !== "#" && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    <FaGithub size={18} />
                    GitHub
                  </a>
                )}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <HiOutlineCode className="text-blue-500" />
                Technologies Used
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Description with HTML Support */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                About This Project
              </h2>
              <div
                className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-h1:text-3xl prose-h1:font-bold prose-h1:mt-6 prose-h1:mb-4
                prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-5 prose-h2:mb-3
                prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:mb-4 prose-p:leading-relaxed
                prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:mb-1.5
                prose-a:text-blue-500 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-100 dark:prose-pre:bg-gray-700 prose-pre:p-4 prose-pre:rounded-lg
              "
              >
                <div
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </div>
            </div>

            {/* Features Section */}
            {project.features && project.features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BsListCheck className="text-purple-500" />
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30"
                    >
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Screenshots Section */}
            {project.screenshots && project.screenshots.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MdOutlineScreenshot className="text-blue-500" size={18} />
                  Screenshots
                </h2>

                {/* Main Screenshot Display */}
                <div className="relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden mb-4 aspect-video">
                  {selectedImage && (
                    <Image
                      src={selectedImage}
                      alt={`${project.title} screenshot`}
                      fill
                      className="object-contain"
                      quality={90}
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  )}
                </div>

                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {project.screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(screenshot)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                        selectedImage === screenshot
                          ? "border-blue-500 shadow-lg"
                          : "border-transparent hover:border-gray-400"
                      }`}
                    >
                      <Image
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index < 2}
                        quality={85}
                        sizes="(max-width: 768px) 25vw, 150px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Project Metadata */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">
                    Created:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">
                    Last Updated:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {new Date(project.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Projects */}
        {project.related && project.related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.related.map((relatedProject) => (
                <Link
                  key={relatedProject.id}
                  href={`/projects/${relatedProject.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-40 bg-gray-200 dark:bg-gray-700">
                    {relatedProject.imageUrl ? (
                      <Image
                        src={relatedProject.imageUrl}
                        alt={relatedProject.title}
                        fill
                        className="object-cover"
                        quality={80}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        <FaCode className="text-blue-500" size={32} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {relatedProject.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {relatedProject.description?.replace(/<[^>]*>/g, "") ||
                        ""}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {relatedProject.techStack.slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {relatedProject.techStack.length > 2 && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                          +{relatedProject.techStack.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}