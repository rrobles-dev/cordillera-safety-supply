import { PostTable } from "./features/posts/components/PostTable";
import { PostForm } from './features/posts/components/PostForm';

export default function App() {
  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">Cordillera Safety Supply</p>
        <h1>Social Post Planner</h1>
        <p className="subtitle">Plan the social media posts that promote our mining safety products.</p>
      </header>

      <main className="layout">
        <section className="card" aria-labelledby="filter-title">
          <h2 id="filter-title">Filter</h2>
          <p className="placeholder">Filter by product. Coming next.</p>
        </section>

        <section className="card" aria-labelledby="posts-title">
          <h2 id="posts-title">Posts</h2>
          <PostTable />
        </section>

        <section className="card" aria-labelledby="new-post-title">
          <h2 id="new-post-title">New post</h2>
          <PostForm />
        </section>
      </main>
    </div>
  );
}