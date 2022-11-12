import { useState, useEffect } from 'react'
import axios from 'axios'
import CommentCreate from './CommentCreate'
import CommentList from './CommentList'

const PostList = () => {
  const [posts, setPosts] = useState({});
  
  useEffect(() => {
    const fetchPosts = async () => {
        const result = await axios.get('http://posts.com/posts');
        setPosts(result.data);
    }
    fetchPosts();
  }, [])
  return (
    <div className='d-flex flex-row flex-wrap justify-content-between'>
        {Object.values(posts).map(post => (
            <div className="card" style={{ width: "30%", marginBottom: '20px'}} key={post.id}>
                <div className='card-body'>
                  <h3>{post.title}</h3>
                  <CommentList comments={post.comments}/>  
                  <CommentCreate postId={post.id} />
                </div>
            </div>
        ))}
    </div>
  )
}

export default PostList