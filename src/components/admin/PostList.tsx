import { Post } from '../../utils/types';

type PostListProps = {
  posts: Post[];
  handlePostStatusChange: (postId: string, status: 'approved' | 'rejected') => void;
};

const PostList = ({ posts, handlePostStatusChange }: PostListProps) => {
  return (
    <div>
      <h2>Post Management</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.status}</td>
              <td>
                <button onClick={() => handlePostStatusChange(post.id, 'approved')}>Approve</button>
                <button onClick={() => handlePostStatusChange(post.id, 'rejected')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostList;
