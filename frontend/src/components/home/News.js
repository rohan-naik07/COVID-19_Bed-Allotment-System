import React from 'react';
import { Typography,Card,Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import Link from '@material-ui/core/Link'


const useStyles = makeStyles(theme=>({
    card: {
        maxWidth: 300,
        margin: "auto",
        transition: "0.3s",
        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
        "&:hover": {
            boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
        }
    },
    container : {
        height : '50%'
    },
    content: {
        textAlign: "left",
        padding: theme.spacing.unit * 3
    },
    divider: {
        margin: `${theme.spacing.unit * 3}px 0`
    },
    paper: {
        padding : 10,
        display : 'inline-block'
    },
    media: {
        paddingTop: "56.25%"
    },
    loading : {
        margin: 'auto',
        paddingTop: '15%'
    }
}))

const NewsItem = props=>{
    const classes = useStyles();
    const urltoImage = props.urltoImage;
    return (
        <Link target="_blank" to={`http:\\${props.url}`} style={{
            textDecoration : 'none'
        }}>
        <Card className={classes.card}>
            <CardMedia className={classes.media} image={urltoImage}/>
            <CardContent className={classes.content}>
                <Typography
                    className={"MuiTypography--heading"}
                    variant={"h6"}
                    gutterBottom>
                   {props.title}
                </Typography>
                <Typography
                    className={"MuiTypography--subheading"}
                    variant={"caption"}>
                    {props.description}
                </Typography>
                <Divider className={classes.divider} light />
                <Typography
                    className={"MuiTypography--subheading"}
                    variant={"h6"}>
                    {new Date(props.publishedAt).toDateString()}
                </Typography>
            </CardContent>
        </Card></Link>
    )
}

const News = (props) =>{
    const classes = useStyles();
    return(
            <Grid container className={classes.container} spacing={3}>
                <Grid item xs={12}>
                <Typography variant='h4' style={{paddingBottom:'10px'}}>
                    Latest News
                </Typography>
            </Grid>
            {props.news.slice(0,12).map((news,i)=>{
                    return (
                    <Grid item xs={12} md={4} lg={4} key={i}>
                        <NewsItem author={news.author}
                            title ={news.title}
                            description ={news.description}
                            url = {news.url}
                            urltoImage = {news.urlToImage}
                            publishedAt = {news.publishedAt}
                            content = {news.content}/>
                    </Grid>   
                   );
                })}
        </Grid>
    );
}

export default News;

