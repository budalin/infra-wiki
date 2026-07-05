import { NavLink } from 'react-router-dom'
import { topics } from '../topics'

function Sidebar() {
  const grouped = topics.reduce<Record<string, typeof topics>>((accumulator, topic) => {
    const group = accumulator[topic.group]
    if (group) {
      group.push(topic)
    } else {
      accumulator[topic.group] = [topic]
    }
    return accumulator
  }, {})

  return (
    <aside className="sidebar">
      <div className="brand">
        <svg className="brand-logo" viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <linearGradient id="k8s-logo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--k8s-light)" />
              <stop offset="100%" stopColor="var(--k8s)" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="26" fill="none" stroke="url(#k8s-logo)" strokeWidth="4" />
          <path
            d="M32 10 L44 18 L50 32 L44 46 L32 54 L20 46 L14 32 L20 18 Z"
            fill="none"
            stroke="url(#k8s-logo)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="32" r="6" fill="var(--k8s)" />
          <g fill="var(--k8s)">
            <circle cx="32" cy="12" r="3" />
            <circle cx="49" cy="22" r="3" />
            <circle cx="49" cy="42" r="3" />
            <circle cx="32" cy="52" r="3" />
            <circle cx="15" cy="42" r="3" />
            <circle cx="15" cy="22" r="3" />
          </g>
        </svg>
        <div>
          <div className="brand-title">K8s Explorer</div>
          <div className="brand-sub">INTERACTIVE GUIDE</div>
        </div>
      </div>

      <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <span className="nav-dot" />
        Home
      </NavLink>

      {Object.entries(grouped).map(([group, groupTopics]) => (
        <div key={group}>
          <div className="nav-group-label">{group}</div>
          {groupTopics.map((topic) => (
            <NavLink
              key={topic.slug}
              to={`/topic/${topic.slug}`}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-dot" style={{ background: topic.accent }} />
              {topic.title}
            </NavLink>
          ))}
        </div>
      ))}
    </aside>
  )
}

export default Sidebar
