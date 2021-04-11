import React, { Component } from 'react';
import { fetchMovie } from "../actions/movieActions";
import {connect} from 'react-redux';
import {Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs'
import {Form, FormGroup, FormControl, Image } from 'react-bootstrap';
import runtimeEnv from '@mars/heroku-js-runtime-env'

class MovieDetail extends Component {
    constructor(props) {
        super(props);
        this.state = { details: {
                rating: '1',
                name: localStorage.username,
                title: props.selectedMovie.title,
                quote: ''
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateDetails = this.updateDetails.bind(this);
    }
    updateDetails(event){
        let updateDetails = Object.assign({}, this.state.details);

        updateDetails[event.target.id] = event.target.value;
        this.setState({
            details: updateDetails
        });
    }
    handleChange(event){
        this.state.details.quote = event.target.value;
    }
    handleSubmit(event){
        alert('Submitted');
        const env = runtimeEnv();

       fetch(`${env.REACT_APP_API_URL}/reviews`, {
                method: 'POST',
                headers: {

                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify(this.state.details),
                mode: 'cors'
            }).then(res => {
           console.log("Request complete! response:", res);
       });

        event.preventDefault();

    }
    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null) {
            dispatch(fetchMovie(this.props.movieId));
        }
    }

    render() {
        const DetailInfo = () => {
            if (!this.props.selectedMovie) {
                return <div>Loading....</div>
            }

            return (
                <Card>
                    <Card.Header>Movie Detail</Card.Header>
                    <Card.Body>
                        <Image className="image" src={this.props.selectedMovie.imageUrl} thumbnail />
                    </Card.Body>
                    <ListGroup>
                        <ListGroupItem>{this.props.selectedMovie.title}</ListGroupItem>
                        <ListGroupItem>
                            {this.props.selectedMovie.actors.map((actor, i) =>
                                <p key={i}>
                                    <b>{actor.actorName}</b> {actor.characterName}
                                </p>)}
                        </ListGroupItem>
                        <ListGroupItem><h4><BsStarFill/> {this.props.selectedMovie.avgRating}</h4></ListGroupItem>
                    </ListGroup>
                    <Card.Body>
                        {this.props.selectedMovie.reviews.map((review, i) =>
                            <p key={i}>
                                <b>{review.name}</b>&nbsp; {review.quote}
                                &nbsp;  <BsStarFill /> {review.rating}
                            </p>
                        )}
                    </Card.Body>
                    <Card.Body>
                        <div className="Review">
                            <Form onSubmit={this.handleSubmit}>
                                <textarea value={this.state.details.quote} id = 'quote'onChange={this.updateDetails} />

                                <input placeholder={'rating'}
                                       type='number' id = 'rating' value={this.state.details.rating} onChange={this.updateDetails}
                                />
                                <button type='submit'>Submit Review</button>
                            </Form>
                        </div>
                    </Card.Body>
                </Card>
            )
        }

        return (
            <DetailInfo />
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedMovie: state.movie.selectedMovie
    }
}

export default connect(mapStateToProps)(MovieDetail);

