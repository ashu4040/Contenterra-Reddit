import React, { useEffect, useState } from "react";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [darkMode, setDarkMode] = useState(true); // default dark mode

  useEffect(() => {
    fetch("https://www.reddit.com/r/reactjs.json")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.data.children);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      } min-h-screen p-8 transition-colors duration-500`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end mb-8">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`${
            darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-300 text-gray-900"
          } px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-transform duration-200`}
        >
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>

      {/* Header */}
      <h1
        className={`${
          darkMode ? "text-blue-400" : "text-blue-600"
        } text-3xl font-bold text-center mb-10 transition-colors duration-500`}
      >
        🔥 r/reactjs Reddit Feed
      </h1>

      {/* Posts */}
      <div className="flex flex-wrap gap-8 max-w-[1280px] mx-auto justify-center">
        {posts.map((post, idx) => (
          <div
            key={idx}
            className={`${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
            } 
                       flex flex-col justify-between flex-1 min-w-[300px] max-w-[380px] rounded-xl p-6 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 overflow-hidden break-words border`}
          >
            {/* Top Section */}
            <div>
              <h2
                className={`${
                  darkMode ? "hover:text-blue-400" : "hover:text-blue-600"
                } text-lg font-semibold mb-3 leading-snug transition-colors duration-200`}
              >
                {post.data.title}
              </h2>

              <div
                dangerouslySetInnerHTML={{ __html: post.data.selftext_html }}
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } text-sm mb-4 break-words max-h-48 overflow-y-auto pr-2 custom-scrollbar`}
              />
            </div>

            {/* Bottom Section */}
            <div
              className={`${
                darkMode ? "border-gray-700" : "border-gray-300"
              } border-t pt-3`}
            >
              <a
                href={post.data.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  darkMode ? "text-blue-400" : "text-blue-600"
                } font-medium hover:underline`}
              >
                👉 Visit Post
              </a>

              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } mt-2 text-xs`}
              >
                👍 Score:{" "}
                <span
                  className={`${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  } font-semibold`}
                >
                  {post.data.score}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
