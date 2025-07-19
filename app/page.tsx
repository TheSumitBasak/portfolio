"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ArrowDown,
  Code,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { experiences, features, projects, skills } from "@/lib/values";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNotifications } from "reapop";
import { Scene } from "@/components/FloatingGeometry";

// Add after other imports
const RedditIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

function PortfolioContent() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  // keep a **stable** array of DOM refs
  const experienceRefs = useRef<(HTMLDivElement | null)[]>([]);

  const validationSchema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    subject: yup.string().required("Subject is required"),
    message: yup.string().required("Message is required"),
  });

  const { notify } = useNotifications();

  const [isLoading, setIsLoading] = useState(false);

  const formikForm = useFormik<{
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
  }>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/send-mail", {
          method: "POST",
          body: JSON.stringify({ data: values }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        notify("Thank you for your message!", {
          title: "Message Sent",
          status: "success",
        });
        formikForm.resetForm();
      } catch (err) {
        notify((err as Error).message, {
          title: "Error sending message",
          status: "error",
        });
      }
      setIsLoading(false);
      // handle form submission here
    },
  });

  // visibility flags for each experience item
  const [visibleExperiences, setVisibleExperiences] = useState<boolean[]>(() =>
    Array(experiences.length).fill(false)
  );

  // callback-ref creator
  const setExperienceRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      experienceRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number.parseInt(
            entry.target.getAttribute("data-index") || "0"
          );
          if (entry.isIntersecting) {
            setVisibleExperiences((prev) => {
              if (prev[index]) return prev; // already visible → nothing to update
              const next = [...prev];
              next[index] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -100px 0px" }
    );

    experienceRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Enable smooth scroll behavior globally
    document.documentElement.style.scrollBehavior = "smooth";

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    // Trigger animations on mount
    setTimeout(() => setIsVisible(true), 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Optionally clean up scroll behavior if needed
      // document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div
            className={`flex justify-between items-center ${
              isVisible ? "animate-fadeInUp" : "opacity-0"
            }`}
          >
            <div className="font-bold text-xl gradient-text">Sumit Basak</div>
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex space-x-8">
                <Link
                  href="#about"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300"
                >
                  About
                </Link>
                <Link
                  href="#projects"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300"
                >
                  Projects
                </Link>
                <Link
                  href="#contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300"
                >
                  Contact
                </Link>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        {/* Three.js Background */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="w-full h-full bg-transparent" />}>
            <Canvas
              camera={{ position: [0, 0, 8], fov: 75 }}
              style={{ background: "transparent" }}
            >
              <Scene variant="default" />
            </Canvas>
          </Suspense>
        </div>

        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-500/5 dark:bg-white/5 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-500/3 dark:bg-white/3 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-20 mt-20">
          <div
            className="mb-8"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <h1
              className={`text-5xl md:text-7xl font-bold mb-6 gradient-text ${
                isVisible ? "animate-fadeInUp" : "opacity-0"
              }`}
            >
              Sumit Basak
            </h1>
            <p
              className={`text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 ${
                isVisible ? "animate-fadeInUp stagger-1" : "opacity-0"
              }`}
            >
              Full-Stack Developer & UI/UX Enthusiast
            </p>
            <p
              className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 ${
                isVisible ? "animate-fadeInUp stagger-2" : "opacity-0"
              }`}
            >
              I craft digital experiences that blend <b>beautiful</b> design
              with robust <b>AI powered</b> functionality. Passionate about
              creating <b>scalable solutions</b> and intuitive user interfaces.
            </p>
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 ${
              isVisible ? "animate-fadeInUp stagger-3" : "opacity-0"
            }`}
          >
            <Button
              onClick={() => router.push("#projects")}
              size="lg"
              className="text-lg px-8 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 animate-glow"
            >
              View My Work
            </Button>
            <Button
              onClick={() => router.push("#contact")}
              variant="outline"
              size="lg"
              className="text-lg px-8 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all duration-300 bg-transparent"
            >
              <Mail className="mr-2 h-5 w-5" />
              Get In Touch
            </Button>
          </div>

          <div
            className={`animate-bounce ${
              isVisible ? "animate-fadeInUp stagger-4" : "opacity-0"
            }`}
          >
            <ArrowDown className="h-6 w-6 mx-auto text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Three.js Background for Features */}
        <div className="absolute inset-0 z-0 opacity-70">
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 4], fov: 75 }}
              style={{ background: "transparent" }}
            >
              <Scene variant="features" />
            </Canvas>
          </Suspense>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className={`bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 card-hover animate-scaleIn stagger-${
                  index + 1
                } transition-colors duration-300`}
              >
                <CardContent className="p-8 text-center">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-black dark:text-white" />
                  <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 relative overflow-hidden">
        {/* Three.js Background for About */}
        <div className="absolute inset-0 z-0 opacity-60">
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 4], fov: 75 }}
              style={{ background: "transparent" }}
            >
              <Scene variant="about" />
            </Canvas>
          </Suspense>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInLeft">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
                About Me
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
                With over 3 years of experience in software development, I
                specialize in building modern web applications using
                cutting-edge technologies. I'm passionate about clean code, user
                experience, and continuous learning.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
                When I'm not coding, you can find me exploring new technologies,
                contributing to open-source projects, or sharing knowledge with
                the developer community.
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 theme-hover transition-all duration-300 bg-transparent"
                >
                  <a
                    href="https://github.com/TheSumitBasak"
                    target="_blank"
                    title="GitHub profile"
                    className="flex items-center gap-1"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 theme-hover transition-all duration-300 bg-transparent"
                >
                  <a
                    href="https://www.linkedin.com/in/thesumitbasak"
                    target="_blank"
                    title="LinkedIn profile"
                    className="flex items-center gap-1"
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 theme-hover transition-all duration-300 bg-transparent"
                >
                  <a
                    href="https://x.com/TheSumitBasak"
                    target="_blank"
                    title="Twitter/X profile"
                    className="flex items-center gap-1"
                  >
                    <Twitter className="mr-2 h-4 w-4" />X
                  </a>
                </Button>
                {/* <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 theme-hover transition-all duration-300 bg-transparent"
                >
                  <RedditIcon />
                  <span className="ml-2">Reddit</span>
                </Button> */}
              </div>
            </div>

            <div className="relative animate-fadeInRight">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-500/10 dark:from-white/10 to-gray-500/5 dark:to-gray-500/10 p-8 animate-glow">
                <Image
                  src="/about-me.png"
                  alt="Sumit Basak"
                  width={400}
                  height={400}
                  className="rounded-xl object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="py-20 px-6 bg-gray-50/50 dark:bg-gray-900/50 relative overflow-hidden transition-colors duration-300"
      >
        {/* Three.js Background for Skills */}
        <div className="absolute inset-0 z-0 opacity-50">
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 4], fov: 75 }}
              style={{ background: "transparent" }}
            >
              <Scene variant="skills" />
            </Canvas>
          </Suspense>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text animate-fadeInUp">
            Skills & Technologies
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-full text-base text-gray-700 dark:text-gray-300 hover:bg-gray-500/10 dark:hover:bg-white/10 hover:border-gray-500/30 dark:hover:border-white/30 transition-all duration-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Three.js Background for Experience */}
        <div className="absolute inset-0 z-0 opacity-60">
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 4], fov: 75 }}
              style={{ background: "transparent" }}
            >
              <Scene variant="experience" />
            </Canvas>
          </Suspense>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 gradient-text animate-fadeInUp">
            Professional Experience
          </h2>

          <div className="relative timeline-line">
            <div className="space-y-16 md:space-y-24 md:pl-0 pl-10">
              {experiences.map((experience, index) => (
                <div
                  key={experience.title}
                  ref={setExperienceRef(index)}
                  data-index={index}
                  className={`experience-item ${
                    visibleExperiences[index] ? "visible" : ""
                  } relative`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Timeline Dot */}
                  <div
                    className={`timeline-dot ${
                      visibleExperiences[index] ? "active" : ""
                    }`}
                  />

                  <div
                    className={`grid md:grid-cols-2 gap-8 items-center ${
                      index % 2 === 0 ? "" : "md:grid-flow-col-dense"
                    }`}
                  >
                    {/* Content */}
                    <div
                      className={`space-y-6 ${
                        index % 2 === 0 ? "md:pr-12" : "md:pl-12 md:col-start-2"
                      }`}
                    >
                      <div className="bg-white/40 dark:bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-800 transition-colors duration-300">
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                          {experience.title}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
                          <span className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                            {experience.company}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full w-fit">
                            {experience.period}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {experience.description}
                        </p>
                      </div>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-gray-200/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-500/10 dark:hover:bg-white/10 hover:border-gray-500/30 dark:hover:border-white/30 transition-all duration-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Achievements */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          Key Achievements
                        </h4>
                        <ul className="space-y-1">
                          {experience.achievements.map(
                            (achievement, achievementIndex) => (
                              <li
                                key={achievementIndex}
                                className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2"
                              >
                                <span className="text-black dark:text-white mt-1.5 w-1 h-1 bg-black dark:bg-white rounded-full flex-shrink-0" />
                                {achievement}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Visual Element */}
                    <div
                      className={`${
                        index % 2 === 0 ? "md:pl-12" : "md:pr-12 md:col-start-1"
                      }`}
                    >
                      <div className="relative group hidden md:block">
                        <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-500/5 dark:from-white/5 to-gray-500/5 dark:to-gray-500/5 p-8 flex items-center justify-center backdrop-blur-sm border border-gray-200 dark:border-gray-800 transition-colors duration-300">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-500/10 dark:bg-white/10 rounded-full flex items-center justify-center group-hover:bg-gray-500/20 dark:group-hover:bg-white/20 transition-all duration-300">
                              <Code className="w-8 h-8 text-black dark:text-white" />
                            </div>
                            <div className="text-4xl font-bold text-gray-500/20 dark:text-white/20 group-hover:text-gray-500/40 dark:group-hover:text-white/40 transition-all duration-300">
                              {String(index + 1).padStart(2, "0")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 relative overflow-hidden">
        {/* Three.js Background for Projects */}
        <div className="absolute inset-0 z-0 opacity-50">
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 4], fov: 75 }}
              style={{ background: "transparent" }}
            >
              <Scene variant="projects" />
            </Canvas>
          </Suspense>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 gradient-text animate-fadeInUp">
            Featured Projects
          </h2>

          <div className="space-y-24">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } md:gap-12 gap-5 items-center animate-fadeInUp`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Project Image */}
                <div className="flex-1 relative group">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-500/5 dark:from-white/5 to-gray-500/5 dark:to-gray-500/5 p-1 backdrop-blur-sm border border-gray-200 dark:border-gray-800 transition-colors duration-300">
                    <a
                      href={project.github}
                      target="_blank"
                      title={`GitHub: ${project.title}`}
                      className="absolute inset-0 z-[100]"
                    ></a>
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105 rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Project Content */}
                <div className="flex-1 md:space-y-6 space-y-3">
                  <div className="bg-white/40 dark:bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-800 transition-colors duration-300">
                    <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-3">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={tech}
                        className="px-4 py-2 bg-gray-200/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500/10 dark:hover:bg-white/10 hover:border-gray-500/50 dark:hover:border-white/50 hover:text-black dark:hover:text-white transition-all duration-300 cursor-default backdrop-blur-sm"
                        style={{
                          animationDelay: `${index * 0.2 + techIndex * 0.1}s`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Project Links */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 theme-hover transition-all duration-300 bg-transparent group backdrop-blur-sm"
                    >
                      <Link
                        href={project.github}
                        title={`GitHub: ${project.title}`}
                      >
                        <Github className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                        View Code
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      asChild
                      className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 group animate-glow"
                    >
                      <Link
                        href={project.demo}
                        title={`Live Demo: ${project.title}`}
                      >
                        <ExternalLink className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                        Live Demo
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-6 bg-gray-50/50 dark:bg-gray-900/50 relative overflow-hidden transition-colors duration-300"
      >
        {/* Three.js Background for Contact */}
        <div className="absolute inset-0 z-0 opacity-70">
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 4], fov: 75 }}
              style={{ background: "transparent" }}
            >
              <Scene variant="contact" />
            </Canvas>
          </Suspense>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text animate-fadeInUp">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-fadeInUp stagger-1">
              I'm always interested in new opportunities and exciting projects.
              Whether you have a question or just want to say hi, feel free to
              reach out!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="animate-fadeInLeft">
              <Card className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-black dark:text-white">
                    Send me a message
                  </h3>
                  <form
                    onSubmit={formikForm.handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...formikForm.getFieldProps("firstName")}
                          type="text"
                          id="firstName"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-300"
                          placeholder="John"
                        />
                        {formikForm.touched.firstName &&
                          formikForm.errors.firstName && (
                            <p className="text-xs text-red-500 mt-1">
                              {formikForm.errors.firstName}
                            </p>
                          )}
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...formikForm.getFieldProps("lastName")}
                          id="lastName"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-300"
                          placeholder="Doe"
                        />
                        {formikForm.touched.lastName &&
                          formikForm.errors.lastName && (
                            <p className="text-xs text-red-500 mt-1">
                              {formikForm.errors.lastName}
                            </p>
                          )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...formikForm.getFieldProps("email")}
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-300"
                        placeholder="john.doe@example.com"
                      />
                      {formikForm.touched.email && formikForm.errors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {formikForm.errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="subject"
                        {...formikForm.getFieldProps("subject")}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-300 pr-2"
                      >
                        <option value="">Select a subject</option>
                        <option value="project">Project Inquiry</option>
                        <option value="collaboration">Collaboration</option>
                        <option value="job">Job Opportunity</option>
                        <option value="consultation">Consultation</option>
                        <option value="other">Other</option>
                      </select>
                      {formikForm.touched.subject &&
                        formikForm.errors.subject && (
                          <p className="text-xs text-red-500 mt-1">
                            {formikForm.errors.subject}
                          </p>
                        )}
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        {...formikForm.getFieldProps("message")}
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Tell me about your project or how I can help you..."
                      />
                      {formikForm.touched.message &&
                        formikForm.errors.message && (
                          <p className="text-xs text-red-500">
                            {formikForm.errors.message}
                          </p>
                        )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 animate-glow"
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      {isLoading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="animate-fadeInRight space-y-8">
              {/* Direct Contact */}
              <Card className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <CardContent className="md:p-8 p-4 py-8">
                  <h3 className="text-2xl font-bold mb-6 text-black dark:text-white">
                    Let's Connect
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-black dark:text-white" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Email
                        </p>
                        <a
                          href="mailto:sumitbasak2208@gmail.com"
                          className="text-lg font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                        >
                          sumitbasak2208@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <svg
                          className="h-6 w-6 text-black dark:text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Twitter
                        </p>
                        <a
                          href="https://x.com/TheSumitBasak"
                          target="_blank"
                          className="text-lg font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                        >
                          @TheSumitBasak
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <svg
                          className="h-6 w-6 text-black dark:text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          LinkedIn
                        </p>
                        <a
                          href="https://linkedin.com/in/TheSumitBasak"
                          target="_blank"
                          className="text-lg font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                        >
                          /in/TheSumitBasak
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Availability Status */}
              <Card className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="text-xl font-bold text-black dark:text-white">
                      Available for Work
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    I'm currently available for freelance projects and full-time
                    opportunities.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>• Response time: Within 24 hours</p>
                    <p>• Timezone: IST (UTC+5:30)</p>
                    <p>• Preferred contact: Email</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 gap-4">
                {/* <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 theme-hover transition-all duration-300 bg-transparent backdrop-blur-sm"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.017.001z" />
                  </svg>
                  Schedule Call
                </Button> */}

                <Button
                  variant="outline"
                  size="lg"
                  style={{ width: "100% !important" }}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 theme-hover transition-all duration-300 bg-transparent backdrop-blur-sm"
                >
                  <a
                    className="w-full inline-flex items-center justify-center"
                    href="https://github.com/TheSumitBasak"
                    target="_blank"
                  >
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View Resume
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            © 2025 Sumit Basak. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <a
                href="https://github.com/TheSumitBasak"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <a
                href="https://www.linkedin.com/in/thesumitbasak"
                target="_blank"
                title="LinkedIn profile"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <a
                href="https://x.com/TheSumitBasak"
                target="_blank"
                title="Twitter/X profile"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
            {/* <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <RedditIcon />
            </Button> */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <a
                href="mailto:sumitbasak2208@gmail/com"
                target="_blank"
                title="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Portfolio() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <PortfolioContent />
    </ThemeProvider>
  );
}
