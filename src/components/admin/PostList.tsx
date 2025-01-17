import { useState, useEffect } from 'react';
import { fetchPendingPosts, updatePostStatus } from '../../utils/api/admin';
import { Post } from '../../utils/types';
import { ButtonPrimary } from '../Buttons';
import '../../css/admin_dashboard_styling/postList.css'; // Ensure this file exists

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPendingPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      }
    };
    loadPosts();
  }, []);

  const handleStatusChange = async (postId: string, status: 'accepted' | 'rejected') => {
    try {
      await updatePostStatus(postId, status); // Ensure types align
      setPosts(posts.filter((post) => post.id !== postId)); // Remove updated post
    } catch (error) {
      console.error('Failed to update post status', error);
    }
  };

  return (
    <div className='post-list-container'>
      <h2>Pending Posts</h2>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            <div className="post-details">
              <p className="post-username"> {post.user} </p>
              {post.image_path && (
                <div className="thumbnail-container">
                  <img
                    src={post.image_path}
                    alt={post.description}
                    className="thumbnail"
                  />
                </div>
              )}
              <p>{post.description}</p>
            </div>
            <div className="actions">
              <ButtonPrimary
                onClick={() => handleStatusChange(post.id, 'accepted')}
                text="Accept"
              />
              <ButtonPrimary
                onClick={() => handleStatusChange(post.id, 'rejected')}
                text="Reject"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
