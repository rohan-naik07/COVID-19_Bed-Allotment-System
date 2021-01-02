import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, CircularProgress, Container, FormGroup, FormControlLabel, Switch, Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    container : {
        height : '50%'
    },
    paper: {
        overflowX: "auto",
        marginBottom: "20px",
        padding : 10
    },
    loading : {
        margin: 'auto',
        paddingTop: '15%'
    },
})

const NewsItem = props=>{
    return (
        <Card backgroundImage={`url(${props.urltoImage})`}>
           <Typography variant = 'h6'>{props.title}</Typography> 
        </Card>
    )
}

const News = (props) =>{
    const classes = useStyles();
    return(
            <Container className={classes.container}>
            <Typography variant='h4' style={{paddingBottom:'10px'}}>
                    Latest News
            </Typography>
                {props.news.map(news=>{
                    return ( <NewsItem author={news.author}
                        title ={news.title}
                        description ={news.description}
                        url = {news.url}
                        urltoImage = {news.urltoImage}
                        publishedAt = {news.publishedAt}
                        content = {news.content}/>);
                })}
        </Container>
    );
}

export default News;

