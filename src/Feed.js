//import dependency components
import React, { useEffect } from 'react'
import { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useSelector } from 'react-redux';
import FlipMove from 'react-flip-move'

//import custom components
import './Feed.css';
import InputOption from './InputOption';
import Post from './Post';
import { db } from './firebase';
import { selectUser } from './features/userSlice';

//import Icon
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';

function Feed() {
  const user = useSelector(selectUser)
  const [input, setInput] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection('posts')
    .orderBy('timestamp', 'desc')
    .onSnapshot((snapshot) => 
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data()
        }))
      )
    );
  }, [])

  const sendPost = (e) => {
    e.preventDefault();

    db.collection('posts').add({
      name: user.displayName,
      description: user.email,
      message: input,
      photoUrl: user.photoUrl || 'user.email[0]',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setInput('')
  }
  
  return (
    <div className="feed">
      <div className="feed_inputContainer">
        <div className="feed_input">
          <CreateIcon />
          <form>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)} 
              type="text" 
            />
            <button onClick={sendPost} type='submit'>Send</button>
          </form>
        </div>
        <div className="feed_inputOptions">
          <InputOption Icon={ImageIcon} title="Photo" color="#70B5F9"/>
          <InputOption Icon={SubscriptionsIcon} title="Video" color="#E7A33E"/>
          <InputOption Icon={EventNoteIcon} color="#C0CBCD" title ='Event'/>
          <InputOption
            Icon={CalendarViewDayIcon}
            title="Article"
            color="#7FC15E"
          />
        </div>
      </div>
      
      {/* Posts */}
      <FlipMove>
        {posts.map(({id, data:{ name, description, message, photoUrl }}) => {
          return(
            <Post 
            key={id}
            name={name}
            description={description}
            message={message}
            photoUrl={photoUrl}          
          />      
          )})}
      </FlipMove>     
    </div>
  );
};
export default Feed