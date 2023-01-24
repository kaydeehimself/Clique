import React from 'react'
import './Widgets.css'
import InfoIcon from '@mui/icons-material/Info';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function Widgets() {

    const newsArticle = (heading, subtitle) => {
        return (
            <div className="widgets_article">
                <div className="widgets_articleLeft">
                    <FiberManualRecordIcon />
                </div>

                <div className="widgets_articleRight">
                    <h4>{heading}</h4>
                    <p>{subtitle}</p>
                </div>
            </div>
        )
    }
    
    return (
        <div className="widgets">
            <div className="widgets_header">
                <h2>Linkedin News</h2>
                <InfoIcon />
            </div>
            {newsArticle('Linkedin-Clone is back', 'First stuff - Posts are very cool now')}
            {newsArticle('Corona Virus', 'new variants are emerging across the globe')}
            {newsArticle('Artificial Intelligence', 'Experts warns that revolution is here')}
            {newsArticle('Programming, web', 'Will Nuxtjs replace React')}
            {newsArticle('Graphics design', 'will A.I. take over that too')}
            {newsArticle('ChatGPT', 'First stuff round of funding is almost commplete')}
            {newsArticle('Web development', 'Hot spots for Jobs')}            
        </div>
    )
}