import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

function SkillsPage() {
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get("search") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchResults() {
      if (!searchText.trim()) {
        setResults([]);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/posts?search=${encodeURIComponent(searchText)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }

        const data = await response.json();
        setResults(data);
      } catch {
        setError("Could not load results.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [searchText]);

  return (
    <div className="p-8">
      <h1 className="text-gray-700">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        &gt;{" "}
        <Link to="/skills" className="hover:underline">
          Skills
        </Link>
      </h1>

      {searchText ? (
        <p className="mt-4">Search results for: {searchText}</p>
      ) : (
        <p className="mt-4">No search entered yet.</p>
      )}

      {loading && <p className="mt-4">Loading...</p>}

      {error && <p className="mt-4">{error}</p>}

      {!loading && !error && results.length > 0 && (
        <pre className="mt-4 whitespace-pre-wrap rounded bg-white p-4">
          {JSON.stringify(results, null, 2)}
        </pre>
      )}

      {!loading && !error && searchText && results.length === 0 && (
        <p className="mt-4">No matching results found.</p>
      )}
    </div>
  );
}

export default SkillsPage;
