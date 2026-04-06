import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, MessageCircle, Share2, CornerDownRight } from 'lucide-react';
import axios from 'axios';

const PostDetails = ({ currentUser }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
      setPost(res.data);
    };
    fetchPost();
  }, [id]);

  const handleComment = async (e, parentId = null) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const text = parentId ? e.target.reply.value : commentText;

    if (!currentUser){ return alert("You must be logged in to comment!");}

    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${id}/comments`, 
        { text, parentCommentId: parentId },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setPost(res.data);
      setCommentText("");
      setReplyTo(null);
    } catch (err) { console.error(err); }
  };

  if (!post) return <div className="p-20 text-center font-black">LOADING...</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
     <div className="lg:w-1/2 lg:h-screen lg:sticky lg:top-0 h-[70vh] border-b-2 lg:border-b-0 lg:border-r-2 border-black bg-black flex items-center justify-center relative overflow-hidden">
  {post.image ? (
    <img 
      src={post.image} 
      className="max-w-full max-h-full object-contain" 
      alt={post.title} 
    />
  ) : (
    <div className="text-white font-black  p-10 text-center tracking-wide text-4xl">
      {post.title}
    </div>
  )}
        
        <div className="absolute bottom-0 w-full px-6 py-2 bg-white/10 backdrop-blur-md border-t-2 border-white flex justify-between items-center text-white">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 font-black"><Heart /> {post.likes.length}</div>
             <div className="flex items-center gap-2 font-black"><MessageCircle /> {post.comments.length}</div>
          </div>
          <div className="flex items-center gap-3">
            <img src={post.author.avatar} className="w-10 h-10 object-cover rounded-full border-2 border-white p-0.5" />
            <span className="tracking-wide text-lg">{post.author.username}</span>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 p-8 lg:px-16 lg:pb-6 lg:pt-16 overflow-y-auto">
        <h1 className="text-2xl lg:text-3xl font-black tracking-wider mb-4 leading-none">{post.title}</h1>
        <p className="text-xl leading-relaxed mb-3 text-gray-800">{post.content}</p>
        
        <div className="flex flex-wrap gap-2 mb-12">
          {post.tags.map(tag => (
            <span key={tag} className="text-blue-500 px-3 py-1 font-black text-sm">
              #{tag}
            </span>
          ))}
        </div>

        <hr className="border-2 border-black mb-10" />

        <section className="space-y-8">
          <h3 className="font-black text-2xl uppercase mb-6">Comments</h3>
          
          <form onSubmit={handleComment} className="flex gap-2 mb-10">
            <textarea
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 border-2 align-middle border-black p-4 font-bold rounded-lg row-span-3 outline-none focus:bg-yellow-50" 
              placeholder="Write a comment..." 
            >
            </textarea>
            <div>
            <button className="bg-black text-white px-4 py-3 mt-4 font-black tracking-wider rounded-xl">Post</button></div>
          </form>

          {post.comments.map(comment => (
            <div key={comment._id} className="border-l-2 border-black pl-6 py-2">
              <div className="flex items-center gap-3 mb-2">
                <img src={comment.user.avatar} className="w-8 h-8 rounded-full object-cover border-2 border-black" />
                <span className="font-black text-sm ">{comment.user.username}</span>
                {comment.user._id === post.author._id && (
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 font-black rounded-sm">OP</span>
                )}
              </div>
              <p className="font-medium text-gray-700 mb-2 ml-1">{comment.text}</p>
              <button 
                onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                className="text-xs font-black hover:underline"
              >
                Reply
              </button>

              {replyTo === comment._id && (
                <form onSubmit={(e) => handleComment(e, comment._id)} className="mt-4 flex gap-2">
                  <input name="reply" className="flex-1 border-2 border-black p-2 text-sm font-bold rounded-lg outline-none focus:bg-yellow-50" placeholder="Replying..." autoFocus />
                  <button className="bg-black text-white px-4 text-xs tracking-wide rounded-xl font-black">Send</button>
                </form>
              )}

              <div className="ml-8 mt-4 space-y-4 border-l-2 border-gray-400 pl-4">
                {comment.replies.map(reply => (
                  <div key={reply._id}>
                    <div className="flex items-center gap-2 mb-1">
                      <img src={reply.user.avatar} className="w-6 h-6 rounded-full border-1 border-black object-cover" />
                      <span className="font-black text-xs">{reply.user.username}</span>
                      {reply.user._id === post.author._id && <span className="text-[8px] bg-blue-600 text-white px-1 rounded-sm font-black">OP</span>}
                    </div>
                    <p className="text-sm text-gray-600">{reply.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default PostDetails;