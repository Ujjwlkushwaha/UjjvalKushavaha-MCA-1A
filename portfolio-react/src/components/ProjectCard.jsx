import Icon from "./Icon.jsx";
import Reveal from "./Reveal.jsx";

function ProjectCard({ project, index }) {
  return (
    <Reveal as="article" className="card project-card" delay={index * 0.07}>
      <div className="project-image">
        <img src={project.image} alt={project.imageAlt} loading="lazy" decoding="async" />
        <span className="project-type">{project.type}</span>
      </div>
      <div className="project-card-content">
        <span className="project-index">PROJECT / {String(index + 1).padStart(2, "0")}</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tags" aria-label="Technologies used">
          {project.tags.map((tag) => (
            <span className="tag" key={tag}>{tag}</span>
          ))}
        </div>
        <a href="#contact" className="project-link">
          Discuss a project <Icon name="arrow" size={14} />
        </a>
      </div>
    </Reveal>
  );
}

export default ProjectCard;
