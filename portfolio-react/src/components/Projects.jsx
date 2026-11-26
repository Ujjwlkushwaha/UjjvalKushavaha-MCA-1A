import SectionHeading from "./SectionHeading.jsx";
import ProjectCard from "./ProjectCard.jsx";
import { projects } from "../data/portfolio.js";

function Projects() {
  return (
    <section id="work" className="section projects-section">
      <div className="container">
        <SectionHeading
          label="01 / Selected work"
          before="A few things"
          highlight="I’ve built"
          subtitle="Small experiments and useful applications, made one thoughtful detail at a time."
        />
        <div className="grid grid-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
