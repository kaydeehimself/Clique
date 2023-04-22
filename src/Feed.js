//import dependency components
import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux';
import FlipMove from 'react-flip-move'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

//import custom components
import './Feed.css';
import InputOption from './InputOption';
import Post from './Post';
import { db, } from './firebase';
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
  const [isOpenPicture, setIsOpenPicture] = useState(false);
  const [isOpenVideo, setIsOpenVideo] = useState(false);
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const pictureInputRef = useRef(null);
  const videoInputRef = useRef(null);
  
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
    db.collection("posts").add({
      name: user.displayName,
      description: user.email,
      message: input,
      photoUrl: user.photoUrl || `https://ui-avatars.com/api/?name=${user.email[0]}`,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    
    setInput("");
  };  
  
  const deletePost = (postId) => {
    db.collection('posts').doc(postId).delete();
  }
  
  const handleModalClosePicture = () => setIsOpenPicture(false);
  const handleOpenPicture = () => setIsOpenPicture(true);
  const handleModalCloseVideo = () => setIsOpenVideo(false);
  const handleOpenVideo = () => setIsOpenVideo(true);

  const handleMediaChange = event => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setMedia(event.target.files[0]);
        setPreviewUrl(reader.result);
        setMediaType(event.target.accept === 'image/*' ? 'image' : 'video');
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleCaptionChange = event => {
    setCaption(event.target.value);
  };

  const handleUpload = async (retryCount = 0) => {
    if (!media) {
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(media.name);
      await fileRef.put(media);
      const downloadUrl = await fileRef.getDownloadURL();
      const db = firebase.firestore();
      await db.collection('posts').add({
        [mediaType + 'Url']: downloadUrl,
        caption: caption,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      setMedia(null);
      setCaption('');
      setPreviewUrl(null);
      setMediaType(null);
      setUploading(false);
      handleModalClosePicture();
      handleModalCloseVideo();
    } catch (error) {
      console.error(error);
      setUploadError(error.message);
      setUploading(false);
      if (retryCount < 3) {
        setTimeout(() => handleUpload(retryCount + 1), 1000);
        handleCancel();
      }
    }
  };

  const handleCancel = () => {
    setMedia(null);
    setCaption('');
    setPreviewUrl(null);
    setMediaType(null);    
    handleModalClosePicture();
    handleModalCloseVideo();
    setUploading(false);
  };

  const handleOutsideClick = event => {
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  };  
  
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
        {
          isOpenPicture && 
          <div className="modal" onClick={handleOutsideClick}>
            <div className="modal-content">
              <h2>Upload Picture</h2>
              {previewUrl && (
                mediaType === 'image' ? (
                  <img src={previewUrl} alt="Preview" className="preview" />
                ) : (
                  <video src={previewUrl} alt="Preview" className="preview" controls />
                )
              )}
              <div>
                <label htmlFor="picture-input">Select a picture:</label>
                <input type="file" id="picture-input" accept="image/*" onChange={handleMediaChange} ref={pictureInputRef} style={{ display: 'none' }} />
                <button onClick={() => pictureInputRef.current.click()}>Choose Picture</button>
              </div>              
              <input
                type="text"
                placeholder="Caption"
                value={caption}
                onChange={handleCaptionChange}
              />
              <button onClick={handleUpload} disabled={!media || uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              <button onClick={handleCancel}>Cancel</button>
              {uploadError && <p className="error">{uploadError}</p>}
            </div>
          </div>    
        }

        {
          isOpenVideo && 
          <div className="modal" onClick={handleOutsideClick}>
            <div className="modal-content">
              <h2>Upload Video</h2>
              {previewUrl && (
                mediaType === 'image' ? (
                  <img src={previewUrl} alt="Preview" className="preview" />
                ) : (
                  <video src={previewUrl} alt="Preview" className="preview" controls />
                )
              )}              
              <div>
                <label htmlFor="video-input">Select a video:</label>
                <input type="file" id="video-input" accept="video/*" onChange={handleMediaChange} ref={videoInputRef} style={{ display: 'none' }} />
                <button onClick={() => videoInputRef.current.click()}>Choose Video</button>
              </div>
              <input
                type="text"
                placeholder="Caption"
                value={caption}
                onChange={handleCaptionChange}
              />
              <button onClick={handleUpload} disabled={!media || uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              <button onClick={handleCancel}>Cancel</button>
              {uploadError && <p className="error">{uploadError}</p>}
            </div>
          </div>    
        }
        <div className="feed_inputOptions">
          <InputOption Icon={ImageIcon} title="Picture" color="#70B5F9" openModal = {handleOpenPicture} />          
          <InputOption Icon={SubscriptionsIcon} title="Video" color="#E7A33E" openModal = {handleOpenVideo}/>          
          <InputOption Icon={EventNoteIcon} color="#C0CBCD" title ='Event'/>
          <InputOption Icon={CalendarViewDayIcon} title="Article" color="#7FC15E" />
        </div>        
      </div>
      
      {/* Posts */}
      <FlipMove>
        {posts.map(({id, data:{ name, description, message, photoUrl, timestamp, }}) => {
          return(
            <Post 
              key={id}
              id ={id}
              name={name}
              description={description}
              message={message}
              photoUrl={photoUrl}
              deletePost = {deletePost}
              timestamp = {timestamp}
            />   
          )})}
      </FlipMove>
      <div className="space"></div>    
    </div>
  );
};
export default Feed