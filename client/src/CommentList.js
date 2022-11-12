import React, { useState, useEffect } from 'react'
import axios from 'axios'

const CommentList = ({ comments }) => {

  return (
    <ul>
        {comments.map(comment => {

          let content;
          if(comment.status === 'approved') {
            content = comment.content;
          } else if(comment.status === 'pending') {
            content = 'This comment is awaiting moderation';
          } else {
            content = 'This comment has been rejected';
          }

          return <li key={comment.id}>{content}</li>
        })}
    </ul>
  )
}

export default CommentList
