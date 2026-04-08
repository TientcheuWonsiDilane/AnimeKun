import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThumbsUp, ThumbsDown, MessageSquare, Search, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Community = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  const fetchPosts = async () => {
    const res = await axios.get(`http://localhost:5000/api/posts?q=${search}`);
    setPosts(res.data);
  };

  useEffect(() => {
  fetchPosts();
}, []);
  const handleReact = async (postId, type) => {
    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/react`, { type }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchPosts();
    } catch (err) { alert("Login to react!"); }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] pt-16 pb-12 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#fff] border-2 border-black p-4 mb-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 rounded-xl">
          <Search className="text-gray-400" />
          <input
            type="text"
            placeholder="Search author, posts, anime, or tags..."
            className="w-full outline-none"
            onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      fetchPosts();
    }
  }}
          />
        </div>

<div className="mb-8 rounded-lg p-8 bg-white border-[2px] border-black shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
  <div className="absolute top-0 right-0 w-28 h-28 bg-yellow-400/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-400/20 transition-colors duration-500"></div>

  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
    <div className="max-w-xl">
      <h2 className="text-xl  font-black uppercase tracking-wide text-black mb-2">
        The Community Section <span className="text-grey-200">.</span>
      </h2>
      <p className="text-sm font-bold text-gray-500 leading-relaxed tracking-wide">
        Share your <span className="text-black">Thoughts</span>, trigger your <span className="text-black">Debates</span>, 
        and react to the <span className="text-black">Spirit</span> of AnimeKun's Community. 
      </p>
    </div>

    <div className="flex gap-4">
      <div className="flex flex-col items-center justify-center w-20 h-20 sm:w-16 sm:h-16 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
        <span className="text-xl">✍️</span>
        <span className="text-[9px] font-black mt-1">Post</span>
      </div>
      <div className="flex flex-col items-center justify-center w-20 h-20 sm:w-16 sm:h-16 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
        <span className="text-xl">🗨️</span>
        <span className="text-[9px] font-black mt-1">Reply</span>
      </div>
      <div className="flex flex-col items-center justify-center w-20 h-20 sm:w-16 sm:h-16 border-2 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
        <span className="text-xl">🔥</span>
        <span className="text-[9px] font-black mt-1">Enjoy</span>
      </div>
    </div>
  </div>
</div>

        <div className="space-y-5">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-[#fff] border-2 max-h-[100vh] md: max-h-[120vh] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden"
            >
              <div className="p-2 flex items-center gap-3 ">
                <img
                  src={post.author.avatar}
                  className="w-12 h-12 p-0.5 rounded-full border-2 border-black object-cover"
                  alt=""
                />
                <div>
                  <p className="font-black text-lg tracking-wide ">
                    {post.author.username}
                  </p>
                  <p className="text-[0.75rem] text-gray-500 ">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
             <Link to={`/post/${post._id}`}>
  <div
    className={`pt-2 transition-all duration-500 ${!post.image ? "bg-black h-[200px] md:h-[400px] flex flex-col justify-center align-center border-b-2 border-black" : ""}`}
  >
    <h2
      className={`font-bold mb-1 lg:text-2xl tracking-wide px-3 text-xl ${!post.image ? "text-white text-2xl text-center mb-4" : "text-black"}`}
    >
      {post.title}
    </h2>
    {!post.image && (
      <p
        className={`text-[1rem] mb-2 leading-relaxed px-3 line-clamp-3 ${!post.image ? "text-gray-300 text-center" : "text-gray-700"}`}
      >
        {post.content}
      </p>
    )}

    {post.image && (
      <div className="w-full h-[400px] md:h-[600px] bg-black flex items-center justify-center border-t-2 border-black overflow-hidden">
        <img
          loading="lazy"
          src={post.image}
          className="w-full h-full object-contain"
          alt={post.title}
        />
      </div>
    )}
  </div>
</Link>

              <div className="p-4 bg-[#fff] border-t-3 border-black flex gap-6">
                <button
                  onClick={() => handleReact(post._id, "likes")}
                  className="flex items-center gap-2 font-black text-xs hover:text-blue-600 duration-600 transition-colors "
                >
                  <ThumbsUp
                    size={18}
                    className={
                      post.likes.includes(user?._id)
                        ? "fill-blue-600 text-blue-600"
                        : ""
                    }
                  />{" "}
                  {post.likes.length}
                </button>
                <button
                  onClick={() => handleReact(post._id, "dislikes")}
                  className="flex items-center gap-2 font-black text-xs hover:text-red-600  duration-600  transition-colors"
                >
                  <ThumbsDown
                    size={18}
                    className={
                      post.dislikes.includes(user?._id)
                        ? "fill-red-600 text-red-600"
                        : ""
                    }
                  />{" "}
                  {post.dislikes.length}
                </button>
                <div className="flex items-center gap-2 font-black text-xs">
                  <MessageSquare size={18} /> {post.comments.length}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;