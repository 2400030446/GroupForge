import { useState, useReducer, useEffect } from "react";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b2a;
    --navy2: #132236;
    --navy3: #1c3152;
    --amber: #e8a030;
    --amber2: #f5c46e;
    --cream: #f5efe6;
    --muted: #7a95b0;
    --green: #3ecf8e;
    --red: #f06060;
    --blue: #4fa3e0;
    --border: rgba(255,255,255,0.07);
    --shadow: 0 4px 24px rgba(0,0,0,0.35);
  }

  body { background: var(--navy); color: var(--cream); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  .nav {
    background: var(--navy2);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between;
    height: 64px;
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(12px);
  }
  .nav-brand {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem; color: var(--amber);
    letter-spacing: 0.5px;
  }
  .nav-brand span { color: var(--cream); }
  .nav-right { display: flex; align-items: center; gap: 1rem; }
  .role-toggle {
    display: flex; gap: 4px;
    background: var(--navy3); border-radius: 8px; padding: 4px;
  }
  .role-btn {
    padding: 6px 14px; border: none; border-radius: 6px;
    font-size: 0.78rem; font-weight: 500; cursor: pointer;
    transition: all 0.2s;
    background: transparent; color: var(--muted);
  }
  .role-btn.active { background: var(--amber); color: var(--navy); }
  .user-badge {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.82rem; color: var(--muted);
  }
  .avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--navy3); border: 2px solid var(--amber);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; color: var(--amber); font-weight: 600;
  }

  /* LAYOUT */
  .layout { display: flex; flex: 1; }
  .sidebar {
    width: 220px; background: var(--navy2);
    border-right: 1px solid var(--border);
    padding: 1.5rem 1rem;
    display: flex; flex-direction: column; gap: 4px;
    min-height: calc(100vh - 64px);
  }
  .sidebar-label {
    font-size: 0.68rem; text-transform: uppercase; letter-spacing: 1.5px;
    color: var(--muted); padding: 0.5rem 0.75rem 0.25rem;
    margin-top: 0.5rem;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 8px;
    cursor: pointer; transition: all 0.15s;
    font-size: 0.88rem; color: var(--muted);
    border: none; background: transparent; width: 100%; text-align: left;
  }
  .nav-item:hover { background: var(--navy3); color: var(--cream); }
  .nav-item.active { background: rgba(232,160,48,0.12); color: var(--amber); }
  .nav-item .icon { font-size: 1rem; width: 20px; text-align: center; }

  /* MAIN */
  .main { flex: 1; padding: 2rem; overflow-y: auto; }
  .page-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem; margin-bottom: 0.25rem; color: var(--cream);
  }
  .page-sub { font-size: 0.85rem; color: var(--muted); margin-bottom: 2rem; }

  /* CARDS */
  .card {
    background: var(--navy2); border: 1px solid var(--border);
    border-radius: 12px; padding: 1.5rem;
    box-shadow: var(--shadow);
  }
  .card-sm { padding: 1.25rem; }
  .card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1rem; margin-bottom: 1rem; color: var(--cream);
  }

  /* GRID */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
  .stack { display: flex; flex-direction: column; gap: 1.25rem; }

  /* STATS */
  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem; color: var(--amber); line-height: 1;
  }
  .stat-label { font-size: 0.78rem; color: var(--muted); margin-top: 4px; }

  /* BADGE */
  .badge {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.3px;
  }
  .badge-green { background: rgba(62,207,142,0.15); color: var(--green); }
  .badge-amber { background: rgba(232,160,48,0.15); color: var(--amber); }
  .badge-red { background: rgba(240,96,96,0.15); color: var(--red); }
  .badge-blue { background: rgba(79,163,224,0.15); color: var(--blue); }
  .badge-muted { background: rgba(122,149,176,0.15); color: var(--muted); }

  /* PROGRESS BAR */
  .progress-wrap { background: var(--navy3); border-radius: 99px; height: 6px; overflow: hidden; margin-top: 8px; }
  .progress-bar { height: 100%; border-radius: 99px; transition: width 0.5s ease; }
  .progress-bar.green { background: var(--green); }
  .progress-bar.amber { background: var(--amber); }
  .progress-bar.blue { background: var(--blue); }

  /* TABLE */
  .table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  .table th { text-align: left; padding: 10px 12px; color: var(--muted); font-weight: 500;
    font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.8px;
    border-bottom: 1px solid var(--border); }
  .table td { padding: 12px 12px; border-bottom: 1px solid var(--border); color: var(--cream); vertical-align: middle; }
  .table tr:last-child td { border-bottom: none; }
  .table tr:hover td { background: rgba(255,255,255,0.02); }

  /* BUTTON */
  .btn {
    padding: 9px 18px; border-radius: 8px; border: none;
    font-size: 0.83rem; font-weight: 500; cursor: pointer; transition: all 0.18s;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-primary { background: var(--amber); color: var(--navy); }
  .btn-primary:hover { background: var(--amber2); transform: translateY(-1px); }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--navy3); color: var(--cream); }
  .btn-danger { background: rgba(240,96,96,0.15); color: var(--red); border: 1px solid rgba(240,96,96,0.2); }
  .btn-sm { padding: 6px 12px; font-size: 0.78rem; }

  /* FORM */
  .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 1rem; }
  .form-label { font-size: 0.78rem; color: var(--muted); }
  .form-input, .form-select, .form-textarea {
    background: var(--navy3); border: 1px solid var(--border);
    border-radius: 8px; padding: 10px 12px;
    color: var(--cream); font-size: 0.85rem; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color 0.15s; width: 100%;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--amber); }
  .form-textarea { resize: vertical; min-height: 80px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; backdrop-filter: blur(4px);
  }
  .modal {
    background: var(--navy2); border: 1px solid var(--border);
    border-radius: 16px; padding: 2rem; width: 480px; max-width: 90vw;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    animation: modalIn 0.2s ease;
  }
  @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: none; } }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; margin-bottom: 1.5rem; }
  .modal-footer { display: flex; gap: 8px; justify-content: flex-end; margin-top: 1.5rem; }

  /* TASK ITEM */
  .task-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid var(--border);
  }
  .task-item:last-child { border-bottom: none; }
  .task-check {
    width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--muted);
    cursor: pointer; flex-shrink: 0; margin-top: 2px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .task-check.done { border-color: var(--green); background: var(--green); }
  .task-title { font-size: 0.88rem; color: var(--cream); }
  .task-title.done { text-decoration: line-through; color: var(--muted); }
  .task-meta { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }
  .task-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }

  /* MILESTONE */
  .milestone-row {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 0; border-bottom: 1px solid var(--border);
  }
  .milestone-row:last-child { border-bottom: none; }
  .milestone-dot {
    width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;
  }
  .milestone-name { font-size: 0.9rem; }
  .milestone-date { font-size: 0.75rem; color: var(--muted); }
  .milestone-right { margin-left: auto; }

  /* GROUP CARD */
  .group-card {
    background: var(--navy2); border: 1px solid var(--border);
    border-radius: 12px; padding: 1.25rem;
    transition: border-color 0.2s, transform 0.2s;
    cursor: pointer;
  }
  .group-card:hover { border-color: var(--amber); transform: translateY(-2px); }
  .group-card-title { font-family: 'Playfair Display', serif; font-size: 1rem; margin-bottom: 6px; }
  .member-avatars { display: flex; gap: -4px; margin-top: 10px; }
  .member-av {
    width: 26px; height: 26px; border-radius: 50%;
    background: var(--navy3); border: 2px solid var(--navy2);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem; color: var(--amber); font-weight: 700;
    margin-right: -6px;
  }

  /* SUBMISSION */
  .sub-card {
    background: var(--navy3); border-radius: 10px; padding: 1rem;
    border: 1px solid var(--border); margin-bottom: 8px;
  }
  .sub-title { font-size: 0.9rem; font-weight: 500; }
  .sub-meta { font-size: 0.76rem; color: var(--muted); margin-top: 3px; }

  /* DIVIDER */
  .divider { height: 1px; background: var(--border); margin: 1.25rem 0; }

  /* ANNOUNCE */
  .announce-item {
    padding: 12px; background: var(--navy3); border-radius: 8px;
    margin-bottom: 8px; border-left: 3px solid var(--amber);
    font-size: 0.84rem;
  }
  .announce-time { font-size: 0.72rem; color: var(--muted); margin-top: 4px; }

  /* TOPBAR */
  .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; }

  /* EMPTY */
  .empty { text-align: center; padding: 2.5rem; color: var(--muted); font-size: 0.88rem; }
  .empty-icon { font-size: 2rem; margin-bottom: 8px; }

  /* ANIM */
  .fade-in { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

  .chip {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--navy3); border-radius: 6px;
    padding: 4px 10px; font-size: 0.75rem; color: var(--muted);
  }

  @media (max-width: 768px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .sidebar { display: none; }
    .form-row { grid-template-columns: 1fr; }
  }
`;

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const INITIAL = {
  projects: [
    {
      id: 1, title: "Library Management System", subject: "DBMS",
      deadline: "2025-03-15", status: "active",
      groups: [
        { id: 1, name: "Group Alpha", members: ["Aryan", "Priya", "Ravi", "Sneha"], progress: 65,
          tasks: [
            { id: 1, title: "Design ER Diagram", assignee: "Aryan", due: "Mar 5", done: true, priority: "high" },
            { id: 2, title: "Implement login module", assignee: "Priya", due: "Mar 8", done: true, priority: "high" },
            { id: 3, title: "Build search feature", assignee: "Ravi", due: "Mar 12", done: false, priority: "medium" },
            { id: 4, title: "Write unit tests", assignee: "Sneha", due: "Mar 14", done: false, priority: "low" },
          ],
          milestones: [
            { id: 1, name: "Requirements Finalized", date: "Feb 20", status: "done" },
            { id: 2, name: "Prototype Ready", date: "Mar 5", status: "done" },
            { id: 3, name: "Core Features Complete", date: "Mar 12", status: "progress" },
            { id: 4, name: "Final Submission", date: "Mar 15", status: "pending" },
          ],
          submission: null,
        },
        { id: 2, name: "Group Beta", members: ["Kavya", "Dev", "Meera"], progress: 40,
          tasks: [
            { id: 1, title: "System design document", assignee: "Kavya", due: "Mar 6", done: true, priority: "high" },
            { id: 2, title: "Database schema", assignee: "Dev", due: "Mar 10", done: false, priority: "high" },
            { id: 3, title: "UI wireframes", assignee: "Meera", due: "Mar 11", done: false, priority: "medium" },
          ],
          milestones: [
            { id: 1, name: "Requirements Finalized", date: "Feb 22", status: "done" },
            { id: 2, name: "Prototype Ready", date: "Mar 8", status: "progress" },
            { id: 3, name: "Core Features Complete", date: "Mar 13", status: "pending" },
            { id: 4, name: "Final Submission", date: "Mar 15", status: "pending" },
          ],
          submission: null,
        },
      ],
    },
    {
      id: 2, title: "E-Commerce Web App", subject: "Web Dev",
      deadline: "2025-04-10", status: "active",
      groups: [
        { id: 3, name: "Group Gamma", members: ["Rohit", "Ananya", "Vikram"], progress: 20,
          tasks: [
            { id: 1, title: "Project planning", assignee: "Rohit", due: "Mar 20", done: true, priority: "high" },
            { id: 2, title: "UI mockups", assignee: "Ananya", due: "Mar 25", done: false, priority: "medium" },
          ],
          milestones: [
            { id: 1, name: "Planning Complete", date: "Mar 20", status: "done" },
            { id: 2, name: "MVP Ready", date: "Apr 1", status: "pending" },
            { id: 3, name: "Final Submission", date: "Apr 10", status: "pending" },
          ],
          submission: null,
        },
      ],
    },
  ],
  announcements: [
    { id: 1, text: "Reminder: Library Management System deadline is March 15. Ensure all milestones are met.", time: "2 hours ago" },
    { id: 2, text: "Group Alpha — your prototype review is scheduled for March 6 at 3 PM.", time: "Yesterday" },
  ],
};

// ─── REDUCER ─────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_TASK": {
      const { projectId, groupId, taskId } = action;
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id !== projectId ? p : {
            ...p,
            groups: p.groups.map(g =>
              g.id !== groupId ? g : {
                ...g,
                tasks: g.tasks.map(t => t.id !== taskId ? t : { ...t, done: !t.done }),
                progress: Math.round(
                  (g.tasks.map(t => t.id !== taskId ? t : { ...t, done: !t.done }).filter(t => t.done).length /
                    g.tasks.length) * 100
                ),
              }
            ),
          }
        ),
      };
    }
    case "ADD_TASK": {
      const { projectId, groupId, task } = action;
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id !== projectId ? p : {
            ...p,
            groups: p.groups.map(g =>
              g.id !== groupId ? g : { ...g, tasks: [...g.tasks, task] }
            ),
          }
        ),
      };
    }
    case "ADD_PROJECT": {
      return { ...state, projects: [...state.projects, action.project] };
    }
    case "ADD_ANNOUNCEMENT": {
      return { ...state, announcements: [action.ann, ...state.announcements] };
    }
    case "SUBMIT_GROUP": {
      const { projectId, groupId, sub } = action;
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id !== projectId ? p : {
            ...p,
            groups: p.groups.map(g =>
              g.id !== groupId ? g : { ...g, submission: sub }
            ),
          }
        ),
      };
    }
    case "GRADE_SUBMISSION": {
      const { projectId, groupId, grade, feedback } = action;
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id !== projectId ? p : {
            ...p,
            groups: p.groups.map(g =>
              g.id !== groupId ? g : { ...g, submission: { ...g.submission, grade, feedback, reviewed: true } }
            ),
          }
        ),
      };
    }
    default: return state;
  }
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const priorityColor = p => p === "high" ? "badge-red" : p === "medium" ? "badge-amber" : "badge-muted";
const milestoneColor = s => s === "done" ? "#3ecf8e" : s === "progress" ? "#e8a030" : "#7a95b0";
const initials = name => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function StatCard({ num, label, color = "var(--amber)" }) {
  return (
    <div className="card card-sm">
      <div className="stat-num" style={{ color }}>{num}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// ── ADMIN VIEWS ───────────────────────────────────────────────────────────────

function AdminDashboard({ state, dispatch, setPage }) {
  const allGroups = state.projects.flatMap(p => p.groups);
  const submitted = allGroups.filter(g => g.submission).length;
  const [annText, setAnnText] = useState("");

  const postAnn = () => {
    if (!annText.trim()) return;
    dispatch({ type: "ADD_ANNOUNCEMENT", ann: { id: Date.now(), text: annText, time: "Just now" } });
    setAnnText("");
  };

  return (
    <div className="fade-in stack">
      <div className="topbar">
        <div>
          <div className="page-title">Overview</div>
          <div className="page-sub">Monitor all projects and group activity</div>
        </div>
        <button className="btn btn-primary" onClick={() => setPage("admin-projects")}>+ New Project</button>
      </div>

      <div className="grid-3">
        <StatCard num={state.projects.length} label="Active Projects" />
        <StatCard num={allGroups.length} label="Groups" color="var(--blue)" />
        <StatCard num={submitted} label="Submissions" color="var(--green)" />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Group Progress</div>
          {allGroups.map(g => (
            <div key={g.id} style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.83rem" }}>
                <span>{g.name}</span>
                <span style={{ color: "var(--muted)" }}>{g.progress}%</span>
              </div>
              <div className="progress-wrap">
                <div className="progress-bar green" style={{ width: `${g.progress}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">Announcements</div>
          {state.announcements.map(a => (
            <div key={a.id} className="announce-item">
              {a.text}
              <div className="announce-time">{a.time}</div>
            </div>
          ))}
          <div className="divider" />
          <div style={{ display: "flex", gap: "8px" }}>
            <input className="form-input" value={annText} onChange={e => setAnnText(e.target.value)}
              placeholder="Post an announcement..." onKeyDown={e => e.key === "Enter" && postAnn()} />
            <button className="btn btn-primary btn-sm" onClick={postAnn}>Post</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">All Groups at a Glance</div>
        <table className="table">
          <thead>
            <tr>
              <th>Group</th><th>Project</th><th>Members</th><th>Progress</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {state.projects.flatMap(p =>
              p.groups.map(g => (
                <tr key={g.id}>
                  <td>{g.name}</td>
                  <td style={{ color: "var(--muted)" }}>{p.title}</td>
                  <td>{g.members.length}</td>
                  <td style={{ width: 140 }}>
                    <div className="progress-wrap">
                      <div className="progress-bar green" style={{ width: `${g.progress}%` }} />
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${g.submission ? "badge-green" : "badge-amber"}`}>
                      {g.submission ? "Submitted" : "In Progress"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminProjects({ state, dispatch }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "", deadline: "" });

  const add = () => {
    if (!form.title || !form.subject || !form.deadline) return;
    dispatch({
      type: "ADD_PROJECT",
      project: { id: Date.now(), ...form, status: "active", groups: [] },
    });
    setForm({ title: "", subject: "", deadline: "" });
    setShowModal(false);
  };

  return (
    <div className="fade-in stack">
      <div className="topbar">
        <div>
          <div className="page-title">Projects</div>
          <div className="page-sub">Assign and manage group projects</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Assign Project</button>
      </div>

      <div className="grid-2">
        {state.projects.map(p => (
          <div key={p.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="card-title" style={{ marginBottom: 4 }}>{p.title}</div>
                <div className="chip" style={{ marginBottom: 10 }}>📚 {p.subject}</div>
              </div>
              <span className="badge badge-green">Active</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: 12 }}>
              📅 Deadline: {p.deadline} &nbsp;·&nbsp; 👥 {p.groups.length} groups
            </div>
            <div className="progress-wrap">
              <div className="progress-bar amber"
                style={{ width: `${p.groups.length ? Math.round(p.groups.reduce((a, g) => a + g.progress, 0) / p.groups.length) : 0}%` }}
              />
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 4 }}>
              Avg progress: {p.groups.length ? Math.round(p.groups.reduce((a, g) => a + g.progress, 0) / p.groups.length) : 0}%
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Assign New Project</div>
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Hospital Management System" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input className="form-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. DBMS" />
              </div>
              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input className="form-input" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={add}>Assign Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminReview({ state, dispatch }) {
  const [gradeModal, setGradeModal] = useState(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  const submitGrade = () => {
    dispatch({ type: "GRADE_SUBMISSION", projectId: gradeModal.projectId, groupId: gradeModal.groupId, grade, feedback });
    setGradeModal(null); setGrade(""); setFeedback("");
  };

  return (
    <div className="fade-in stack">
      <div className="page-title">Review Submissions</div>
      <div className="page-sub">Review and grade final group submissions</div>

      {state.projects.map(p =>
        p.groups.filter(g => g.submission).map(g => (
          <div key={g.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="card-title" style={{ marginBottom: 4 }}>{g.name}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Project: {p.title}</div>
              </div>
              {g.submission.reviewed
                ? <span className="badge badge-green">Graded: {g.submission.grade}</span>
                : <span className="badge badge-amber">Pending Review</span>
              }
            </div>
            <div className="divider" />
            <div className="sub-card">
              <div className="sub-title">📎 {g.submission.filename}</div>
              <div className="sub-meta">Submitted by {g.submission.by} · {g.submission.time}</div>
              {g.submission.note && <div style={{ marginTop: 6, fontSize: "0.82rem", color: "var(--cream)" }}>{g.submission.note}</div>}
            </div>
            {g.submission.reviewed && (
              <div style={{ marginTop: 8, padding: "10px", background: "rgba(62,207,142,0.08)", borderRadius: 8, fontSize: "0.83rem" }}>
                <strong style={{ color: "var(--green)" }}>Feedback:</strong> {g.submission.feedback}
              </div>
            )}
            {!g.submission.reviewed && (
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-primary btn-sm"
                  onClick={() => setGradeModal({ projectId: p.id, groupId: g.id, groupName: g.name })}>
                  Grade Submission
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {state.projects.flatMap(p => p.groups).filter(g => g.submission).length === 0 && (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">📭</div>
            No submissions yet
          </div>
        </div>
      )}

      {gradeModal && (
        <div className="modal-overlay" onClick={() => setGradeModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Grade — {gradeModal.groupName}</div>
            <div className="form-group">
              <label className="form-label">Grade (e.g. A, B+, 85/100)</label>
              <input className="form-input" value={grade} onChange={e => setGrade(e.target.value)} placeholder="Enter grade" />
            </div>
            <div className="form-group">
              <label className="form-label">Feedback</label>
              <textarea className="form-textarea" value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Write your feedback..." />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setGradeModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitGrade}>Submit Grade</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── STUDENT VIEWS ─────────────────────────────────────────────────────────────

// Student always works in Group Alpha (id: 1) of Project 1 for this demo
const STUDENT_PROJECT_ID = 1;
const STUDENT_GROUP_ID = 1;

function StudentDashboard({ state }) {
  const project = state.projects.find(p => p.id === STUDENT_PROJECT_ID);
  const group = project?.groups.find(g => g.id === STUDENT_GROUP_ID);
  if (!project || !group) return <div className="empty">No project assigned.</div>;

  const pending = group.tasks.filter(t => !t.done).length;
  const nextMilestone = group.milestones.find(m => m.status !== "done");
  const announcements = state.announcements;

  return (
    <div className="fade-in stack">
      <div className="page-title">My Dashboard</div>
      <div className="page-sub">{group.name} · {project.title}</div>

      <div className="grid-3">
        <StatCard num={`${group.progress}%`} label="Group Progress" />
        <StatCard num={pending} label="Pending Tasks" color="var(--red)" />
        <StatCard num={group.milestones.filter(m => m.status === "done").length} label="Milestones Done" color="var(--green)" />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Next Milestone</div>
          {nextMilestone ? (
            <div className="milestone-row">
              <div className="milestone-dot" style={{ background: milestoneColor(nextMilestone.status) }} />
              <div>
                <div className="milestone-name">{nextMilestone.name}</div>
                <div className="milestone-date">📅 {nextMilestone.date}</div>
              </div>
              <div className="milestone-right">
                <span className={`badge ${nextMilestone.status === "progress" ? "badge-amber" : "badge-muted"}`}>
                  {nextMilestone.status === "progress" ? "In Progress" : "Upcoming"}
                </span>
              </div>
            </div>
          ) : <div style={{ color: "var(--green)", fontSize: "0.88rem" }}>🎉 All milestones complete!</div>}

          <div className="divider" />
          <div className="card-title">Overall Progress</div>
          <div className="progress-wrap" style={{ height: 10 }}>
            <div className="progress-bar green" style={{ width: `${group.progress}%` }} />
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6 }}>{group.progress}% complete</div>
        </div>

        <div className="card">
          <div className="card-title">Announcements</div>
          {announcements.length === 0 && <div className="empty"><div className="empty-icon">📭</div>No announcements</div>}
          {announcements.map(a => (
            <div key={a.id} className="announce-item">{a.text}<div className="announce-time">{a.time}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentTasks({ state, dispatch }) {
  const project = state.projects.find(p => p.id === STUDENT_PROJECT_ID);
  const group = project?.groups.find(g => g.id === STUDENT_GROUP_ID);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", assignee: "", due: "", priority: "medium" });

  if (!project || !group) return null;

  const add = () => {
    if (!form.title || !form.assignee) return;
    dispatch({
      type: "ADD_TASK",
      projectId: STUDENT_PROJECT_ID, groupId: STUDENT_GROUP_ID,
      task: { id: Date.now(), ...form, done: false },
    });
    setForm({ title: "", assignee: "", due: "", priority: "medium" });
    setShowModal(false);
  };

  return (
    <div className="fade-in stack">
      <div className="topbar">
        <div>
          <div className="page-title">Tasks</div>
          <div className="page-sub">{group.tasks.filter(t => t.done).length}/{group.tasks.length} completed</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Task</button>
      </div>

      <div className="card">
        {group.tasks.map(t => (
          <div key={t.id} className="task-item">
            <div
              className={`task-check ${t.done ? "done" : ""}`}
              onClick={() => dispatch({ type: "TOGGLE_TASK", projectId: STUDENT_PROJECT_ID, groupId: STUDENT_GROUP_ID, taskId: t.id })}
            >
              {t.done && <span style={{ color: "#0d1b2a", fontSize: "0.65rem", fontWeight: 700 }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div className={`task-title ${t.done ? "done" : ""}`}>{t.title}</div>
              <div className="task-meta">👤 {t.assignee} &nbsp;·&nbsp; 📅 {t.due}</div>
            </div>
            <div className="task-right">
              <span className={`badge ${priorityColor(t.priority)}`}>{t.priority}</span>
            </div>
          </div>
        ))}
        {group.tasks.length === 0 && <div className="empty"><div className="empty-icon">✅</div>No tasks yet. Add your first!</div>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add New Task</div>
            <div className="form-group">
              <label className="form-label">Task Title</label>
              <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Build login page" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Assignee</label>
                <select className="form-select" value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })}>
                  <option value="">Select member</option>
                  {group.members.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input className="form-input" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} placeholder="e.g. Mar 10" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={add}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StudentMilestones({ state }) {
  const project = state.projects.find(p => p.id === STUDENT_PROJECT_ID);
  const group = project?.groups.find(g => g.id === STUDENT_GROUP_ID);
  if (!project || !group) return null;

  return (
    <div className="fade-in stack">
      <div className="page-title">Milestones</div>
      <div className="page-sub">Track your project milestones</div>

      <div className="card">
        <div style={{ position: "relative", paddingLeft: "2rem" }}>
          <div style={{ position: "absolute", left: "5px", top: 0, bottom: 0, width: 2, background: "var(--border)" }} />
          {group.milestones.map((m, i) => (
            <div key={m.id} style={{ position: "relative", marginBottom: i < group.milestones.length - 1 ? "1.5rem" : 0 }}>
              <div style={{
                position: "absolute", left: "-2rem",
                width: 14, height: 14, borderRadius: "50%",
                background: milestoneColor(m.status),
                border: "2px solid var(--navy2)",
                boxShadow: `0 0 0 3px ${milestoneColor(m.status)}33`,
                top: 2,
              }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontSize: "0.76rem", color: "var(--muted)", marginTop: 2 }}>📅 {m.date}</div>
                </div>
                <span className={`badge ${m.status === "done" ? "badge-green" : m.status === "progress" ? "badge-amber" : "badge-muted"}`}>
                  {m.status === "done" ? "✓ Done" : m.status === "progress" ? "In Progress" : "Upcoming"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentSubmit({ state, dispatch }) {
  const project = state.projects.find(p => p.id === STUDENT_PROJECT_ID);
  const group = project?.groups.find(g => g.id === STUDENT_GROUP_ID);
  const [filename, setFilename] = useState("FinalReport_GroupAlpha.pdf");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  if (!project || !group) return null;

  const submit = () => {
    if (!filename.trim()) return;
    dispatch({
      type: "SUBMIT_GROUP", projectId: STUDENT_PROJECT_ID, groupId: STUDENT_GROUP_ID,
      sub: { filename, note, by: "Aryan (Group Lead)", time: "Just now", reviewed: false, grade: null, feedback: null },
    });
    setDone(true);
  };

  if (group.submission) {
    return (
      <div className="fade-in stack">
        <div className="page-title">Submission</div>
        <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📬</div>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", marginBottom: "0.5rem" }}>Submitted!</div>
          <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1.5rem" }}>
            Your work is under review by the teacher.
          </div>
          <div className="sub-card" style={{ textAlign: "left" }}>
            <div className="sub-title">📎 {group.submission.filename}</div>
            <div className="sub-meta">By {group.submission.by} · {group.submission.time}</div>
            {group.submission.note && <div style={{ marginTop: 6, fontSize: "0.83rem" }}>{group.submission.note}</div>}
          </div>
          {group.submission.reviewed && (
            <div style={{ marginTop: "1rem", padding: "1rem", background: "rgba(62,207,142,0.08)", borderRadius: 10, textAlign: "left" }}>
              <div style={{ color: "var(--green)", fontWeight: 600, marginBottom: 4 }}>Grade: {group.submission.grade}</div>
              <div style={{ fontSize: "0.85rem" }}>{group.submission.feedback}</div>
            </div>
          )}
          {!group.submission.reviewed && (
            <span className="badge badge-amber" style={{ marginTop: "1rem", display: "inline-block" }}>⏳ Awaiting review</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in stack">
      <div className="page-title">Submit Group Work</div>
      <div className="page-sub">Upload your final deliverable for review</div>

      <div className="card">
        <div style={{
          border: "2px dashed var(--border)", borderRadius: 10, padding: "2rem",
          textAlign: "center", marginBottom: "1.5rem", cursor: "pointer",
          transition: "border-color 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--amber)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = ""}
        >
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>📁</div>
          <div style={{ fontSize: "0.88rem", color: "var(--muted)" }}>Click to upload or drag & drop</div>
          <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 4 }}>PDF, ZIP, DOCX up to 50MB</div>
        </div>

        <div className="form-group">
          <label className="form-label">File Name</label>
          <input className="form-input" value={filename} onChange={e => setFilename(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Note to Teacher (optional)</label>
          <textarea className="form-textarea" value={note} onChange={e => setNote(e.target.value)} placeholder="Any notes for the reviewer..." />
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn btn-primary" onClick={submit}>Submit Work</button>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Group Alpha · {group.members.length} members</div>
        </div>
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const ADMIN_NAV = [
  { id: "admin-dash", label: "Dashboard", icon: "🏠" },
  { id: "admin-projects", label: "Projects", icon: "📋" },
  { id: "admin-review", label: "Review Submissions", icon: "📝" },
];
const STUDENT_NAV = [
  { id: "student-dash", label: "Dashboard", icon: "🏠" },
  { id: "student-tasks", label: "My Tasks", icon: "✅" },
  { id: "student-milestones", label: "Milestones", icon: "🏁" },
  { id: "student-submit", label: "Submit Work", icon: "📬" },
];

export default function App() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const [role, setRole] = useState("student");
  const [page, setPage] = useState("student-dash");

  const nav = role === "admin" ? ADMIN_NAV : STUDENT_NAV;

  const switchRole = (r) => {
    setRole(r);
    setPage(r === "admin" ? "admin-dash" : "student-dash");
  };

  const renderPage = () => {
    switch (page) {
      case "admin-dash": return <AdminDashboard state={state} dispatch={dispatch} setPage={setPage} />;
      case "admin-projects": return <AdminProjects state={state} dispatch={dispatch} />;
      case "admin-review": return <AdminReview state={state} dispatch={dispatch} />;
      case "student-dash": return <StudentDashboard state={state} />;
      case "student-tasks": return <StudentTasks state={state} dispatch={dispatch} />;
      case "student-milestones": return <StudentMilestones state={state} />;
      case "student-submit": return <StudentSubmit state={state} dispatch={dispatch} />;
      default: return null;
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-brand">Group<span>Forge</span></div>
          <div className="nav-right">
            <div className="role-toggle">
              <button className={`role-btn ${role === "student" ? "active" : ""}`} onClick={() => switchRole("student")}>
                🎓 Student
              </button>
              <button className={`role-btn ${role === "admin" ? "active" : ""}`} onClick={() => switchRole("admin")}>
                👩‍🏫 Teacher
              </button>
            </div>
            <div className="user-badge">
              <div className="avatar">{role === "admin" ? "T" : "A"}</div>
              {role === "admin" ? "Dr. Sharma" : "Aryan K."}
            </div>
          </div>
        </nav>

        {/* LAYOUT */}
        <div className="layout">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="sidebar-label">Menu</div>
            {nav.map(item => (
              <button key={item.id}
                className={`nav-item ${page === item.id ? "active" : ""}`}
                onClick={() => setPage(item.id)}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </aside>

          {/* MAIN */}
          <main className="main">
            {renderPage()}
          </main>
        </div>
      </div>
    </>
  );
}
