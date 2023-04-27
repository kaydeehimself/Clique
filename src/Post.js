import React, { forwardRef, useState } from 'react'
import InputOption from './InputOption';
import './Post.css'
import { Avatar } from '@mui/material'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';

const Post = forwardRef(({ id, name, description, message, photoUrl, deletePost, timestamp, mediaUrl, mediaType, caption },ref) => {
    const [click, setClick] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    
    const handleDeletePost = () => {
        deletePost(id);
        closeModal();
    };
    
    const doClick = () => setClick(!click);
    const undoClick = () => setClick(false);

    
  return (
    <div ref={ref} className="post">
        <div className="post_header">
            <Avatar src ={photoUrl}>{name ? name[0] : ''}</Avatar>
            <div className="post_info">
                <h2>{name}</h2>
                <p>{description}</p>
                <p>{new Date(timestamp?.toDate()).toLocaleString()}</p>
            </div>
        </div>       
        <div className="ellipsis">
            <MoreVertRoundedIcon 
                onClick = {doClick}
                style = {{
                    position: 'absolute',
                    top: '-2em',
                    right: '-0.5em',
                    cursor: 'pointer',
                    color: 'grey',
                }}
            />
            {
                click && 
                <ul onClick={openModal}>
                    <li onClick={undoClick}>Delete Post</li>
                </ul>
                }
        </div>
        {
            isOpen && 
            <div className="delete-modal">
                <div className="delete-modal-content">
                    <p>Are you sure you want to delete this post?</p>
                    <button onClick={handleDeletePost}className="yes">Yes, delete</button>
                    <button onClick={closeModal}className="no">No, cancel</button>
                </div>                
            </div>
        }
        <div className="post_body">
            <p>{message}</p>
            {mediaType && (
                <div className="post-media">
                    {mediaType === 'image' ? (
                    <img src={mediaUrl} alt="Post" />
                    ) : (
                    <video src={mediaUrl} alt="Post" controls />
                    )}
                    <p>{caption}</p>
                </div>
            )}

        </div>
        <div className="post_buttons">
            <InputOption Icon={ThumbUpAltOutlinedIcon} title='Like'
            color='grey'/>
            <InputOption Icon={ChatOutlinedIcon} title='Comment'
            color='grey'/>
            <InputOption Icon={ShareOutlinedIcon} title='Share'
            color='grey'/>
            <InputOption Icon={SendOutlinedIcon} title='Send'
            color='grey'/>
        </div> 
    </div>
  )
})

export default Post