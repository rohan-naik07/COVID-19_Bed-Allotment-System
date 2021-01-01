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

const News = () =>{
    const classes = useStyles();
    const dummy = null;
    const [spinner, setSpinner] = useState(true);
    const [News,setNews] = useState([]);
    const fetchCases = () => {
        axios({
            method:'get',
            headers: {
                'Content-type':'application/json'
            },
            url: 'https://newsapi.org/v2/everything?q=covid AND india&apiKey=13cb9c6ff1be40f8bb5ee37eef23c446'
            })
            .then(data => {
                console.log('state')
                console.log(data)
                setTimeout(() => setSpinner(false), 1000);
                setNews(data.data.articles);
            })
            .catch((e) => window.alert(e.message))
    }

    useEffect(() => {
        fetchCases()
    },[dummy]);

    return(
        <div className="charts">
        {
            spinner ?
                (
                    <div className={classes.loading}>
                        <CircularProgress />
                        <Typography variant="h6">Loading your data..</Typography>
                    </div>
                ):(
                    <Container className={classes.container}>
                        <Typography variant='h4' style={{paddingBottom:'10px'}}>
                               Latest News
                        </Typography>
                            {News.map(news=>{
                               return ( <NewsItem author={news.author}
                                    title ={news.title}
                                    description ={news.description}
                                    url = {news.url}
                                    urltoImage = {news.urltoImage}
                                    publishedAt = {news.publishedAt}
                                    content = {news.content}/>);
                            })}
                    </Container>
                )
        }
    </div>  
    );
}

export default News;

